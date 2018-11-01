import path from 'path';
import { readdirSync } from 'fs';

import { validateLocale, completeLocale } from './helpers/locale';
import { createMiddleware } from './helpers/middleware';
import { defaultOptions } from './helpers/constants';
import { completeGlobalScope, compelteDynamicScope } from './helpers/scope';
import { getAllLanguages } from './helpers/language';

export default function nuxtLocale (moduleOptions) {

    const options = {
        ...defaultOptions,
        ...moduleOptions
    };

    // Validate and complete:
    options.locales = options.locales.map(completeLocale);
    options.globalScopes = options.globalScopes.map(completeGlobalScope);
    options.dynamicScopes = options.dynamicScopes.map(compelteDynamicScope);

    // Make list of languages:
    options.languages = getAllLanguages(options.locales);

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
