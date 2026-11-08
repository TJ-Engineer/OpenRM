use std::{env, net::SocketAddr, str::FromStr};

use thiserror::Error;

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum AuthMode {
    Dev,
    Oidc,
}

#[derive(Clone)]
pub struct Config {
    pub app_env: String,
    pub bind_address: SocketAddr,
    pub database_url: String,
    pub run_migrations: bool,
    pub auth_mode: AuthMode,
    pub oidc_issuer: Option<String>,
    pub oidc_audience: Option<String>,
    pub evidence_signing_key: String,
    pub evidence_signing_key_id: String,
    pub evidence_verification_keys: Vec<(String, String)>,
    pub jira_api_token: Option<String>,
}

#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("{0} is required")]
    Missing(&'static str),
    #[error("{name} has an invalid value: {message}")]
    Invalid { name: &'static str, message: String },
    #[error("AUTH_MODE=dev is forbidden when APP_ENV=production")]
    DevAuthInProduction,
}

impl Config {
    pub fn from_env() -> Result<Self, ConfigError> {
        let app_env = env::var("APP_ENV").unwrap_or_else(|_| "development".to_owned());
        let bind_address = parse(
            "API_BIND_ADDRESS",
            env::var("API_BIND_ADDRESS").unwrap_or_else(|_| "127.0.0.1:8080".to_owned()),
        )?;
        let database_url = required("DATABASE_URL")?;
        let run_migrations = parse(
            "RUN_MIGRATIONS",
            env::var("RUN_MIGRATIONS").unwrap_or_else(|_| "false".to_owned()),
        )?;
        let auth_mode = match env::var("AUTH_MODE")
            .unwrap_or_else(|_| "oidc".to_owned())
            .to_ascii_lowercase()
            .as_str()
        {
            "dev" => AuthMode::Dev,
            "oidc" => AuthMode::Oidc,
            value => {
                return Err(ConfigError::Invalid {
                    name: "AUTH_MODE",
                    message: format!("expected dev or oidc, got {value}"),
                });
            }
        };

        if app_env.eq_ignore_ascii_case("production") && auth_mode == AuthMode::Dev {
            return Err(ConfigError::DevAuthInProduction);
        }

        let (oidc_issuer, oidc_audience) = match auth_mode {
            AuthMode::Dev => (None, None),
            AuthMode::Oidc => (
                Some(required("OIDC_ISSUER")?),
                Some(required("OIDC_AUDIENCE")?),
            ),
        };
        if app_env.eq_ignore_ascii_case("production")
            && !oidc_issuer.as_deref().is_some_and(valid_https_issuer)
        {
            return Err(ConfigError::Invalid {
                name: "OIDC_ISSUER",
                message:
                    "production issuer must be an HTTPS URL without credentials, query, or fragment"
                        .to_owned(),
            });
        }
        let evidence_signing_key = match env::var("EVIDENCE_SIGNING_KEY") {
            Ok(value) if app_env.eq_ignore_ascii_case("production") && value.len() < 32 => {
                return Err(ConfigError::Invalid {
                    name: "EVIDENCE_SIGNING_KEY",
                    message: "production key must contain at least 32 bytes".to_owned(),
                });
            }
            Ok(value) if !value.trim().is_empty() => value,
            _ if app_env.eq_ignore_ascii_case("production") => {
                return Err(ConfigError::Missing("EVIDENCE_SIGNING_KEY"));
            }
            _ => "openrm-development-evidence-key".to_owned(),
        };
        let evidence_signing_key_id = match env::var("EVIDENCE_SIGNING_KEY_ID") {
            Ok(value) if !value.trim().is_empty() => value,
            _ if app_env.eq_ignore_ascii_case("production") => {
                return Err(ConfigError::Missing("EVIDENCE_SIGNING_KEY_ID"));
            }
            _ => "development".to_owned(),
        };
        let evidence_verification_keys = match env::var("EVIDENCE_VERIFICATION_KEYS") {
            Ok(value) if !value.trim().is_empty() => {
                parse_verification_keys(&value, app_env.eq_ignore_ascii_case("production"))?
            }
            _ => Vec::new(),
        };
        if evidence_verification_keys
            .iter()
            .any(|(key_id, _)| key_id == &evidence_signing_key_id)
        {
            return Err(ConfigError::Invalid {
                name: "EVIDENCE_VERIFICATION_KEYS",
                message: "historical key identifiers must differ from EVIDENCE_SIGNING_KEY_ID"
                    .to_owned(),
            });
        }
        let jira_api_token = env::var("JIRA_API_TOKEN")
            .ok()
            .filter(|value| !value.trim().is_empty());

        Ok(Self {
            app_env,
            bind_address,
            database_url,
            run_migrations,
            auth_mode,
            oidc_issuer,
            oidc_audience,
            evidence_signing_key,
            evidence_signing_key_id,
            evidence_verification_keys,
            jira_api_token,
        })
    }
}

fn parse_verification_keys(
    value: &str,
    production: bool,
) -> Result<Vec<(String, String)>, ConfigError> {
    let keys = serde_json::from_str::<std::collections::BTreeMap<String, String>>(value).map_err(
        |error| ConfigError::Invalid {
            name: "EVIDENCE_VERIFICATION_KEYS",
            message: format!("expected a JSON object of key identifiers to keys: {error}"),
        },
    )?;
    if keys.iter().any(|(key_id, key)| {
        key_id.trim().is_empty() || key.trim().is_empty() || (production && key.len() < 32)
    }) {
        return Err(ConfigError::Invalid {
            name: "EVIDENCE_VERIFICATION_KEYS",
            message: "key identifiers and keys must be non-empty, and production keys must contain at least 32 bytes"
                .to_owned(),
        });
    }
    Ok(keys.into_iter().collect())
}

fn required(name: &'static str) -> Result<String, ConfigError> {
    env::var(name)
        .ok()
        .filter(|value| !value.trim().is_empty())
        .ok_or(ConfigError::Missing(name))
}

fn parse<T>(name: &'static str, value: String) -> Result<T, ConfigError>
where
    T: FromStr,
    T::Err: std::fmt::Display,
{
    value.parse().map_err(|error: T::Err| ConfigError::Invalid {
        name,
        message: error.to_string(),
    })
}

fn valid_https_issuer(value: &str) -> bool {
    reqwest::Url::parse(value).is_ok_and(|url| {
        url.scheme() == "https"
            && url.host_str().is_some()
            && url.username().is_empty()
            && url.password().is_none()
            && url.query().is_none()
            && url.fragment().is_none()
    })
}

#[cfg(test)]
mod tests {
    use super::{AuthMode, parse_verification_keys, valid_https_issuer};

    #[test]
    fn auth_mode_values_are_distinct() {
        assert_ne!(AuthMode::Dev, AuthMode::Oidc);
    }

    #[test]
    fn parses_historical_evidence_keys() {
        let keys =
            parse_verification_keys(r#"{"v1":"historical-evidence-key-32-bytes-minimum"}"#, true)
                .expect("valid historical key map");
        assert_eq!(
            keys,
            vec![(
                "v1".to_owned(),
                "historical-evidence-key-32-bytes-minimum".to_owned()
            )]
        );
    }

    #[test]
    fn production_oidc_issuers_use_a_clean_https_origin() {
        assert!(valid_https_issuer("https://identity.example.com"));
        assert!(valid_https_issuer("https://identity.example.com/tenant"));
        assert!(!valid_https_issuer("http://identity.example.com"));
        assert!(!valid_https_issuer(
            "https://user:secret@identity.example.com"
        ));
        assert!(!valid_https_issuer(
            "https://identity.example.com?tenant=other"
        ));
    }
}
