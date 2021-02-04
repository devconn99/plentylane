const initialState = () => {
    return {
        userInfo: {
            email: null,
            id: null,
            uuid: null,
            firstName: null,
            lastName: null,
            fullName: null
        },
        browserCoordinates: {
            lat: null,
            lng: null
        },
        mealsOptionsDataToCopy: [],
        copiedMealInfo: {
            name: '',
            description: '',
            dietaryNotes: []
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
          state.userInfo = { ...state.userInfo, ...value };
        },
        browserCoordinates (state, value) {
            state.browserCoordinates = { ...value };
        },
        mealsOptionsDataToCopy (state, data) {
            if (!data || !data.length) {
                state.mealsOptionsDataToCopy = [];
            } else {
                state.mealsOptionsDataToCopy = data.slice(0);
            }
        },
        copiedMealInfo (state, value) {
            state.copiedMealInfo = { ...value };
        }
    },
    getters: {
        userInfo: (state) => (state.userInfo),
        email: (state) => (state.userInfo.email),
        uuid: (state) => (state.userInfo.uuid),
        userId: (state) => (state.userInfo.id),
        fullName: (state) => (state.userInfo.fullName),
        firstName: (state) => (state.userInfo.firstName),
        lastName: (state) => (state.userInfo.lastName),
        browserCoordinates: (state) => (state.browserCoordinates),
        mealsOptionsDataToCopy: (state) => (state.mealsOptionsDataToCopy),
        copiedMealInfo: (state) => (state.copiedMealInfo)
    }
}
