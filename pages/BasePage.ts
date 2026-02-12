import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) { }

    async goto(path: string) {
        await this.page.goto(`${path}`, { timeout: 5000, waitUntil: 'domcontentloaded' });
    }

    getUrl() {
        return this.page.url();
    }

    async getTitle() {
        return await this.page.title();
    }

    async waitForURL(urlPattern: string | RegExp) {
        await this.page.waitForURL(urlPattern);
    }

    async goBack() {
        await this.page.goBack();
    }

    async reload() {
        await this.page.reload();
    }

    async waitForSelector(selector: string) {
        await this.page.waitForSelector(selector);
    }

    getHeader(headerText: string) {
        return this.page.locator(`h4:has-text("${headerText}")`);
    }
}