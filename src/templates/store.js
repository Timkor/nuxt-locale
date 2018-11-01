
export function createStore(store, moduleName) {

    store.registerModule(moduleName, {
        
        namespaced: true,

        state: () => ({
            scopes: {},
            scopeList: [],
            currentScopeList: [],
        }),

        mutations: {

            addScope(state, scope) {
                state.scopes[scope.id] = scope;
                state.scopeList.push(scope.id);
            },

            setCurrentScopes(state, scopeIds) {
                
                state.currentScopeList.splice(0, state.currentScopeList.length);

                scopeIds.forEach(scopeId => state.currentScopeList.push(scopeId));
            }
        },

        actions: {

            requireScopes({ commit, dispatch }, scopeIds) {

                return Promise.all(scopeIds.map(scopeId => dispatch('getScope', scopeId)))
                    .then(() => {

                        commit('setCurrentScopes', scopeIds);
                    });
            },

            getScope({ commit, state, dispatch }, scopeId) {

                if (scopeId in state.scopes) {
                    return Promise.resolve(state.scopes[scopeId]);
                }
                
                return dispatch('fetchScope', scopeId);
            },

            fetchScope({commit}, scopeId) {

                //console.log('fetch', scopeId);
                //return {};

                const path = `_locale/${this.$locale.language}/${scopeId}.json`;
                
                return this.$axios.$get(path)
                    .then(messages => {

                        return {
                            id: scopeId,
                            messages: messages
                        }
                    })
                    .then(scope => {

                        commit('addScope', scope);
                        
                        return scope;
                    })
                    .catch(error => {
                        
                        console.warn(`Could not fetch locale '${scopeId}' at ` + path)

                        return {
                            id: scopeId,
                            messages: {},
                            error: error
                        };
                    })
                ;
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

                    console.log('getValue(\'' + identifier + '\')')

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

                            if (result) {
                                return result;
                            }
                        }
                    }

                    return;
                }
            }
        }
    })
}