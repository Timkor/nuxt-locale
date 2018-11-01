
export function createCore(app, defaultLocale, locales) {

    return {
        
        get iso() {
            return this.currentLocale.iso;
        },

        get language() {
            return this.currentLocale.language;
        },

        get regio() {
            return this.currentLocale.regio;
        },

        get currency() {
            return this.currentLocale.currency;
        },

        //defaultLocale: defaultLocale,
        currentLocale: locales.find(locale => locale.iso === defaultLocale),
        locales: locales,

        route(route) {

        },

        url(route) {

        },

        text(identifier, params) {
            
            const template = app.store.getters['nuxt-locale-store/getValue'](identifier);

            if (typeof template == 'string') {
                
                // Replace params:
                return template.replace(/{{([a-zA-Z0-9]+)}}/g, (value, name) => {
                    return params[name];
                });
            }

            return template;
        },

        number(number, options) {
            return new Intl.NumberFormat(this.iso, {
                ...(options || {})
            }).format(number);
        },

        money(number, options) {
            return new Intl.NumberFormat(this.iso, { 
                style: 'currency', 
                currency: this.currency,
                ...(options || {})
            }).format(number);
        },

        date(date, options) {
            return new Intl.DateTimeFormat(this.iso, {
                ...(options || {})
            }).format(date);
        }
    }
}