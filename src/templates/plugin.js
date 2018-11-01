import middleware from '../middleware';

import { createMiddleware } from './middleware';

import { createStore } from './store';
import { createPolyfill } from './polyfill';
import { createCore } from './core';

export default ({app, route, store}, inject) => {

    // Setup router middleware:
    middleware['nuxt-locale-middleware'] = createMiddleware(
        <%= JSON.stringify(options.globalScopes) %>,
        <%= JSON.stringify(options.dynamicScopes) %>
    );

    // Setup vuex store:
    createStore(store, 'nuxt-locale-store');
    
    // Inject core in app and Vue:
    inject('locale', createCore(
        app,
        <%= JSON.stringify(options.defaultLocale) %>,
        <%= JSON.stringify(options.locales) %>
    ));
    
    // Polyfill required JS deps:
    return createPolyfill();
}
