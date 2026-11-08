use std::process::ExitCode;

use openrm_api::{
    AppState, BuildInfo, auth::AuthVerifier, config::Config, connect, evidence::EvidenceSigner,
    migrate, policy::PolicyEngine, router,
};
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> ExitCode {
    dotenvy::dotenv().ok();
    init_tracing();

    if let Err(error) = run().await {
        tracing::error!(%error, "OpenRM API stopped");
        return ExitCode::FAILURE;
    }

    ExitCode::SUCCESS
}

async fn run() -> Result<(), Box<dyn std::error::Error>> {
    let config = Config::from_env()?;
    let db = connect(&config).await?;
    if config.run_migrations {
        migrate(&db).await?;
    }
    let auth = AuthVerifier::from_config(&config).await?;
    let evidence_signer = EvidenceSigner::new(
        config.evidence_signing_key.as_bytes(),
        config.evidence_signing_key_id.clone(),
    );
    let outbox_worker = tokio::spawn(openrm_api::outbox::run(db.clone()));
    let app = router(AppState {
        db,
        auth,
        policy: PolicyEngine,
        build: BuildInfo::current(),
        evidence_signer,
    });
    let listener = tokio::net::TcpListener::bind(config.bind_address).await?;
    tracing::info!(address = %config.bind_address, environment = %config.app_env, "OpenRM API listening");
    let serve_result = axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await;
    outbox_worker.abort();
    serve_result?;
    Ok(())
}

fn init_tracing() {
    tracing_subscriber::registry()
        .with(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "openrm_api=info,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer().json())
        .init();
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install termination handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        () = ctrl_c => {},
        () = terminate => {},
    }
}
