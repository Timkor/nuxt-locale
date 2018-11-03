function stripLocaleFromPath(path) {
    
    const result = path.match(/^\/([a-z]{2}-[a-z]{2})/);
                
    if (result.length) {
        return path.substring(result[0].length);
    }

    return path;
}

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

            if (typeof params == 'string') {
                iso = params;
                params = undefined;
            }

            iso = (iso || this.iso).toLowerCase();

            var localizedRoute;
            if (typeof route == 'string') {
                
                localizedRoute = {
                    name: iso + '-' + route,
                    params: params,
                };
            } else {
                localizedRoute = {
                    name: iso + '-' + route.name,
                    params: route.params,
                    query: route.query,
                }
            }

            // Attach found locale:
            localizedRoute.locale = this.locales.find(
                locale => iso == locale.iso.toLowerCase()
            );

            return localizedRoute;
        },

        path(route, params) {

            const normalizedRoute = this.route.apply(this, arguments);

            var path = app.router.resolve(normalizedRoute).href;

            if (this.currentLocale == normalizedRoute.locale) {
                path = stripLocaleFromPath(path);
            }

            return path.length > 0 ? path : '/';
        },

        url(route, params) {

            const normalizedRoute = this.route.apply(this, arguments);

            const path = app.router.resolve(normalizedRoute).href;

            

            return normalizedRoute.locale.domain + stripLocaleFromPath(path);
        },

        text(identifier, params) {
            
            const template = app.store.getters['nuxt-locale-store/getValue'](identifier);

            if (typeof template == 'string') {
                
                function replacer(value, name) {
                    return params[name];
                }

                // Replace params:
                if (typeof params == 'object') {
                    return template.replace(/{{([a-zA-Z0-9]+)}}/g, replacer).replace(/{([a-zA-Z0-9]+)}/g, replacer);
                }

                return template;
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
                    };
                })
            ;
        }
    }
}