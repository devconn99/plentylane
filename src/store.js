const initialState = () => {
    return {
        userInfo: {
            email: null,
            id: null,
            firstName: null,
            lastName: null,
            fullName: null,
            username: null,
            image: null,
            receiveNotifications: null,
            rating: null,
            credits: null,
            subscription: null
        },
        browserCoordinates: {
            lat: null,
            lng: null
        },
        mealsOptionsDataToCopy: [],
        copiedMealInfo: null,
        basket: [],
        shippingInfo: null,
        myOffersActiveTabIndexOnInit: 0
    }
};
export default {
    state: initialState,
    mutations: {
        reset(state) {
            // acquire initial state
            const s = initialState();
            Object.keys(s).forEach(key => {
                state[key] = s[key]
            })
        },
        userInfo(state, value) {
            state.userInfo = {
                ...state.userInfo,
                ...value
            };
        },
        setUserImage(state, data) {
            if (!state.userInfo.image) {
                state.userInfo.image = {};
            }
            state.userInfo.image = {
                ...data
            };
        },
        updateSubscription(state, data) {
            state.userInfo.subscription = data;
        },
        deleteUserImage(state) {
            if (!state.userInfo) return;
            delete state.userInfo.image;
        },
        browserCoordinates(state, value) {
            state.browserCoordinates = {
                ...value
            };
        },
        mealsOptionsDataToCopy(state, data) {
            if (!data || !data.length) {
                state.mealsOptionsDataToCopy = [];
            } else {
                state.mealsOptionsDataToCopy = data.slice(0);
            }
        },
        copiedMealInfo(state, value) {
            state.copiedMealInfo = {
                ...value
            };
        },
        addToBasket(state, value) {
            if (!state.basket) {
                state.basket = [];
            }
            const _item = state.basket.find(item => Number(item.id) === Number(value.id));
            if (_item && _item.id) {
                // update item count
                _item.count++;
            } else {
                state.basket.push({
                    ...value
                });
            }
        },
        removeFromBasket(state, id) {
            if (!state.basket || !state.basket.length) return;
            state.basket = state.basket.filter(item => Number(item.id) !== Number(id));
        },
        updateItemCountInBasket(state, value) {
            if (!state.basket || !state.basket.length) return;
            const {
                id,
                count
            } = value;
            const _item = state.basket.find(item => Number(item.id) === Number(id));
            if (_item && _item.id) {
                _item.count = count;
            }
        },
        clearBasket(state) {
            state.basket = [];
        },
        shippingInfo(state, value) {
            state.shippingInfo = {
                ...value
            };
        },
        clearShippingInfo(state) {
            state.shippingInfo = null;
        },
        myOffersActiveTabIndexOnInit(state, value) {
            state.myOffersActiveTabIndexOnInit = value;
        }
    },
    getters: {
        userInfo: (state) => (state.userInfo),
        email: (state) => (state.userInfo.email),
        userId: (state) => (state.userInfo.id),
        fullName: (state) => (state.userInfo.fullName),
        firstName: (state) => (state.userInfo.firstName),
        lastName: (state) => (state.userInfo.lastName),
        username: (state) => (state.userInfo.username),
        browserCoordinates: (state) => (state.browserCoordinates),
        mealsOptionsDataToCopy: (state) => (state.mealsOptionsDataToCopy),
        copiedMealInfo: (state) => (state.copiedMealInfo),
        basket: (state) => (state.basket),
        totalPrice: (state) => {
            if (!state.basket || !state.basket.length) return 0;
            let _price = 0;
            state.basket.forEach(item => {
                _price += item.price * item.count;
            });
            return _price;
        },
        shippingInfo: (state) => (state.shippingInfo),
        myOffersActiveTabIndexOnInit: (state) => (state.myOffersActiveTabIndexOnInit)
    }
}
