function stripLocaleFromPath(path) {
    
    const result = path.match(/^\/([a-z]{2}-[a-z]{2})/);
                
    if (result.length) {
        return path.substring(result[0].length);
    }

    return path;
}

const cache = {};

function memoize(func, name, duration) {

    return function(...args) {
        
        // Get space:
        const space = cache[name] || (cache[name] = {});

        // Generate key:
        const key = JSON.stringify(args);

        if (key in space && (duration === -1 || (+new Date()) - space[key].time < duration)) {
            return space[key].value;
        }

        space[key] = {
            value: func.apply(this, args).then((res) => {
                return res;
            }),
            time: +new Date()
        };

        return space[key].value;
    }
}

export function createCore(app, defaultLocale, locales) {


    const memoizedFetch = memoize((path) => {
        
        return app.$axios.$get(path);

    }, 'x', -1);
    

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

        get currentRoute() {
            return this.reverseRoute(app.route);
        },

        //defaultLocale: defaultLocale,
        currentLocale: locales.find(locale => locale.iso === defaultLocale),
        locales: locales,

        reverseRoute(localizedRoute) {

            try {
                
                const [fullMatch, language, regio, name] = localizedRoute.name.match(/^([a-z]{2})-([a-z]{2})-(.*)$/);
            
                return {
                    name,
                    language,
                    regio,
                    iso: language + '-' + regio.toUpperCase() 
                }

            } catch (e) {
                return;
            }
        },

        route(route, params, iso) {

            if (typeof params == 'string') {
                iso = params;
                params = undefined;
            }

            iso = (typeof route.iso == 'string' ? route.iso : (iso || this.iso)).toLowerCase();

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

                // Resolve if neccesary:
                if (template.indexOf('@:') == 0) {
                    return this.text(template.substring(2), params);
                }
                
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

            return memoizedFetch(path)
                
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