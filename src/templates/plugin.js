import middleware from '../middleware';

import { createMiddleware } from './middleware';

import { createStore } from './store';
import { createPolyfill } from './polyfill';
import { createCore } from './core';

export default (context, inject) => {

    // Setup router middleware:
    middleware['nuxt-locale-middleware'] = createMiddleware(
        <%= JSON.stringify(options.globalScopes) %>,
        <%= JSON.stringify(options.dynamicScopes) %>
    );

    context.app.router.afterEach(() => {
        context.store.dispatch('nuxt-locale-store/applyScopes');
    })

    // Setup vuex store:
    createStore(context, 'nuxt-locale-store');
    
    // Inject core in app and Vue:
    inject('locale', createCore(
        context,
        <%= JSON.stringify(options.defaultLocale) %>,
        <%= JSON.stringify(options.locales) %>
    ));
    
    // Polyfill required JS deps:
    return createPolyfill();
}
