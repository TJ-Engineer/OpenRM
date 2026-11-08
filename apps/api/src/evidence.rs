use std::sync::Arc;

use hmac::{Hmac, Mac};
use sha2::Sha256;

#[derive(Clone)]
pub struct EvidenceSigner {
    key: Arc<[u8]>,
    key_id: Arc<str>,
}

impl EvidenceSigner {
    pub const ALGORITHM: &'static str = "HMAC-SHA256";

    pub fn new(key: impl AsRef<[u8]>, key_id: impl Into<String>) -> Self {
        Self {
            key: Arc::from(key.as_ref()),
            key_id: Arc::from(key_id.into()),
        }
    }

    pub fn development() -> Self {
        Self::new("openrm-development-evidence-key", "development")
    }

    pub fn key_id(&self) -> &str {
        &self.key_id
    }

    pub fn sign(&self, manifest_hash: &str) -> String {
        let mut mac = Hmac::<Sha256>::new_from_slice(&self.key)
            .expect("HMAC accepts keys of any non-empty length");
        mac.update(manifest_hash.as_bytes());
        hex::encode(mac.finalize().into_bytes())
    }

    pub fn verify(&self, manifest_hash: &str, signature: &str) -> bool {
        let Ok(signature) = hex::decode(signature) else {
            return false;
        };
        let Ok(mut mac) = Hmac::<Sha256>::new_from_slice(&self.key) else {
            return false;
        };
        mac.update(manifest_hash.as_bytes());
        mac.verify_slice(&signature).is_ok()
    }
}

#[cfg(test)]
mod tests {
    use super::EvidenceSigner;

    #[test]
    fn signs_and_verifies_manifest_hashes() {
        let signer = EvidenceSigner::new("test-key", "test");
        let signature = signer.sign(&"a".repeat(64));
        assert_eq!(signature.len(), 64);
        assert!(signer.verify(&"a".repeat(64), &signature));
        assert!(!signer.verify(&"b".repeat(64), &signature));
    }
}
