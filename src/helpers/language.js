



export function getAllLanguages(locales) {

    const languages = [];

    locales
        .map(locale => locale.language)
        .forEach(language => {
            if (!(language in languages)) {
                languages.push(language);
            }
        })
    ;

    return languages;
}