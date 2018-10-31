import path from 'path';
import {readdirSync} from 'fs';

import { validateLocale, completeLocale } from './helpers/locale';

export default function nuxtLocale (moduleOptions) {

    const options = {
        ...moduleOptions
    };

    // Validate and complete locales:
    options.locales = options.locales.map(locale => {
        
        validateLocale(locale);

        return completeLocale(locale);
    });

    // Make list of languages:
    options.languages = options.languages || [];

    options.locales.map(locale => locale.language).forEach(language => {
        if (!(language in options.languages)) {
            options.languages.push(language);
        }
    });

    // Default locale:
    console.log('a');
    
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
}
