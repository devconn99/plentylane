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
            getMealByUuid (uuid) {
                const endpoint = `${config.API_ORIGIN}/api/meals/${uuid}?join=place&join=user`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getMealById (id) {
                const endpoint = `${config.API_ORIGIN}/api/me/meals/${id}?join=place`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getMyMeals () {
                const endpoint = `${config.API_ORIGIN}/api/me/meals`;
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
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
            getMyPlaces () {
                const endpoint = `${config.API_ORIGIN}/api/me/places`;
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
            getOffers (filters) {
                // example filters data:
                filters = [
                    // {
                    //     field: "quantity",
                    //     condition: '$in',
                    //     value: '3,7'
                    // },
                    {
                        field: 'pickupTime',
                        condition: '$between',
                        value: '2021-01-13,2021-01-20'
                    },
                    // {
                    //     field: 'meal.name',
                    //     condition: '$contL',
                    //     value: 'Test'
                    // }
                ];
                let filtersStr = '';
                if (filters && filters.length) {
                    filters.forEach(item => {
                        filtersStr += `&filter=${item.field}||${item.condition}||${item.value}`;
                    });
                }
                let endpoint = `${config.API_ORIGIN}/api/offers?join=place&join=meal&join=user`;
                if (filtersStr && filtersStr.length) {
                    endpoint += filtersStr;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        return Promise.resolve(res.data || {});
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getAvailableOffers () {
                const endpoint = `${config.API_ORIGIN}/api/offers?join=place&join=meal&join=user&filter=quantity||$gt||1`;
                return axios.get(endpoint)
                    .then((res) => {
                        const _data = res.data || {};
                        if (_data && _data.data && _data.data.length) {
                            _data.data = _data.data.filter(item => item.availableQuantity > 1);
                        }
                        return Promise.resolve(_data);
                    })
                    .catch((err) => {
                        return checkErr(err.response);
                    })
            },
            getMyOffers () {
                const endpoint = `${config.API_ORIGIN}/api/me/offers?join=place&join=meal`;
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
            getAvailableOffersFromUser (userId, exceptionId) {
                let endpoint = `${config.API_ORIGIN}/api/offers?join=place&join=meal&join=user&filter=user.id||$eq||${userId}&filter=quantity||$gt||1`;
                if (exceptionId) {
                    endpoint += `&filter=id||$ne||${exceptionId}`;
                }
                return axios.get(endpoint)
                    .then((res) => {
                        const _data = res.data || {};
                        if (_data && _data.data && _data.data.length) {
                            _data.data = _data.data.filter(item => item.availableQuantity > 1);
                        }
                        return Promise.resolve(_data);
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
                setTimeout(() => {
                    return Promise.resolve(questionsTemp);
                }, 500);
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
            getMyDines () {
                const endpoint = `${config.API_ORIGIN}/api/me/bookings/dine`;
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
            }
        }
    }
}
