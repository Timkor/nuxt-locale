
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

                        console.warn("Could not fetch locale: " + path)

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

                return (identifier) => {

                    console.log('getValue(\'' + identifier + '\')')

                    for (var i = state.currentScopeList.length -1; i >= 0; i--) {
                        
                        const messages = state.scopes[state.currentScopeList[i]].messages;

                        if (identifier in messages) {
                            return messages[identifier];
                        }
                    }

                    return '...';
                }
            }
        }
    })
}