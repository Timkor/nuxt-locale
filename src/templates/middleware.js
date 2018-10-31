// Router middleware

import middleware from '../middleware';

middleware['nuxt-locale-middleware'] = async ({ app, req, res, route, store, redirect, isHMR }) => {
    console.log('middleware');

    if (isHMR) {
        return;
    }

    store.dispatch('nuxt-locale-store/addScope', {
        id: 'qwe',
        messages: {
            a: 'a'
        }
    })
}