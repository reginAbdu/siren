import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    getZipCodeInput() {
        return this.page.locator('#zipCode');
    }

    getEstimateButton() {
        return this.page.locator('#zip_header').getByRole('button', { name: 'Get estimate' });
    }
}