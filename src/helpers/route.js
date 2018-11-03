


export function createRoutes(routes, options) {

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

        // Add ISO prefix to path name:
        localizedRoute.path = `/${iso}${route.path}`;
        
        // Add alias for default locale:
        if (options.defaultLocale == locale.iso) {
            localizedRoute.alias = route.path;
        }

        return localizedRoute; 
    })
}