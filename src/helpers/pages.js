


export function completePages(pages) {

    const resultPages = {};

    Object.keys(pages).forEach((pagePath) => {

        const key = pagePath.replace(/\//g, '-').replace(/\-\_/g, '-').replace(/-index$/, '');

        resultPages[key] = pages[pagePath];
    });

    return resultPages;
}