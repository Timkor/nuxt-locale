

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
        
        if (!((global || window).Intl)) {

            return new Promise((resolve, reject) => {

                require.ensure([
                    'intl',
                    <% _.forEach(options.languages, function (language) { %>'intl/locale-data/jsonp/<%=language.toLowerCase()%>.js',
                    <% }) %>
                ], function (require) {

                    require('intl');
                    
                    <% _.forEach(options.languages, function (language) { %>require('intl/locale-data/jsonp/<%=language.toLowerCase()%>.js');
                    <% }) %>
                    resolve();
                });
        
            });
        }
    }
}