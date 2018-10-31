import './middleware';

import { createStore } from './store';
import { createPolyfill } from './polyfill';
import { createCore } from './core';

export default ({app, route, store}, inject) => {
    
    createStore(store, 'nuxt-locale-store');
    
    inject('locale', createCore(
        'nl-NL',
        <%= JSON.stringify(options.locales) %>
    ));

    return createPolyfill();
}
