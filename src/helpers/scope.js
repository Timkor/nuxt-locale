
export function validateGlobalScope(scope) {

    if (typeof scope == 'object') {
        if (typeof scope.scopeId == 'undefined') {
            throw Error('Global scope obect should have a property named scopeId');
        }
    } else if (typeof scope != 'string') {
        throw new Error('Global scope should be specified as string (scopeId) or scope object');
    }
}

export function completeGlobalScope(scope) {

    validateGlobalScope(scope);
    
    if (typeof scope == 'string') {

        return {
            scopeId: scope
        };
    }

    return scope;
}

export function validateDynamicScope(scope) {

    if (typeof scope != 'object') {
        throw Error('Dynamic scope should be specified as object');
    }

    if (typeof scope.scopeId == 'undefined') {
        throw Error('Dynamic scope obect should have a property named scopeId');
    }

    if (typeof scope.routeName == 'undefined') {
        throw Error('Dynamic scope obect should have a property named routeName');
    }
}

export function completeDynamicScope(scope) {

    validateDynamicScope(scope);

    return scope;
}