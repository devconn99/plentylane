import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const TITLE = "Plenty Lane";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: { title: TITLE }
    },
    {
        path: "/how-it-works",
        name: "HowItWorks",
        component: () => import("../views/HowItWorks.vue"),
        meta: { title: `${TITLE} - How it works` }
    },
    {
        path: "/pricing",
        name: "Pricing",
        component: () => import("../views/Pricing.vue"),
        meta: { title: `${TITLE} - Pricing` }
    },
    {
        path: "/faqs",
        name: "FAQs",
        component: () => import("../views/FAQs.vue"),
        meta: { title: `${TITLE} - FAQs` }
    },
    {
        path: "/food-safety",
        name: "FoodSafety",
        component: () => import("../views/FoodSafety.vue"),
        meta: { title: `${TITLE} - Food safety` }
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/Login.vue"),
        meta: {
            title: `${TITLE} - Login`,
            authHelper: true
        }
    },
    {
        path: "/sign-up",
        name: "SignUp",
        component: () => import("../views/SignUp.vue"),
        meta: {
            title: `${TITLE} - Sign Up`,
            authHelper: true
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
                component: () => import("../components/DashboardContent.vue")
            },
            {
                path: "profile",
                name: "Profile",
                component: () => import("../views/Profile.vue"),
                meta: {
                    title: `${TITLE} - Profile`
                }
            },
            {
                path: "eat",
                name: "Eat",
                component: () => import("../views/Eat.vue"),
                meta: {
                    title: `${TITLE} - Eat`
                }
            },
            {
                path: "shop",
                name: "Shop",
                component: () => import("../views/Shop.vue"),
                meta: {
                      title: `${TITLE} - Shop`
                }
            },
            {
                path: "cook",
                name: "Cook",
                component: () => import("../views/Cook.vue"),
                meta: {
                    title: `${TITLE} - Cook`
                }
            },
            {
                path: "cook/new-meal",
                name: "New Meal",
                component: () => import("../views/CreateNewMeal.vue"),
                meta: { title: `${TITLE} - Create new meal` }
            },
            {
                path: "offers/:uuid",
                name: "Offer Info",
                component: () => import("../views/MealInfo.vue"),
                meta: { title: `${TITLE} - Offer info` }
            },
            {
                path: "notifications",
                name: "Notifications",
                component: () => import("../views/Notifications.vue"),
                meta: { title: `${TITLE} - Notifications` }
            },
            {
                path: "help",
                name: "Help",
                component: () => import("../views/Help.vue"),
                meta: {
                    title: `${TITLE} - Help`
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
