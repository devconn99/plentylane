import axios from 'axios';
import config from './config';
import router from './router';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

// TODO: set Authorization header if token exists
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('plAccessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log('error', error);
        return Promise.reject(error);
    }
);
const getTodayStartStr = () => {
    const _dateObj = new Date();
    const _month = (`0${_dateObj.getUTCMonth() + 1}`).slice(-2);
    const _day = (`0${_dateObj.getUTCDate()}`).slice(-2);
    return `${_dateObj.getUTCFullYear()}-${_month}-${_day}T00:00:00.000Z`;
};
const getDefaultPickupTimeNotInPastFilter = (prefix) => {
    if (!prefix || !prefix.length) {
        prefix = '';
    } else if (!prefix.endsWith('.')) {
        prefix += '.';
    }
    return `filter=${prefix}pickupTime||$gte||${getTodayStartStr()}`;
};

// TODO: temp notifications
const TEMP_NOTIFICATIONS = [
    {
        iconName: 'notificationType1',
        content: 'Amy G. has reserved your meal: Baby Back Ribs!',
        id: 1
    },
    {
        iconName: 'notificationType2',
        content: 'Get your food handler certification',
        shouldReply: true,
        id: 2
    },
    {
        iconName: 'notificationType4',
        content: 'New order from new customer',
        shouldReply: true,
        id: 3
    },
    {
        iconName: 'notificationType3',
        content: 'New meal from Winifred P.',
        id: 4
    },
    {
        iconName: 'notificationType1',
        content: 'Amy G. has reserved your meal: Baby Back Ribs!',
        id: 5
    },
    {
        iconName: 'notificationType2',
        content: 'Get your food handler certification',
        id: 6
    },
    {
        iconName: 'notificationType3',
        content: 'New meal from Winifred P.',
        id: 7
    },
    {
        iconName: 'notificationType1',
        content: 'Amy G. has reserved your meal: Baby Back Ribs!',
        id: 8
    },
    {
        iconName: 'notificationType2',
        content: 'Get your food handler certification',
        id: 9
    },
    {
        iconName: 'notificationType3',
        content: 'New meal from Winifred P.',
        id: 10
    }
];

// TODO
const checkErr = (errResponse) => {
    if (errResponse.data && (errResponse.data.statusCode === 401 || errResponse.data.unauthorized === true)) {
        // clear localStorage
        localStorage.removeItem('plAccessToken');
        localStorage.removeItem('plUserId');
        // than redirect to /login
        router.push({ path: '/login' });
        return Promise.reject(errResponse);
    } else {
        return Promise.reject(errResponse);
    }
};

// temp data
const TEMP_SHOP_ITEMS = [
    {
        title: 'Medium Container',
        price: 10,
        currency: '$',
        id: 1
    },
    {
        title: 'Assorted pack',
        price: 20,
        currency: '$',
        id: 2
    },
    {
        title: 'Container 5pk with long name inside title',
        price: 35,
        currency: '$',
        id: 3
    },
    {
        title: 'Medium Container 2',
        price: 10,
        currency: '$',
        id: 4
    }
];

