


export function createRoutes(routes, options) {

    console.log(routes);

    var localizedRoutes = [];

    routes.forEach(route =>  {

        localizedRoutes = localizedRoutes.concat(localizeRoute(route, options));
    })
    
    console.log(localizedRoutes);

    return localizedRoutes;
}

export function localizeRoute(route, options) {

    return options.locales.map(locale => {

        const iso = locale.iso.toLowerCase();

        // Clone route:
        var localizedRoute = {
            ...route
        };

        // Add ISO prefix to route name:
        localizedRoute.name = `${iso}-${localizedRoute.name}`;

        const path = 
            options.pages[route.name] && options.pages[route.name][locale.language]
            ? options.pages[route.name][locale.language] 
            : route.path;

        // Add ISO prefix to path name:
        localizedRoute.path = `/${iso}${path}`;
        
        // Add alias for default locale:
        if (options.defaultLocale == locale.iso) {
            localizedRoute.alias = path;
        }

        return localizedRoute; 
    })
}