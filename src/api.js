import axios from 'axios';
import config from './config';
import router from './router';
const FormData = require('form-data');

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
        iconName: 'notificationType4',
        content: 'Response from Amy G.',
        id: 2,
        shouldReply: true,
        userInfo: {
            firstName: 'Amy',
            lastName: 'GreenField',
            id: 2
        }
    },
    {
        iconName: 'notificationType4',
        content: 'Response from Ben T.',
        shouldReply: true,
        id: 3,
        userInfo: {
            firstName: 'Ben',
            lastName: 'Tattle',
            id: 1
        }
    },
    {
        iconName: 'notificationType3',
        content: 'New meal from Winifred P.',
        id: 4,
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
        profile: {
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
                const _config = { headers: { 'Content-Type': 'multipart/form-data' } };
                let form = new FormData();
                const keys = Object.keys(data);
                for (let key of keys) {
                    if (key in data) {
                        form.append(key, data[key]);
                    }
                }
                return axios.patch(endpoint, form, { ..._config })
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            uploadImage (fileInfo) {
                const endpoint = `${config.API_ORIGIN}/api/me`;
                const _config = { headers: { 'Content-Type': 'multipart/form-data' } };
                let form = new FormData();
                form.append('image', fileInfo);
                return axios.patch(endpoint, form, { ..._config })
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            deleteImage () {
                const endpoint = `${config.API_ORIGIN}/api/me`;
                return axios.patch(endpoint, { deleteImage: true })
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            }
        },
        meals: {
            addMeal (data) {
                const endpoint = `${config.API_ORIGIN}/api/me/meals`;
                let _request;
                if (data['images']) {
                    const _config = { headers: { 'Content-Type': 'multipart/form-data' } };
                    let form = new FormData();
                    const keys = Object.keys(data);
                    for (let key of keys) {
                        if (key in data) {
                            switch (key) {
                                case 'dietaryNotes':
                                    form.append(key, JSON.stringify(data[key]));
                                    break;
                                default:
                                    // no need to make JSON.stringify(data.images) here
                                    form.append(key, data[key]);
                                    break;
                            }
                        }
                    }
                    _request = axios.post(endpoint, form, _config);
                } else {
                    _request = axios.post(endpoint, data);
                }
                return _request
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            updateMeal (mealId, data) {
                // NOTE, this endpoint allows to update any field except "images"
                const endpoint = `${config.API_ORIGIN}/api/me/meals/${mealId}`;
                if (data['images']) {
                    delete data['images'];
                }
                return axios.patch(endpoint, data)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getMyMealById (id, shouldJoinQuestions) {
                let endpoint = `${config.API_ORIGIN}/api/me/meals/${id}?join=images`;
                if (shouldJoinQuestions) {
                    endpoint += '&join=mealQuestions&join=mealQuestions.askedBy&join=mealQuestions.askedBy.image';
                }
                return axios.get(endpoint)
                    .then((res) => {
                        // TODO: sorting mealQuestions?
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getMyMeals (page) {
                let endpoint = `${config.API_ORIGIN}/api/me/meals?join=images`;
                if (page) {
                    endpoint += `&page=${page}`;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            searchMyMeals (name) {
                let endpoint = `${config.API_ORIGIN}/api/me/meals?join=images`;
                if (name && name.length) {
                    endpoint += `&filter=name||$contL||${name}`;
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
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            removeImage (id) {
                const endpoint = `${config.API_ORIGIN}/api/me/mealImages/${id}`;
                return axios.delete(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            addImage (mealId, imageData) {
                const endpoint = `${config.API_ORIGIN}/api/me/mealImages`;
                const _config = { headers: { 'Content-Type': 'multipart/form-data' } };
                let form = new FormData();
                form.append('image', imageData);
                form.append('meal', mealId);

                return axios.post(endpoint, form, _config)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getMealQuestions (mealId, showOnlyAnswered) {
                const endpoint = `${config.API_ORIGIN}/api/meals/${mealId}?join=mealQuestions&join=mealQuestions.askedBy&join=mealQuestions.askedBy.image`;
                return axios.get(endpoint)
                    .then((res) => {
                        const _result = res.data || {};
                        if (showOnlyAnswered && _result.mealQuestions && _result.mealQuestions.length) {
                            _result.mealQuestions = _result.mealQuestions.filter(item => item.answer && item.answer.length > 0);
                        }
                        return Promise.resolve(_result);
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getMyMealQuestions (mealId) {
                const endpoint = `${config.API_ORIGIN}/api/me/meals/${mealId}?join=mealQuestions&join=mealQuestions.askedBy&join=mealQuestions.askedBy.image`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getMealById (id, shouldJoinQuestions) {
                let endpoint = `${config.API_ORIGIN}/api/meals/${id}?join=images`;
                if (shouldJoinQuestions) {
                    endpoint += '&join=mealQuestions&join=mealQuestions.askedBy&join=mealQuestions.askedBy.image';
                }
                return axios.get(endpoint)
                    .then((res) => {
                        const _result = res.data || {};
                        if (shouldJoinQuestions && _result.mealQuestions && _result.mealQuestions.length) {
                            // TODO: sorting mealQuestions?
                            _result.mealQuestions = _result.mealQuestions.filter(item => item.answer && item.answer.length > 0);
                        }
                        return Promise.resolve(_result);
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
                // no need to add join=meal.images
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
                // no need to add join=meal.images
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
                // no need to add join=meal.images
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
                // no need to add join=meal.images
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
                // no need to add join=meal.images
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
                // no need to add join=meal.images
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
                // no need to add join=meal.images
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
                // no need to add join=meal.images
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
                const endpoint = `${config.API_ORIGIN}/api/users/${id}?join=image`;
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
                endpoint += `${endpoint.includes('?') ? '&' : '?'}join=image`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getReviews (userId) {
                // temp
                const _reviews = [
                    {
                        id: 1,
                        rating: 4,
                        title: 'Subject/Question',
                        comment: `
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci architecto commodi 
                            corporis dolorum impedit in ipsum itaque nesciunt non nostrum, officia officiis perferendis 
                            perspiciatis placeat quaerat quasi repellendus saepe voluptatibus?
                        `,
                        from: {
                            fullName: 'Martie G.',
                            date: '2020-11-21'
                        }
                    },
                    {
                        id: 2,
                        rating: 5,
                        title: 'Delicious',
                        comment: `
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci architecto commodi 
                            corporis dolorum impedit in ipsum itaque nesciunt non nostrum, officia officiis perferendis 
                            perspiciatis placeat quaerat quasi repellendus saepe voluptatibus?
                        `,
                        from: {
                            fullName: 'Bobby T.',
                            date: '2020-11-12'
                        }
                    },
                    {
                        id: 3,
                        rating: 2.5,
                        title: 'A little too spicy...',
                        comment: `
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci architecto commodi 
                            corporis dolorum impedit in ipsum itaque nesciunt non nostrum, officia officiis perferendis 
                            perspiciatis placeat quaerat quasi repellendus saepe voluptatibus?
                        `,
                        from: {
                            fullName: 'Joe P.',
                            date: '2020-11-12'
                        }
                    },
                    {
                        id: 4,
                        rating: 1,
                        title: '-',
                        comment: `
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci architecto commodi 
                            corporis dolorum impedit in ipsum itaque nesciunt non nostrum, officia officiis perferendis 
                            perspiciatis placeat quaerat quasi repellendus saepe voluptatibus?
                        `,
                        from: {
                            fullName: 'Ben G.',
                            date: '2020-12-01'
                        }
                    }
                ];
                return Promise.resolve({
                    data: _reviews,
                    total: _reviews.length,
                    page: 1,
                    pageCount: 1,
                    isLastPage: true
                });
            }
        },
        follows: {
            getMyConnections () {
                // TODO: how to get following users images?
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
        },
        mealQuestions: {
            postQuestion (data) {
                const endpoint = `${config.API_ORIGIN}/api/me/mealQuestions/ask`;
                return axios.post(endpoint, data)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getMyAnsweredQuestions (page) {
                let endpoint = `${config.API_ORIGIN}/api/me/mealQuestions/ask?filter=answer||$notnull&sort=mealId,ASC&sort=createdAt,DESC`;
                if (page) {
                    endpoint += `&page=${page}`;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getMyUnAnsweredQuestions (page) {
                let endpoint = `${config.API_ORIGIN}/api/me/mealQuestions/ask?filter=answer||$isnull&sort=mealId,ASC&sort=createdAt,DESC`;
                if (page) {
                    endpoint += `&page=${page}`;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getMyQuestionById (id) {
                const endpoint = `${config.API_ORIGIN}/api/me/mealQuestions/ask/${id}`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getUnAnsweredQuestionsForCook (page) {
                let endpoint = `${config.API_ORIGIN}/api/me/mealQuestions/answer?filter=answer||$isnull&sort=mealId,ASC&sort=createdAt,DESC`;
                if (page) {
                    endpoint += `&page=${page}`;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getAnsweredQuestionsForCook (page) {
                let endpoint = `${config.API_ORIGIN}/api/me/mealQuestions/answer?filter=answer||$notnull&sort=mealId,ASC&sort=createdAt,DESC`;
                if (page) {
                    endpoint += `&page=${page}`;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            deleteMyAnswer (id) {
                const endpoint = `${config.API_ORIGIN}/api/me/mealQuestions/answer/${id}`;
                return axios.delete(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            updateMyAnswer (id, data) {
                const endpoint = `${config.API_ORIGIN}/api/me/mealQuestions/answer/${id}`;
                return axios.patch(endpoint, data)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            },
            getMyAnswerById (id) {
                const endpoint = `${config.API_ORIGIN}/api/me/mealQuestions/answer/${id}`;
                return axios.delete(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    });
            }
        }
    }
}
