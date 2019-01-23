import path from 'path';
import { readdirSync } from 'fs';

import { defaultOptions } from './helpers/constants';

import { createMiddleware } from './helpers/middleware';

import { completeLocale, completeLocaleISO } from './helpers/locale';
import { completeGlobalScope, completeDynamicScope } from './helpers/scope';
import { getAllLanguages } from './helpers/language';
import { createRoutes } from './helpers/route';
import { completePages } from './helpers/pages';


export default function nuxtLocale (moduleOptions) {

    const options = {
        ...defaultOptions,
        ...moduleOptions
    };

    // Validate and complete:
    options.defaultLocale = completeLocaleISO(options.defaultLocale);

    options.locales = options.locales.map(completeLocale);
    options.globalScopes = options.globalScopes.map(completeGlobalScope);
    options.dynamicScopes = options.dynamicScopes.map(completeDynamicScope);

    options.pages = completePages(options.pages);
    
    // Make list of languages:
    options.languages = getAllLanguages(options.locales);


    // Make routes:
    this.extendRoutes((routes) => {
        
        const localizedRoutes = createRoutes(routes, options);

        routes.splice(0, routes.length)
        routes.unshift(...localizedRoutes)
    })


    // Default locale:
    const templatesPath = path.resolve(__dirname, 'templates');

    // Add all templates:
    const templates = {};
    
    for (const file of readdirSync(templatesPath)) {
        
        templates[file] = this.addTemplate({
            src: path.resolve(templatesPath, file),
            fileName: path.join('nuxt-locale', file),
            options
        });
    }

    // Add plugin:
    this.options.plugins.push({
        src: path.join(this.options.buildDir, 'nuxt-locale/plugin.js'),
        ssr: true
    });

    // Add router middleware:
    this.options.router.middleware.push('nuxt-locale-middleware');

    // Add server middleware:
    this.addServerMiddleware(createMiddleware(
        path.join(this.options.srcDir, options.localeDir)
    ));
}

export const meta = require('./../package.json')