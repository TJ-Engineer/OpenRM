FROM rust:1.96-bookworm AS builder
WORKDIR /build
COPY Cargo.toml Cargo.lock ./
COPY apps ./apps
COPY db ./db
RUN cargo build --locked --release -p openrm-api

FROM debian:bookworm-slim
RUN apt-get update \
    && apt-get install --yes --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --system --uid 10001 --home-dir /nonexistent --shell /usr/sbin/nologin openrm
COPY --from=builder /build/target/release/openrm-api /usr/local/bin/openrm-api
COPY --from=builder /build/target/release/migrate /usr/local/bin/openrm-migrate
USER 10001:10001
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/openrm-api"]
