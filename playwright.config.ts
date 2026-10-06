import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'https://127.0.0.1:4173',
        browserName: 'chromium',
        ignoreHTTPSErrors: true,
        locale: 'en-US',
    },
    webServer: {
        command: 'npx rsbuild preview --environment=green --host 127.0.0.1 --port 4173 --strict-port',
        wait: { stdout: /Local:\s+https:\/\/127\.0\.0\.1:4173\// },
    },
});
