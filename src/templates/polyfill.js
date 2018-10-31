

/**
 * Creates a polyfill for Intl if neccesary
 * 
 * @returns Promise when loaded
 */
export function createPolyfill() {
    
    if (process.server) {
        
        Intl = require('intl');

        return Promise.resolve();

    } else {
        
        if (!(global || window).Intl) {

            return new Promise((resolve, reject) => {

                require.ensure([
                    'intl',
                    'intl/locale-data/jsonp/en.js',
                    'intl/locale-data/jsonp/fr.js',
                    'intl/locale-data/jsonp/nl.js'
                ], function (require) {
                    console.log('require intl')
                    require('intl');
                    require('intl/locale-data/jsonp/en.js');
                    require('intl/locale-data/jsonp/fr.js');
                    require('intl/locale-data/jsonp/nl.js');
                    resolve();
                });
        
            });
        }
    }
}