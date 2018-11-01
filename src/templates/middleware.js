
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

    function getStaticScopes(route) {

        if (route.name) {
            return [route.name];
        }

        return [];
    }

    function getDynamicScopes(route) {

        if (route.name && route.name in dynamicScopesMap) {

            return dynamicScopesMap[route.name].map(scopeIdTemplate => {

                // Evaluatue template:
                return scopeIdTemplate.replace(/\:([a-zA-Z0-9]+)/g, (value, name) => {
                    
                    // Lookup route param:
                    return route.params[name];
                });
            })
        }

        return [];
    }

    return async ({ app, req, res, route, store, redirect, isHMR }) => {
        

        if (isHMR) {
            return;
        }

        const scopes = [

            ...getGlobalScopes(),

            ...getStaticScopes(route),

            ...getDynamicScopes(route)
        ];
        
        console.log('Route: ', route);
        console.log('Scopes: ', scopes);

        return store.dispatch('nuxt-locale-store/requireScopes', scopes);
    }
}