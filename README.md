<div align="center">
  <h1>Web Push | Getting Started</h1>
</div>

## Setup

- Pre-requirements
  - >= Node 16
  - yarn
    ```bash
    npm i -g yarn
    ```
- create vapid key pairs
  ```bash
  yarn generate-vapid-keys
  ```
- create `config/default.json` (check config/default.example.json)
  ```json
  {
    "gcmKey": "GCM Cloud Messaging API Key HERE",
    "subject": "mailto:your@domain.com",
    "vapid": {
      "public": "PUBLIC KEY HERE",
      "private": "PRIVATE KEY HERE"
    }
  }
  ```
- setup project
  ```bash
  # Install dependencies
  yarn

  # Build scripts (TS -> JS)
  yarn build

  # Start demo server
  yarn start
  ```

Done! visit [http://localhost:8080](http://localhost:8080)
