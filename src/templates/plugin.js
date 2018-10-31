import './middleware';

import { createStore } from './store';
import { createPolyfill } from './polyfill';


export default ({app, route, store}, inject) => {
    
    createStore(store, 'nuxt-locale-store');

    app.router.afterEach((to, from, next) => {
        //return load(to);
        //next();
        console.log(to);
    });

    //console.log(app);
    
    inject('locale', {

        
        locales: [],        

        url(route) {

        },

        text(identifier) {

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
        }
    });


    return createPolyfill();
}
