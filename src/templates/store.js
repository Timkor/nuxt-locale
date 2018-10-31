
export function createStore(store, moduleName) {

    store.registerModule(moduleName, {
        
        namespaced: true,

        state: () => ({
            scopes: {},
            scopeList: [],
        }),

        mutations: {

            addScope(state, scope) {
                state.scopes[scope.id] = scope;
                state.scopeList.push(scope.id);
            }
        },

        actions: {
            addScope({ commit }, scope) {
                commit('addScope', scope);
            },
        },
    })
}