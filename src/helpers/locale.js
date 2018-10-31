var LocaleCurrency = require('locale-currency');

export function validateLocale(locale) {

    if (typeof locale.iso !== 'string') {
        throw new Error('Locale should specify a ISO code');
    }

    if (!(/^[a-zA-Z]{2}-[a-zA-Z]{2}/.test(locale.iso))) {
        throw new Error('Locale ISO not correct');
    }
}

export function completeLocale(locale) {


    const [language, regio] = locale.iso.toUpperCase().split('-');

    // Language:
    if (!locale.language) {
        locale.language = language;
    }

    // Regio:
    if (!locale.regio) {
        locale.regio = regio;
    }

    // Currency:
    if (!locale.currency) {
        locale.currency = LocaleCurrency.getCurrency(locale.iso);
    }

    return locale;
}