
export function createStore(store, moduleName) {

    store.registerModule(moduleName, {
        
        namespaced: true,

        state: () => ({
            locale: '',
            messages: {}
        }),

        actions: {
            setLocale ({ commit }, locale) {
                commit('setLocale', locale);
            },
            setMessages ({ commit }, messages) {
                commit('setMessages', messages);
          }
        },

        mutations: {
          setLocale(state, locale) {
            state.locale = locale
          },

          setMessages(state, messages) {
            state.messages = messages
          }
        }
    })
}