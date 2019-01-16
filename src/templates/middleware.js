
export function createMiddleware(globalScopes, dynamicScopes) {
    
    const globalScopeList = globalScopes.map(scope => scope.scopeId);
    
    const dynamicScopesMap = {};

    // Faster lookup for route:
    dynamicScopes.forEach(scope => {

        if (typeof dynamicScopesMap[scope.routeName] == 'undefined') {
            dynamicScopesMap[scope.routeName] = [];
        }

        dynamicScopesMap[scope.routeName].push(scope.scopeId);
    });

    function getGlobalScopes() {
        return globalScopeList;
    }

    function getStaticScopes(routeName) {

        if (routeName) {
            return [routeName];
        }

        return [];
    }

    function getDynamicScopes(routeName, routeParams) {

        if (routeName && routeName in dynamicScopesMap) {

            return dynamicScopesMap[routeName].map(scopeIdTemplate => {

                // Evaluatue template:
                return scopeIdTemplate.replace(/\:([a-zA-Z0-9]+)/g, (value, name) => {
                    
                    // Lookup route param:
                    return (''+routeParams[name]).toLowerCase();
                });
            })
        }

        return [];
    }

    return async ({ app, req, res, route, store, redirect, isHMR }) => {
        

        if (isHMR) {
            return;
        }

        if (typeof route.name != 'string') {
            return;
        }

        if (!/^[a-z]{2}-[a-z]{2}-.+/.test(route.name)) {
            return;
        }

        const [language, regio, ...routeNameParts] = route.name.split('-');

        const routeName = routeNameParts.join('-');

        const scopes = [

            ...getGlobalScopes(),

            ...getStaticScopes(routeName),

            ...getDynamicScopes(routeName, route.params)
        ];

        const promise = store.dispatch('nuxt-locale-store/requireScopes', scopes)
        
        // router.afterEach is not supported on SSR
        // So apply the scopes manually server side:
        if (process.server) {
            promise.then((result) => {
                return store.dispatch('nuxt-locale-store/applyScopes');
            });
        }

        return promise;
    }
}