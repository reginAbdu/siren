import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PropertyEstimatePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    getKitchenCabinetsLabel() {
        return this.page.locator('label').filter({ hasText: 'Kitchen cabinets' });
    }

    getNotSureLabel() {
        return this.page.locator('label').filter({ hasText: 'Not sure' });
    }

    getSingleFamilyHomeLabel() {
        return this.page.locator('label').filter({ hasText: 'Single family home' });
    }

    getNoButton() {
        return this.page.getByText('No', { exact: true });
    }

    getYesButton() {
        return this.page.getByText('Yes');
    }

    getKitchenSizeInput() {
        return this.page.getByRole('textbox', { name: 'Kitchen size in sq. ft.' });
    }

    getBudgetOption() {
        return this.page.getByText('$5K to $10K');
    }

    getFullNameInput() {
        return this.page.getByRole('textbox', { name: 'Full name' });
    }

    getEmailInput() {
        return this.page.getByRole('textbox', { name: 'Email address' });
    }

    getPhoneNumberInput() {
        return this.page.getByRole('textbox', { name: 'Phone number' });
    }

    getNextButton() {
        return this.page.getByRole('button', { name: 'Next' });
    }

    getSubmitButton() {
        return this.page.getByRole('button', { name: 'Submit my request' });
    }

    getConfirmNumberButton() {
        return this.page.locator('//button[@data-autotest-button-edit-phone-number]');
    }

    getThankYouMessage() {
        return this.page.getByText(/thank you/i);
    }
}