export default {
    auth: {
        signUp (data) {
            const endpoint = `${config.API_ORIGIN}/api/auth/signup`;
            return axios.post(endpoint, data)
                .then((res) => {
                    return Promise.resolve(res.data || {});
                })
                .catch((err) => {
                    return Promise.reject(err.response.data || err);
                });
        },
        login (data) {
            const endpoint = `${config.API_ORIGIN}/api/auth/login`;
            return axios.post(endpoint, data)
                .then((res) => {
                    return Promise.resolve(res.data || {});
                })
                .catch((err) => {
                    return Promise.reject(err.response.data || err);
                });
        }
    },
    dashboard: {
        userInfo () {
            const endpoint = `${config.API_ORIGIN}/api/me`;
            return axios.get(endpoint)
                .then((res) => {
                    return Promise.resolve(res.data || {});
                })
                .catch((err) => {
                    return checkErr(err.response);
                })
        },
        updateProfile (data) {
            const endpoint = `${config.API_ORIGIN}/api/me`;
            return axios.patch(endpoint, data)
                .then((res) => {
                    return Promise.resolve(res.data || {});
                })
                .catch((err) => {
                    return checkErr(err.response);
                })
        },
        meals: {
            addMeal (data) {
                const endpoint = `${config.API_ORIGIN}/api/me/meals`;
                return axios.post(endpoint, data)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            updateMeal (mealId, data) {
                const endpoint = `${config.API_ORIGIN}/api/me/meals/${mealId}`;
                return axios.patch(endpoint, data)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getMealById (id) {
                const endpoint = `${config.API_ORIGIN}/api/me/meals/${id}`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getMyMeals (page) {
                let endpoint = `${config.API_ORIGIN}/api/me/meals`;
                if (page) {
                    endpoint += `?page=${page}`;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            searchMyMeals (name) {
                let endpoint = `${config.API_ORIGIN}/api/me/meals`;
                if (name && name.length) {
                    endpoint += `?filter=name||$contL||${name}`;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            removeMyMeal (id) {
                const endpoint = `${config.API_ORIGIN}/api/me/meals/${id}`;
                return axios.delete(endpoint)
                    .then((res) => {
                        console.log('\n >> res > ', res);
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            }
        },
        places: {
            getPlaces () {
                const endpoint = `${config.API_ORIGIN}/api/places`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getPlacesByLocation (query) {
                let endpoint = `${config.API_ORIGIN}/api/places`;
                let _queryStr = '';
                if (query && query.length) {
                    query.forEach((item, index) => {
                        if (item.type && item.type.length) {
                            _queryStr += `${index === 0 ? '?' : '&'}${item.type}=${item.field}||${item.condition}||${item.value}`;
                        }
                    });
                }
                const sortByPickupTime = 'sort=offers.pickupTime,ASC';
                if (_queryStr && _queryStr.length) {
                    endpoint += _queryStr;
                    endpoint += `&${sortByPickupTime}`;
                } else {
                    endpoint += `?${sortByPickupTime}`;
                }
                endpoint += `${_queryStr && _queryStr.length ? '&' : '?'}join=offers&join=offers.meal&join=offers.bookings&join=user`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getMyPlaces (limit) {
                let endpoint = `${config.API_ORIGIN}/api/me/places`;
                if (limit) {
                    endpoint += `?limit=${limit}`;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getPlaceInfo (placeId) {
                const endpoint = `${config.API_ORIGIN}/api/me/places/${placeId}`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            addPlace (data) {
                const endpoint = `${config.API_ORIGIN}/api/me/places`;
                return axios.post(endpoint, data)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            }
        },
        offers: {
            getOffers (query) {
                let endpoint = `${config.API_ORIGIN}/api/offers?join=place&join=meal&join=user`;
                const sortByPickupTime = 'sort=pickupTime,ASC';

                let _queryStr = '';
                if (query && query.length) {
                    query.forEach(item => {
                        if (item.type && item.type.length) {
                            _queryStr += `&${item.type}=${item.field}||${item.condition}||${item.value}`;
                        }
                    });
                }

                if (_queryStr && _queryStr.length) {
                    endpoint += _queryStr;
                }
                endpoint += `&${sortByPickupTime}`;

                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getAvailableOffers (excludeUserId) {
                let endpoint = `${config.API_ORIGIN}/api/offers?join=place&join=meal&join=user`;
                const _filterHideInPast = getDefaultPickupTimeNotInPastFilter();
                const _filterAvailableQuantity = 'filter=availableQuantity||$gte||1';
                const _sortPickupTimeAsc = 'sort=pickupTime,ASC';
                let _filters = `&${_filterAvailableQuantity}&${_filterHideInPast}&${_sortPickupTimeAsc}`;

                if (excludeUserId) {
                    _filters += `&filter=user.id||$ne||${excludeUserId}`;
                }

                endpoint += `&${_filters}&${_sortPickupTimeAsc}`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getMyOffers (shouldHidePastOffers, page) {
                let endpoint = `${config.API_ORIGIN}/api/me/offers?join=place&join=meal`;
                if (shouldHidePastOffers) {
                    endpoint += `&${getDefaultPickupTimeNotInPastFilter()}`;
                }
                endpoint += '&sort=pickupTime,ASC';
                if (page) {
                    endpoint += `&page=${page}`;
                }

                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getOfferById (id) {
                const endpoint = `${config.API_ORIGIN}/api/offers/${id}?join=meal&join=place&join=user`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            addOffer (data) {
                const endpoint = `${config.API_ORIGIN}/api/me/offers`;
                return axios.post(endpoint, data)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getMyOfferById (id) {
                const endpoint = `${config.API_ORIGIN}/api/me/offers/${id}?join=place&join=meal`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getAvailableOffersFromUser (userId, exceptionId, page) {
                let endpoint = `${config.API_ORIGIN}/api/offers?join=place&join=meal&join=user`;
                const _filterByUserId = `filter=user.id||$eq||${userId}`;
                const _filterAvailableServings = 'filter=availableQuantity||$gte||1';
                const _filterHideInPast = getDefaultPickupTimeNotInPastFilter();
                const _sortByPickupTimeAsc = 'sort=pickupTime,ASC';
                endpoint += `&${_filterByUserId}&${_filterAvailableServings}&${_filterHideInPast}&${_sortByPickupTimeAsc}`;

                if (exceptionId) {
                    endpoint += `&filter=id||$ne||${exceptionId}`;
                }
                if (page) {
                    endpoint += `&page=${page}`;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getOfferQuestions (offerId) {
                // TODO: use real endpoint when it's ready
                const questionsTemp = [
                    {
                        questionText: 'How spicy is it?',
                        from: {
                            name: 'Maggie G.',
                            img: 'https://media.istockphoto.com/photos/trendy-girl-singing-favorite-song-out-loud-in-phone-as-mic-wearing-picture-id1256944025',
                        },
                        date: new Date('2021-01-11'),
                        answer: 'It\'s not super spicy, but...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed vehicula massa, vitae semper ante.!'
                    },
                    {
                        questionText: 'What\'s in the sauce?',
                        from: {
                            name: 'Bobby T.',
                            img: 'https://media.istockphoto.com/photos/middle-age-handsome-man-wearing-casual-pink-shirt-standing-over-picture-id1185951696',
                        },
                        date: new Date('2021-01-12'),
                        answer: 'It\'s not super spicy!'
                    }
                ];
                return Promise.resolve(questionsTemp);
            },
            removeOffer (id) {
                const endpoint = `${config.API_ORIGIN}/api/me/offers/${id}`;
                return axios.delete(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {})
                    })
                    .catch((err) => {
                        return checkErr(err.response)
                    })
            },
            updateOffer (id, data) {
                const endpoint = `${config.API_ORIGIN}/api/me/offers/${id}`;
                return axios.patch(endpoint, data)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            }
        },
        bookings: {
            postDine (data) {
                const endpoint = `${config.API_ORIGIN}/api/me/bookings/dine`;
                return axios.post(endpoint, data)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            deleteDine (id) {
                const endpoint = `${config.API_ORIGIN}/api/me/bookings/dine/${id}`;
                return axios.delete(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {})
                    })
                    .catch((err) => {
                        return checkErr(err.response)
                    })
            },
            getMyDines (shouldHidePastReservations, page) {
                let endpoint = `${config.API_ORIGIN}/api/me/bookings/dine`;
                const _sortPickupTimeAsc = 'sort=offer.pickupTime,ASC';
                let _filterAndSortStr = '';
                if (shouldHidePastReservations) {
                    _filterAndSortStr = `?${getDefaultPickupTimeNotInPastFilter('offer.')}&${_sortPickupTimeAsc}`;
                } else {
                    _filterAndSortStr = `?${_sortPickupTimeAsc}`;
                }
                endpoint += _filterAndSortStr;
                if (page) {
                    endpoint += `&page=${page}`;
                }

                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getMyCooks () {
                const endpoint = `${config.API_ORIGIN}/api/me/bookings/cook`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getBookingInfo (id) {
                // NOTE: offer.availableServings equals to offer.quantity,
                // so if need actual booking.offer info, please use another endpoint
                const endpoint = `${config.API_ORIGIN}/api/me/bookings/dine/${id}`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {})
                    })
                    .catch((err) => {
                        return checkErr(err.response)
                    })
            }
        },
        users: {
            getUserInfo (id) {
                const endpoint = `${config.API_ORIGIN}/api/users/${id}`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getAllUsers (page, search, exceptionId) {
                let endpoint = `${config.API_ORIGIN}/api/users`;
                const filterById = exceptionId ? `filter=id||$ne||${exceptionId}` : '';
                const filterByFullName = search && search.length ? `filter=fullName||$contL||${search}` : '';
                if (page) {
                    endpoint += `?page=${page}`;
                }
                if (filterByFullName.length) {
                    endpoint += `${endpoint.includes('?') ? '&' : '?'}${filterByFullName}`;
                }
                if (filterById.length) {
                    endpoint += `${endpoint.includes('?') ? '&' : '?'}${filterById}`;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            }
        },
        follows: {
            getMyConnections () {
                const endpoint = `${config.API_ORIGIN}/api/me/follows`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getMyInvites () {
                // TODO: use real endpoint when it's ready
                return new Promise(resolve => setTimeout(resolve, 1000));
            },
            followUser (id) {
                if (typeof id !== 'number') {
                    id = Number(id);
                }
                const endpoint = `${config.API_ORIGIN}/api/me/follows`;
                return axios.post(endpoint, { action: 'add', followingId: id })
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            unFollowUser (id) {
                if (typeof id !== 'number') {
                    id = Number(id);
                }
                const endpoint = `${config.API_ORIGIN}/api/me/follows`;
                return axios.post(endpoint, { action: 'remove', followingId: id })
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            }
        },
        network: {
            getMyNetwork () {
                // TODO: remove temp data when endpoint is ready
                const tempData = [
                    {
                        id: 1,
                        name: 'Eric Turner',
                        img: 'https://media.istockphoto.com/photos/middle-age-handsome-man-wearing-casual-pink-shirt-standing-over-picture-id1185951696'
                    },
                    {
                        id: 2,
                        name: 'Luis Blair',
                        img: 'https://media.istockphoto.com/photos/middle-age-handsome-man-wearing-casual-pink-shirt-standing-over-picture-id1185951696'
                    },
                    {
                        id: 3,
                        name: 'Lura Rodriquez',
                        img: 'https://media.istockphoto.com/photos/trendy-girl-singing-favorite-song-out-loud-in-phone-as-mic-wearing-picture-id1256944025'
                    },
                    {
                        id: 4,
                        name: 'Catherine Crawford',
                        img: 'https://media.istockphoto.com/photos/trendy-girl-singing-favorite-song-out-loud-in-phone-as-mic-wearing-picture-id1256944025'
                    },
                    {
                        id: 5,
                        name: 'Evan Carlson',
                        img: 'https://media.istockphoto.com/photos/middle-age-handsome-man-wearing-casual-pink-shirt-standing-over-picture-id1185951696'
                    },
                    {
                        id: 6,
                        name: 'Lucille Reeves',
                        img: 'https://media.istockphoto.com/photos/trendy-girl-singing-favorite-song-out-loud-in-phone-as-mic-wearing-picture-id1256944025'
                    }
                ];
                return Promise.resolve(tempData);
            }
        },
        notifications: {
            getTempNotifications (size) {
                let _notifications = TEMP_NOTIFICATIONS.slice(0);
                if (size) {
                    _notifications = _notifications.slice(0, size);
                }
                return Promise.resolve(_notifications);
            }
        },
        shop: {
            getContainers () {
                // temp
                return Promise.resolve(TEMP_SHOP_ITEMS.slice(0));
            },
            getContainerById (id) {
                // temp
                const _item = TEMP_SHOP_ITEMS.find(item => Number(item.id) === Number(id));
                if (_item && _item.id) {
                    return Promise.resolve(_item);
                }
                return Promise.reject({ data: { statusCode: 404 } });
            }
        }
    }
}
