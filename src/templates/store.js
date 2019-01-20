console.log('aaa')

export function createStore(store, moduleName) {

    store.registerModule(moduleName, {
        
        namespaced: true,

        state: () => ({
            scopes: {},
            scopeList: [],
            nextScopeList: [],
            currentScopeList: [],
        }),

        mutations: {

            addScope(state, scope) {
                state.scopes[scope.id] = scope;
                state.scopeList.push(scope.id);
            },

            setNextScopes(state, scopeIds) {
                
                state.nextScopeList.splice(0, state.nextScopeList.length);

                scopeIds.forEach(scopeId => state.nextScopeList.push(scopeId));
            },

            setCurrentScopes(state, scopeIds) {
                
                state.currentScopeList.splice(0, state.currentScopeList.length);

                scopeIds.forEach(scopeId => state.currentScopeList.push(scopeId));
            }
        },

        actions: {

            requireScopes({ commit, dispatch }, scopeIds) {
                console.time('nuxt-locale:requireScopes');
                return Promise.all(scopeIds.map(scopeId => dispatch('getScope', scopeId)))
                    .then(() => {
                        console.timeEnd('nuxt-locale:requireScopes');
                        commit('setNextScopes', scopeIds);
                    });
            },

            applyScopes({commit, state}) {
                commit('setCurrentScopes', state.nextScopeList);
            },

            getScope({ commit, state, dispatch }, scopeId) {

                if (scopeId in state.scopes) {
                    return Promise.resolve(state.scopes[scopeId]);
                }
                
                return dispatch('fetchScope', scopeId);
            },

            fetchScope({commit}, scopeId) {
                
                return this.$locale.fetchScope(scopeId).then(scope => {

                    commit('addScope', scope);
                    
                    return scope;
                });
            },

            addScope({ commit }, scope) {
                
                commit('addScope', scope);
            },
        },

        getters: {

            getValue(state) {


                function resolveIdentifier(scope, identifier) {

                    const names = identifier.split('.');
                    
                    var currentObject = scope.messages;

                    // Loop through names in identifier:
                    for (var nameIndex = 0; nameIndex < names.length; nameIndex++) {

                        const name = names[nameIndex];

                        currentObject = currentObject[name];

                        if (typeof currentObject == 'undefined') {
                            return;
                        }
                    }

                    return currentObject;
                }

                return (identifier) => {

                    console.time('nuxt-locale:getValue()');
                   

                    var index = state.currentScopeList.length;

                    // Loop through required scopes in reversed order:
                    while (index--) {
                        
                        // Resolve scope id:
                        const scopeId = state.currentScopeList[index];
                        
                        // Resolve scope:
                        const scope = state.scopes[scopeId];

                        // Check if scope is loaded:
                        if (typeof scope != 'undefined') {

                            var result = resolveIdentifier(scope, identifier);

                            console.timeEnd('nuxt-locale:getValue()')

                            if (result) {
                                return result;
                            }
                        }
                    }
                    
                    console.timeEnd('nuxt-locale:getValue()')
                    console.warn(`Could not resolve '${identifier}'`);
                    return;
                }
            }
        }
    })
}