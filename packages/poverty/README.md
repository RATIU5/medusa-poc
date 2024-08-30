# Poverty CMS

Poverty is a simple CMS for small websites. It is designed to be easy to use. It is written in Go and uses PostgreSQL as a database.

## Requirements

- Go 1.23 or later
- PostgreSQL 16 or later
- Air (for development)

## File Structure

```mermaid
graph TD
    A[root] --> B[internal]
    A --> C[cmd] --> C1[server]
    A --> D[tmp] --> D1[main]
    D --> E[config.toml]

    F1 --> F6[health] --> F7[health.go]
    B --> F[routes] --> F1[api] --> F2[v1] --> F3[routes.go]
    F --> F8[router.go]
    F2 --> F4[handlers]
    F2 --> F5[routes]
    B --> G[config] --> G1[config.go]
    B --> H[constants] --> H1[constants.go]
    B --> I[database] --> I1[database.go]
    B --> J[errors] --> J1[error.go]
    B --> K[middleware] --> K1[error_handler.go]
    B --> L[server] --> L1[server.go]
    L --> L2[router.go]
    L --> L3[middleware.go]
```

## WIP

I think that Medusa already has a tool to generate a token. As long as the SECRET_KEYs match, we should be able to use it to generate (or use an exsting) token for Poverty.
Have Jordan see if he can send a request to Poverty from Medusa. Needs a button UI to activate the request.
