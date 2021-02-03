import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const TITLE = "Plenty Lane";

/*
    available meta properties:

    title - to set page title
    hideLoaderWithDelay - it will allow to hide global loading overlay with 1-2 seconds delay
        (now it's added for home pages for non-logged in user)
    authHelper - to redirect logged user from home pages (e.g. /faqs, /pricing, /login, etc.) to dashboard page
    skipHidingLoader - requires to manually hide global loader from the component if true
        (e.g. hide loader when page's data already loaded)
    noLoader - global loader won't be shown if true
 */

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: { title: TITLE, hideLoaderWithDelay: true }
    },
    {
        path: "/how-it-works",
        name: "HowItWorks",
        component: () => import("../views/HowItWorks.vue"),
        meta: { title: `${TITLE} - How it works`, hideLoaderWithDelay: true }
    },
    {
        path: "/pricing",
        name: "Pricing",
        component: () => import("../views/Pricing.vue"),
        meta: { title: `${TITLE} - Pricing`, hideLoaderWithDelay: true }
    },
    {
        path: "/faqs",
        name: "FAQs",
        component: () => import("../views/FAQs.vue"),
        meta: { title: `${TITLE} - FAQs`, hideLoaderWithDelay: true }
    },
    {
        path: "/food-safety",
        name: "FoodSafety",
        component: () => import("../views/FoodSafety.vue"),
        meta: { title: `${TITLE} - Food safety`, hideLoaderWithDelay: true }
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/Login.vue"),
        meta: {
            title: `${TITLE} - Login`,
            authHelper: true,
            hideLoaderWithDelay: true
        }
    },
    {
        path: "/sign-up",
        name: "SignUp",
        component: () => import("../views/SignUp.vue"),
        meta: {
            title: `${TITLE} - Sign Up`,
            authHelper: true,
            hideLoaderWithDelay: true
        }
    },
    {
        path: "/dashboard",
        component: () => import("../views/Dashboard.vue"),
        meta: {
            title: `${TITLE} - Dashboard`
        },
        children: [
            {
                path: "",
                name: "Dashboard",
                component: () => import("../components/DashboardContent.vue"),
                meta: { skipHidingLoader: true }
            },
            {
                path: "profile",
                component: () => import("../views/profile/ProfileWrapper.vue"),
                meta: {
                    title: `${TITLE} - Profile`,
                    noLoader: true
                },
                children: [
                    {
                        path: '',
                        name: 'Edit Profile',
                        component: () => import("../views/profile/EditProfile.vue"),
                        meta: {
                            title: `${TITLE} - Edit Profile`,
                            noLoader: true
                        }
                    },
                    {
                        path: 'my-meals',
                        name: 'My Meals',
                        component: () => import("../views/profile/MyMeals.vue"),
                        meta: {
                            title: `${TITLE} - My Meals`,
                            noLoader: true
                        }
                    },
                    {
                        path: 'my-network',
                        name: 'My Network',
                        component: () => import("../views/profile/MyNetwork.vue"),
                        meta: {
                            title: `${TITLE} - My Network`,
                            noLoader: true
                        }
                    },
                    {
                        path: 'certifications',
                        name: 'Certifications',
                        component: () => import("../views/profile/Certifications.vue"),
                        meta: {
                            title: `${TITLE} - Certifications`,
                            noLoader: true
                        }
                    },
                    {
                        path: 'credits',
                        name: 'Credits',
                        component: () => import("../views/profile/Credits.vue"),
                        meta: {
                            title: `${TITLE} - Credits`,
                            noLoader: true
                        }
                    },
                    {
                        path: 'orders',
                        name: 'Orders',
                        component: () => import("../views/profile/Orders.vue"),
                        meta: {
                            title: `${TITLE} - Orders`,
                            noLoader: true
                        }
                    },
                    {
                        path: 'account',
                        name: 'Account',
                        component: () => import("../views/profile/Account.vue"),
                        meta: {
                            title: `${TITLE} - Account`,
                            noLoader: true
                        }
                    }
                ]
            },
            {
                path: "eat",
                name: "Eat",
                component: () => import("../views/Eat.vue"),
                meta: {
                    title: `${TITLE} - Eat`,
                    noLoader: true // possibly temp
                }
            },
            {
                path: "shop",
                name: "Shop",
                component: () => import("../views/Shop.vue"),
                meta: {
                    title: `${TITLE} - Shop`,
                    noLoader: true // possibly temp
                }
            },
            {
                path: "cook",
                name: "Cook",
                component: () => import("../views/Cook.vue"),
                meta: {
                    title: `${TITLE} - Cook`,
                    noLoader: true // possibly temp
                }
            },
            {
                path: "cook/new-meal",
                name: "New Meal",
                component: () => import("../views/CreateNewMeal.vue"),
                meta: {
                    title: `${TITLE} - Create new meal`,
                    noLoader: true // possibly temp
                }
            },
            {
                path: "offers/:id",
                name: "Offer Info",
                component: () => import("../views/OfferPage.vue"),
                meta: {
                    title: `${TITLE} - Offer info`,
                    skipHidingLoader: true
                }
            },
            {
                path: "help",
                name: "Help",
                component: () => import("../views/Help.vue"),
                meta: {
                    title: `${TITLE} - Help`,
                    noLoader: true // possibly temp
                }
            },
            {
                path: 'search',
                name: 'Search',
                props: true,
                component: () => import('../views/SearchPage.vue'),
                meta: {
                    title: `${TITLE} - Search Results`
                }
            },
            {
                path: 'cook-profile/:id',
                name: 'Cook Profile',
                component: () => import("../views/CookProfile.vue"),
                meta: {
                    title: `${TITLE} - Cook profile`,
                    skipHidingLoader: true
                }
            },
            {
                path: 'booking/:id',
                name: 'Booking',
                component: () => import("../views/BookingPage.vue"),
                meta: {
                    title: `${TITLE} - Booking`,
                    skipHidingLoader: true
                }
            },
            {
                path: 'edit-meal/:id',
                name: 'Edit Meal',
                component: () => import("../views/EditMeal.vue"),
                meta: {
                    title: `${TITLE} - Edit Meal`,
                    skipHidingLoader: true
                }
            },
            {
                path: "*",
                redirect: "/dashboard"
            }
        ]
    }
];

const router = new VueRouter({
    routes
});

function hideLoader () {
    if (Vue.prototype.$loader && Vue.prototype.$loader.hide) {
        Vue.prototype.$loader.hide();
        Vue.prototype.$loader = null;
    }
}

function showLoader() {
    hideLoader();
    Vue.prototype.$loader = Vue.$loading.show()
}
router.beforeResolve((to, from, next) => {
    if (to.name && (!to.meta || !to.meta.noLoader)) {
        showLoader();
    }
    next()
});

router.afterEach((to, from) => {
    let _timeout = 0;
    if (to.meta && !!to.meta.hideLoaderWithDelay) {
        _timeout = 500;
    }
    if (!to.meta.skipHidingLoader) {
        setTimeout(() => {
            hideLoader();
        }, _timeout);
    }
    window.scrollTo(0, 0);
});

router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title;
    }
    const _token = localStorage.getItem("plAccessToken");
    if (to.path === "/" && _token) {
        next("/dashboard");
    }
    if (to.meta.authHelper) {
        // check if token exists
        if (_token) {
        // than redirect to home page
        next("/dashboard");
        }
    } else if (!_token) {
        if (to.path.includes("dashboard")) {
            next("/login");
        }
    }

    // Add tiny timeout to finish page transition
    setTimeout(() => next(), 10);
});

export default router;
