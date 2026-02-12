import { Page } from '@playwright/test';

/**
 * Build request headers from the current page context: cookies, origin and any session tokens.
 */
export async function buildHeadersFromPage(page: Page): Promise<Record<string, string>> {
    const sessionEntries: Record<string, string> = await page.evaluate(() => {
        const entries: Record<string, string> = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const k = sessionStorage.key(i);
            if (k) entries[k] = sessionStorage.getItem(k) as string;
        }
        return entries;
    });

    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    const headers: Record<string, string> = {
        Accept: 'application/json, text/plain, */*',
        Origin: page.url().startsWith('http') ? new URL(page.url()).origin : '',
    };

    if (cookieHeader) headers['cookie'] = cookieHeader;

    // look for common token keys in sessionStorage and set Authorization
    const tokenKeyCandidates = ['token', 'authToken', 'accessToken', 'sessionToken'];
    for (const k of tokenKeyCandidates) {
        if (sessionEntries[k]) {
            headers['Authorization'] = `Bearer ${sessionEntries[k]}`;
            break;
        }
    }

    if (Object.keys(sessionEntries).length > 0) {
        try {
            headers['x-session-data'] = JSON.stringify(sessionEntries);
        } catch (e) {
            // ignore serialization errors
        }
    }

    return headers;
}

/**
 * Retrieve lead details by id using the page's request context and headers built from the page.
 * Returns an object with the raw response and parsed json (or null if parsing failed).
 */
export async function getLeadDetails(page: Page, leadId: string, apiOrigin?: string) {
    const origin = apiOrigin || (page.url().startsWith('http') ? new URL(page.url()).origin : '');
    const getUrl = `${origin.replace(/\/$/, '')}/v1/public/leads/${leadId}`;

    const headers = await buildHeadersFromPage(page);

    const response = await page.request.get(getUrl, { headers });
    let json: any = null;
    try {
        json = await response.json();
    } catch (e) {
        json = null;
    }
    return { response, json };
}

export default {
    buildHeadersFromPage,
    getLeadDetails,
};
