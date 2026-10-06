import { expect, test } from '@playwright/test';

test('renders the application before authentication', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // Keep the login flow pending so the test does not depend on a live IdP.
    let releaseDiscovery!: () => void;
    const discoveryPending = new Promise<void>((resolve) => {
        releaseDiscovery = resolve;
    });
    await page.route('https://id.demo.engity.green/**', async (route) => {
        await discoveryPending;
        await route.abort();
    });

    try {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#app')).toBeVisible();
        await expect(page.getByText('Please wait...')).toBeVisible();
        expect(errors).toEqual([]);
    } finally {
        releaseDiscovery();
    }
});
