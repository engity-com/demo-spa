# Single Page Application Demo using Engity IdP

This Single Page Application demonstrates the integration with the [IdP (Identity Provider) of the Engity GmbH](https://engity.com).

It is available at [https://demo.engity.app](https://demo.engity.app/).

## TOC

1. [Structure](#structure)
2. [Development](#development)
3. [FAQ](#faq)
4. [License](LICENSE)

## Structure

* **OpenID Connect**: [oidc-client-ts](https://github.com/authts/oidc-client-ts) with [react-oidc-context](https://github.com/authts/react-oidc-context) ([src/lib/authentication.tsx](src/lib/authentication.tsx))
  > ℹ️ This project supports multiple sub-paths which are dynamically resolved (configured in [src/environments/environment.ts](src/environments/environment.ts)). As a result, the authentication procedure is a little bit more complex as a regular application. Please keep this in mind.
* **Basic Framework**: [React](https://react.dev/) (entry point: [src/index.tsx](src/index.tsx))


* Language: [TypeScript](https://www.typescriptlang.org/) ([tsconfig.json](tsconfig.json))
* Build system: [RSBuild](https://rsbuild.rs/) ([rsbuild.config.cts](rsbuild.config.cts))
* Linting/Formatting: [Biome](https://biomejs.dev/) ([biome.jsonc](biome.jsonc))
* I18n: [i18next](https://www.i18next.com/) with [react-i18next](https://react.i18next.com/) ([src/lib/i18n.ts](src/lib/i18n.ts))
* Router: [React Router](https://reactrouter.com/)
* Theme: [Radix UI](https://www.radix-ui.com/) with [Lucide React](https://lucide.dev/guide/packages/lucide-react)
* Charts: [React ApexCharts](https://apexcharts.com/docs/react-charts/)

## Development

### Requirements

1. Have at least [Nodejs 23.10+ installed](https://nodejs.org/en/download/) (`node -v`)
2. Have at least [NPM 23.10+ installed](https://nodejs.org/en/download/) (`npm -v` and `npx -v`)
3. Have at least [mkcert v1.4.4 installed](https://github.com/FiloSottile/mkcert) (`mkcert --version`)
4. Have all dependencies installed
    ```shell
    npm install
    ```
5. Have a local CA for your `mkcert` installed (if not already done)
   ```shell
   npm run ensure-ca
   ```
6. Ensure have a certificate and key for local development of this SPA installed
   ```shell
   npm run issue-cert
   ```

### Run

Run the local development server.

```shell
npm run serve
```

Now it will be available at:
1. https://local.engity.dev:4200
2. https://local.engity.dev:4200/magic-link
3. https://local.engity.dev:4200/username

> ℹ️ If you cannot resolve the host, see [FAQ: local.engity.dev cannot be resolved](#localengitydev-cannot-be-resolved);

## FAQ

### local.engity.dev cannot be resolved

Some routers enabled a feature called _DNS rebinding protection_. These will prevent external domains (like `local.engity.dev`) to be resolved to `127.0.0.1`. In this case you need either to tell your router to accept an exception for this domain or simply add an entry to your local `/etc/hosts`:

1. Open the `hosts` file on your operating system:
   * Linux/macOS
     ```shell
     sudo vi /etc/hosts
     ```
   * Windows
     ```shell
     sudo notepad c:\Windows\System32\drivers\etc\hosts
     ```
2. Ensure you have the following content:
   ```
   127.0.0.1  local.engity.dev
   ::1        local.engity.dev
   ```
