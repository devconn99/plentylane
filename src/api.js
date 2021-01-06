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
    if (errResponse.data && errResponse.data.hasOwnProperty('unauthorized') && errResponse.data.unauthorized === true) {
        // clear localStorage
        localStorage.removeItem('plAccessToken');
        localStorage.removeItem('plUserId');
        // than redirect to /login
        router.push({ name: 'Login', query: {expired: true} });
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
                    return Promise.reject(err.response);
                })
        }
    }
}
