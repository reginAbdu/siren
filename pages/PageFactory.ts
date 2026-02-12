import { Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { PropertyEstimatePage } from './PropertyEstimatePage';

export class PageFactory {
    constructor(private page: Page) { }

    getHomePage(): HomePage {
        return new HomePage(this.page);
    }

    getPropertyEstimatePage(): PropertyEstimatePage {
        return new PropertyEstimatePage(this.page);
    }
}