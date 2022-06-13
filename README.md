<div align="center">

  ![top](https://user-images.githubusercontent.com/26512984/173287314-ba3b8d9b-6303-4e20-93de-cc82f2bfce3a.png)

  <h1>Web Push | Getting Started</h1>

  [Show article](https://geundung.dev/114)

</div>

## Project

```
.
├── README.md
├── config
│   └── default.example.json
├── css
│   └── common.css
├── index.html
├── login.html
├── package.json
├── src
│   ├── 💻 server
│   │   ├── constants.ts
│   │   ├── logger.ts
│   │   ├── middlewares.ts
│   │   ├── server.ts
│   │   └── types.ts
│   └── 🌍 web
│       ├── index.ts
│       └── service-worker.ts
├── tsconfig.json
├── tsconfig.server.json
├── tsconfig.web.json
└── yarn.lock
```

- Server
  - [src/server/server.ts](https://github.com/leegeunhyeok/web-push/blob/main/src/server/server.ts): server entry code
- Web page
  - [src/web/index.ts](https://github.com/leegeunhyeok/web-push/blob/main/src/web/index.ts): page script
  - [src/web/service-worker.ts](https://github.com/leegeunhyeok/web-push/blob/main/src/web/service-worker.ts): service worker script

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
  - How to get GCM API key?
    - Visit [Google Firebase Console](https://console.firebase.google.com) and create project
    - Open Project > Project settings > Cloud Messaging
    - Cloud Messaging API > `Server Key`
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
