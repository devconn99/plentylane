const initialState = () => {
    return {
        userInfo: {
            email: null,
            id: null,
            uuid: null,
            firstName: null,
            lastName: null,
            fullName: null
        }
    }
};
export default {
    state: initialState,
    mutations: {
        reset (state) {
            // acquire initial state
            const s = initialState();
            Object.keys(s).forEach(key => {
                state[key] = s[key]
            })
        },
        userInfo (state, value) {
          state.userInfo = { ...value };
        }
    },
    getters: {
        email: (state) => (state.userInfo.email),
        uuid: (state) => (state.userInfo.uuid),
        userId: (state) => (state.userInfo.id),
        fullName: (state) => (state.userInfo.fullName),
        firstName: (state) => (state.userInfo.firstName),
        lastName: (state) => (state.userInfo.lastName)
    }
}
