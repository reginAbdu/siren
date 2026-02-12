import { test, expect } from '@playwright/test';
import { PageFactory } from '../pages/PageFactory';
import { WIZARD_HEADERS } from '../utils/constants/constants';
import { testData, testScenarios } from '../data/testData';
import { generateRandomFullName, generateRandomPhoneNumber, generateRandomEmail } from '../utils/testDataGenerator';
import { buildHeadersFromPage, getLeadDetails } from '../utils/apiClient';

test.describe('Complete Property Estimate Flow', () => {
  test('User is able to complete the property estimate flow with valid data', async ({ page }) => {
    const pageFactory = new PageFactory(page);
    const homePage = pageFactory.getHomePage();
    const estimatePage = pageFactory.getPropertyEstimatePage();
    let leadId: string | null = null;
    let apiOrigin: string | undefined = undefined;

    const randomFullName = generateRandomFullName();
    const randomPhoneNumber = generateRandomPhoneNumber();
    const randomEmail = generateRandomEmail();

    await test.step('Navigate to the application', async () => {
      await homePage.goto('/');
      await expect(page).toHaveTitle('Kitchen Remodeling - HomeBuddy');
      await expect(homePage.getZipCodeInput()).toBeVisible();
    });

    await test.step('Fill in zip code "10001" in input field', async () => {
      await homePage.getZipCodeInput().fill(testData.zipCode);
      await expect(homePage.getZipCodeInput()).toHaveValue(testData.zipCode);
    });

    await test.step('Click on Get estimate button', async () => {
      const waitForLeadResponse = page.waitForResponse(response =>
        response.url().includes('/v1/public/leads') && response.request().method() === 'POST'
      );

      await homePage.getEstimateButton().click();

      const leadResponse = await waitForLeadResponse;
      let leadJson: any;
      try {
        leadJson = await leadResponse.json();
      } catch (e) {
        leadJson = null;
      }

      leadId = leadJson?.id || leadJson?.data?.id || leadJson?.uuid || leadJson?.data?.uuid || null;
      test.info().annotations.push({ type: 'lead', description: String(leadId) });

      expect(leadId).toBeTruthy();

      const headers = await buildHeadersFromPage(page);
      test.info().annotations.push({ type: 'request-headers', description: JSON.stringify(headers) });

      apiOrigin = new URL(leadResponse.url()).origin;

      const { response: getResponse, json: getJson } = await getLeadDetails(page, String(leadId), apiOrigin);

      expect(getResponse.ok()).toBeTruthy();

      test.info().annotations.push({ type: 'lead-get', description: String(getJson?.id || getJson?.uuid || '') });

      if (getJson) {
        expect(getJson.fullName || getJson.data?.fullName).toBeTruthy();
        expect(getJson.zipCode || getJson.data?.zipCode).toBe(testData.zipCode);
      }

      await expect(estimatePage.getHeader(WIZARD_HEADERS.KITCHEN_ELEMENTS)).toBeVisible();
    });

    await test.step('Select Kitchen cabinets', async () => {
      await estimatePage.getKitchenCabinetsLabel().click();
      await expect(estimatePage.getKitchenCabinetsLabel()).toBeChecked();
    });

    await test.step('Click on Next button', async () => {
      await expect(estimatePage.getNextButton()).toBeEnabled();
      await estimatePage.getNextButton().click();
      await expect(estimatePage.getHeader(WIZARD_HEADERS.KITCHEN_CABINETS_ACTION)).toBeVisible();
    });

    await test.step('Click on Not sure option', async () => {
      await estimatePage.getNotSureLabel().click();
      await expect(estimatePage.getNotSureLabel()).toBeChecked();
    });

    await test.step('Click on Next button', async () => {
      await expect(estimatePage.getNextButton()).toBeEnabled();
      await estimatePage.getNextButton().click();
      await expect(estimatePage.getHeader(WIZARD_HEADERS.PROPERTY_TYPE)).toBeVisible();
    });

    await test.step('Choose Single family home', async () => {
      await estimatePage.getSingleFamilyHomeLabel().click();
      await expect(estimatePage.getSingleFamilyHomeLabel()).toBeChecked();
    });

    await test.step('Click on Next button', async () => {
      await expect(estimatePage.getNextButton()).toBeEnabled();
      await estimatePage.getNextButton().click();
      await expect(estimatePage.getHeader(WIZARD_HEADERS.MOBILE_HOME)).toBeVisible();
    });

    await test.step('Choose "No" on mobile/modular home question', async () => {
      await estimatePage.getNoButton().click();
    });

    await test.step('Click "Next" button', async () => {
      await expect(estimatePage.getNextButton()).toBeEnabled();
      await estimatePage.getNextButton().click();
      await expect(estimatePage.getHeader(WIZARD_HEADERS.HOMEOWNER)).toBeVisible();
    });

    await test.step('Choose "Yes" as homeowner', async () => {
      await estimatePage.getYesButton().click();
    });

    await test.step('Click "Next" button', async () => {
      await expect(estimatePage.getNextButton()).toBeEnabled();
      await estimatePage.getNextButton().click();
      await expect(estimatePage.getHeader(WIZARD_HEADERS.KITCHEN_SIZE)).toBeVisible();
    });

    await test.step('Fill in kitchen size "100"', async () => {
      await estimatePage.getKitchenSizeInput().fill(testData.kitchenSize);
      await expect(estimatePage.getKitchenSizeInput()).toHaveValue(testData.kitchenSize);
    });

    await test.step('Click Next button', async () => {
      await expect(estimatePage.getNextButton()).toBeEnabled();
      await estimatePage.getNextButton().click();
      await expect(estimatePage.getHeader(WIZARD_HEADERS.BUDGET)).toBeVisible();
    });

    await test.step('Click "$5K to $10K" budget option', async () => {
      await estimatePage.getBudgetOption().click();
      await expect(estimatePage.getBudgetOption()).toBeVisible();
    });

    await test.step('Click "Next" button', async () => {
      await expect(estimatePage.getNextButton()).toBeEnabled();
      await estimatePage.getNextButton().click();
      await expect(estimatePage.getHeader(WIZARD_HEADERS.ESTIMATE_FOR)).toBeVisible();
    });

    await test.step('Fill in full name and email', async () => {
      await estimatePage.getFullNameInput().fill(randomFullName);
      await expect(estimatePage.getFullNameInput()).toHaveValue(randomFullName);

      await estimatePage.getEmailInput().fill(randomEmail);
      await expect(estimatePage.getEmailInput()).toHaveValue(randomEmail);
    });

    await test.step('Click "Next" button', async () => {
      await expect(estimatePage.getNextButton()).toBeEnabled();
      await estimatePage.getNextButton().click();
      await estimatePage.getHeader((WIZARD_HEADERS.ESTIMATE_FOR)).waitFor({ state: 'hidden', timeout: 5000 });
      await expect(estimatePage.getHeader(WIZARD_HEADERS.PHONE_NUMBER)).toBeVisible();
    });

    await test.step('Fill in Phone number', async () => {
      await estimatePage.getPhoneNumberInput().fill(randomPhoneNumber);
      await expect(estimatePage.getPhoneNumberInput()).toHaveValue(`+1${randomPhoneNumber}`);
    });

    await test.step('Click on "Submit my request" button', async () => {
      await estimatePage.getSubmitButton().click({ timeout: 3000 });
      await expect(estimatePage.getSubmitButton()).toBeDisabled();
    });

    await test.step('Click "Confirm number" button if present', async () => {
      const confirmBtn = estimatePage.getConfirmNumberButton();
      const count = await confirmBtn.count();
      if (count > 0) {
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click({ timeout: 3000 });
        }
      }
    });

    await test.step('Verify user is on thank you page', async () => {
      await expect(page).toHaveTitle('Thank you - HomeBuddy');

      if (leadId) {
        const { response: finalResp, json: finalJson } = await getLeadDetails(page, String(leadId), apiOrigin);
        expect(finalResp.ok()).toBeTruthy();
        const status = (finalJson?.leadStatus || finalJson?.data?.leadStatus || '').toString().toLowerCase();
        expect(status).toBe('submitted');
        test.info().annotations.push({ type: 'lead-final-status', description: String(finalJson?.leadStatus || finalJson?.data?.leadStatus || '') });
      } else {
        test.info().annotations.push({ type: 'lead-final-status', description: 'no-lead-id' });
      }
    });
  });

});