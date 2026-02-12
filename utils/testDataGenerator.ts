/**
 * Generate a random full name
 */
export function generateRandomFullName(): string {
    const firstNames = [
        'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma',
        'Robert', 'Lisa', 'James', 'Mary', 'William', 'Patricia',
        'Richard', 'Jennifer', 'Joseph', 'Linda', 'Thomas', 'Barbara'
    ];

    const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis',
        'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas',
        'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia'
    ];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${randomFirstName} ${randomLastName}`;
}

/**
 * Generate a random 10-digit phone number
 * First digit cannot be 0, 1, or 2
 */

export function generateRandomPhoneNumber(): string {
    // Area code: NXX (N = 2-9)
    const areaFirst = Math.floor(Math.random() * 8) + 2; // 2-9
    const areaRest = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const areaCode = `${areaFirst}${areaRest}`;

    // Central office code (prefix): NXX (N = 2-9)
    const prefixFirst = Math.floor(Math.random() * 8) + 2; // 2-9
    const prefixRest = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const prefix = `${prefixFirst}${prefixRest}`;

    // Line number: XXXX (0-9 allowed)
    const lineNumber = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');

    return `(${areaCode})${prefix}-${lineNumber}`;
}

/**
 * Generate a random email address
 */
export function generateRandomEmail(): string {
    const domains = [
        'yopmail.com', 'gmail.com', 'yahoo.com', 'outlook.com',
        'test.com', 'example.com'
    ];

    const randomString = Math.random().toString(36).substring(2, 10);
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];

    return `${randomString}@${randomDomain}`;
}

/**
 * Generate complete random test data object
 */
export function generateRandomTestData() {
    return {
        fullName: generateRandomFullName(),
        phoneNumber: generateRandomPhoneNumber(),
        email: generateRandomEmail(),
    };
}