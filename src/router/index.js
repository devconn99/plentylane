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
        path: "/privacy",
        name: "Privacy",
        component: () => import("../views/Privacy.vue"),
        meta: { title: `${TITLE} - Privacy`, hideLoaderWithDelay: true }
    },
    {
        path: "/terms",
        name: "Terms",
        component: () => import("../views/Terms.vue"),
        meta: { title: `${TITLE} - Terms`, hideLoaderWithDelay: true }
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
                        path: 'my-answers',
                        name: 'My Answers',
                        component: () => import("../views/profile/MyAnswers.vue"),
                        meta: {
                            title: `${TITLE} - My Answers`,
                            noLoader: true
                        }
                    },
                    {
                        path: 'my-questions',
                        name: 'My Questions',
                        component: () => import("../views/profile/MyQuestions.vue"),
                        meta: {
                            title: `${TITLE} - My Questions`,
                            noLoader: true
                        }
                    },
                    {
                        path: 'tokens',
                        name: 'Tokens',
                        component: () => import("../views/profile/Tokens.vue"),
                        meta: {
                            title: `${TITLE} - Tokens`,
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
                component: () => import("../views/shop/ShopWrapper.vue"),
                children: [
                    {
                        path: '',
                        name: 'Shop',
                        component: () => import("../views/shop/Shop.vue"),
                        meta: {
                            title: `${TITLE} - Shop`,
                            headerTitle: 'Shop',
                            skipHidingLoader: true
                        }
                    },
                    {
                        path: "basket",
                        name: "Basket",
                        component: () => import("../views/shop/Basket.vue"),
                        meta: {
                            title: `${TITLE} - Basket`,
                            headerTitle: 'Basket',
                            noLoader: true
                        }
                    },
                    {
                        path: "checkout",
                        name: "Checkout",
                        component: () => import("../views/shop/Checkout.vue"),
                        meta: {
                            title: `${TITLE} - Checkout`,
                            headerTitle: 'Checkout',
                            noLoader: true
                        }
                    },
                    {
                        path: "success",
                        name: "Success",
                        component: () => import("../views/shop/Success.vue"),
                        meta: {
                            title: `${TITLE} - Success`,
                            headerTitle: 'Success!',
                            noLoader: true
                        }
                    }
                ]
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
                path: 'my-offers/:id',
                name: 'My Offer Info',
                component: () => import("../views/MyOfferPage.vue"),
                meta: {
                    title: `${TITLE} - Offer Info`,
                    skipHidingLoader: true
                }
            },
            {
                path: 'my-meals/:id',
                name: 'My Meal Info',
                component: () => import("../views/MyMealPage.vue"),
                meta: {
                    title: `${TITLE} - Meal Info`,
                    skipHidingLoader: true
                }
            },
            {
                path: 'meals/:id',
                name: 'Meal Info',
                component: () => import("../views/MealPage.vue"),
                meta: {
                    title: `${TITLE} - Meal Info`,
                    skipHidingLoader: true
                }
            },
            {
                path: "contact-us",
                name: "Contact Us",
                component: () => import("../views/ContactUs.vue"),
                meta: {
                    title: `${TITLE} - Contact Us`,
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
                path: 'edit-offer/:id',
                name: 'Edit Offer',
                component: () => import('../views/EditOffer.vue'),
                meta: {
                    title: `${TITLE} - Edit Offer`,
                    skipHidingLoader: true
                }
            },
            {
                path: 'not-found',
                name: "NotFound",
                component: () => import("../views/NotFound.vue"),
                meta: {
                    title: `${TITLE} - Not Found`,
                    noLoader: true
                }
            },
            {
                path: "*",
                redirect: "/dashboard"
            }
        ]
    },
    {
        path: "*",
        redirect: "/dashboard"
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
