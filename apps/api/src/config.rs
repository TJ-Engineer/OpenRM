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
        let evidence_signing_key = match env::var("EVIDENCE_SIGNING_KEY") {
            Ok(value) if !value.trim().is_empty() => value,
            _ if app_env.eq_ignore_ascii_case("production") => {
                return Err(ConfigError::Missing("EVIDENCE_SIGNING_KEY"));
            }
            _ => "openrm-development-evidence-key".to_owned(),
        };
        let evidence_signing_key_id = env::var("EVIDENCE_SIGNING_KEY_ID")
            .ok()
            .filter(|value| !value.trim().is_empty())
            .unwrap_or_else(|| "development".to_owned());

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
        })
    }
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

#[cfg(test)]
mod tests {
    use super::AuthMode;

    #[test]
    fn auth_mode_values_are_distinct() {
        assert_ne!(AuthMode::Dev, AuthMode::Oidc);
    }
}
