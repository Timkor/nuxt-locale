
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

        route(route, params, iso) {


            if (typeof route == 'string') {
                
                if (typeof params == 'string') {
                    iso = params;
                    params = undefined;
                }

                return {
                    name: (iso || this.iso).toLowerCase() + '-' + route,
                    params: params,
                    iso: (iso || this.iso)
                };
            }

            return {
                name: (iso || this.iso).toLowerCase() + '-' + route.name,
                params: route.params,
                iso: (iso || this.iso)
            }
        },

        path(route, params) {

            const normalizedRoute = this.route.apply(this, arguments);

            return app.router.resolve(normalizedRoute).href;
        },

        url(route, params) {

            const normalizedRoute = this.route.apply(this, arguments);

            const normalizedLocale = this.locales.find(
                locale => normalizedRoute.iso.toLowerCase() == locale.iso.toLowerCase()
            )

            

            return normalizedLocale.domain + app.router.resolve(normalizedRoute).href;
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
        },

        fetchScope(scopeId) {

            const path = `_locale/${this.language}/${scopeId}.json`;
                
            return app.$axios.$get(path)
                
                .then(messages => {

                    return {
                        id: scopeId,
                        messages: messages
                    }
                })

                .catch(error => {
                    
                    console.warn(`Could not fetch locale '${scopeId}' at ` + path)

                    return {
                        id: scopeId,
                        messages: {},
                        error: error
                    };
                })
            ;
        }
    }
}