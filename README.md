<div align="center">
  <h1>Web Push | Getting Started</h1>

  [Show article](https://geundung.dev/114)

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
    "gcmKey": "GCM API Key HERE",
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

## Preview

![main](https://user-images.githubusercontent.com/26512984/173250652-cdc843de-8c1c-4220-838c-40815189af26.png)

![notification](https://user-images.githubusercontent.com/26512984/173250678-a88651b4-87c5-4f62-b8d2-bdf625e0ac5b.png)
