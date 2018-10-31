// Router middleware

import middleware from '../middleware';

middleware['nuxt-locale-middleware'] = async ({ app, req, res, route, store, redirect, isHMR }) => {
    

    if (isHMR) {
        return;
    }

    console.log('middleware');

    const scopes = [
        'index'
    ];

    return store.dispatch('nuxt-locale-store/requireScopes', scopes);
}