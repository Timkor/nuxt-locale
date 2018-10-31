// Router middleware

import middleware from '../middleware';

middleware['nuxt-locale-middleware'] = async ({ app, req, res, route, store, redirect, isHMR }) => {
    

    if (isHMR) {
        return;
    }

    console.log('middleware');

    const scopes = [

        // Global scopes:

        // Static route scope:
        route.name

        // Dynamic route scopes:
        
    ];

    return store.dispatch('nuxt-locale-store/requireScopes', scopes);
}