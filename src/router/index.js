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
    meta: { title: TITLE, hideLoaderWithDelay: true },
  },
  {
    path: "/feedyourneighbor",
    name: "FeedYourNeighbor",
    component: ()=>import("../views/FeedYourNeihbour.vue"),
    meta: { title: TITLE, hideLoaderWithDelay: true },
  },
  {
    path: "/neighborcookyoudinner",
    name: "NeighborCookYouDinner",
    component: ()=>import("../views/NeighborCookYouDinner.vue"),
    meta: { title: TITLE, hideLoaderWithDelay: true },
  },
  {
    path: "/how-it-works",
    name: "HowItWorks",
    component: () => import("../views/HowItWorks.vue"),
    meta: { title: TITLE, hideLoaderWithDelay: true },
  },
  {
    path: "/pricing",
    name: "Pricing",
    component: () => import("../views/Pricing.vue"),
    meta: { title: `${TITLE} - Pricing`, hideLoaderWithDelay: true },
  },
  {
    path: "/faqs",
    name: "FAQs",
    component: () => import("../views/FAQs.vue"),
    meta: { title: `${TITLE} - FAQs`, hideLoaderWithDelay: true },
  },
  {
    path: "/food-safety",
    name: "FoodSafety",
    component: () => import("../views/FoodSafety.vue"),
    meta: { title: `${TITLE} - Food safety`, hideLoaderWithDelay: true },
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: () => import("../views/Privacy.vue"),
    meta: { title: `${TITLE} - Privacy`, hideLoaderWithDelay: true },
  },
  {
    path: "/terms",
    name: "Terms",
    component: () => import("../views/Terms.vue"),
    meta: { title: `${TITLE} - Terms`, hideLoaderWithDelay: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: `${TITLE} - Login`,
      authHelper: true,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("../views/ForgotPassword.vue"),
    meta: {
      title: `${TITLE} - Forgot Password`,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("../views/ResetPassword.vue"),
    meta: {
      title: `${TITLE} - Reset Password`,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: () => import("../views/SignUp.vue"),
    meta: {
      title: `${TITLE} - Sign Up`,
      authHelper: true,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/invitefriends",
    name: "InviteFriends",
    component: () => import("../views/Invitation.vue"),
    meta: {
      title: `${TITLE} - Accept Invitation`,
      authHelper: true,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/invitaion-success",
    name: "InvitationSuccess",
    component: () => import("../views/InvitationSuccess.vue"),
    meta: {
      title: `${TITLE} - Invitation Success`,
      authHelper: true,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/sign-up-success",
    name: "SignUpSuccess",
    component: () => import("../views/SignUpSuccess.vue"),
    meta: {
      title: `${TITLE} - Sign Up Success`,
      // authHelper: true,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/choose-plan",
    name: "ChoosePlan",
    component: () => import("../views/ChoosePlan.vue"),
    meta: {
      title: `${TITLE} - Choose A Plan`,
      // authHelper: true,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/choose-plan/:id",
    name: "ChoosePlanEdit",
    component: () => import("../views/ChoosePlan.vue"),
    meta: {
      title: `${TITLE} - Choose A Plan`,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/plan-checkout",
    name: "PlanCheckout",
    component: () => import("../views/Checkout.vue"),
    meta: {
      title: `${TITLE} - Checkout`,
      // authHelper: true,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/plan-checkout/:id",
    name: "PlanCheckoutEdit",
    component: () => import("../views/Checkout.vue"),
    meta: {
      title: `${TITLE} - Checkout`,
      // authHelper: true,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/plan-success",
    name: "PlanSuccess",
    component: () => import("../views/PlanSuccess.vue"),
    meta: {
      title: `${TITLE} - Plan Success`,
      // authHelper: true,
      hideLoaderWithDelay: true,
    },
  },
  {
    path: "/public-profile/:id",
    name: "Public Profile",
    component: () => import("../views/CookProfile.vue"),
    meta: {
      title: `${TITLE} - Public profile`,
      skipHidingLoader: true,
      isPublic:true
    },
  },
  {
    path: "/profile-rating",
    name: "Rate Profile",
    component: () => import("../views/RateProfile.vue"),
    meta: {
      title: `${TITLE} - Rate Public`,
      skipHidingLoader: true,
      isPublic:true
    },
  },
  {
    path: "/dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      title: `${TITLE} - Dashboard`,
    },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("../components/DashboardContent.vue"),
        meta: { skipHidingLoader: true },
      },
      {
        path: "profile",
        component: () => import("../views/profile/ProfileWrapper.vue"),
        meta: {
          title: `${TITLE} - Profile`,
          noLoader: true,
        },
        children: [
          {
            path: "",
            name: "Edit Profile",
            component: () => import("../views/profile/EditProfile.vue"),
            meta: {
              title: `${TITLE} - Edit Profile`,
              noLoader: true,
            },
          },
          {
            path: "my-meals",
            name: "My Dishes",
            component: () => import("../views/profile/MyMeals.vue"),
            meta: {
              title: `${TITLE} - My Dishes`,
              noLoader: true,
            },
          },
          {
            path: "my-network",
            name: "My Network",
            component: () => import("../views/profile/MyNetwork.vue"),
            meta: {
              title: `${TITLE} - My Network`,
              noLoader: true,
            },
          },
          {
            path: "my-answers",
            name: "My Answers",
            component: () => import("../views/profile/MyAnswers.vue"),
            meta: {
              title: `${TITLE} - My Answers`,
              noLoader: true,
            },
          },
          {
            path: "my-questions",
            name: "My Questions",
            component: () => import("../views/profile/MyQuestions.vue"),
            meta: {
              title: `${TITLE} - My Questions`,
              noLoader: true,
            },
          },
          {
            path: "tokens",
            name: "Tokens",
            component: () => import("../views/profile/Tokens.vue"),
            meta: {
              title: `${TITLE} - Tokens`,
              noLoader: true,
            },
          },
          {
            path: "account",
            name: "Account",
            component: () => import("../views/profile/Account.vue"),
            meta: {
              title: `${TITLE} - Account`,
              noLoader: true,
            },
          },
        ],
      },
      {
        path: "eat",
        name: "Eat",
        component: () => import("../views/Eat.vue"),
        meta: {
          title: `${TITLE} - Eat`,
          noLoader: true, // possibly temp
        },
      },
      {
        path: "shop",
        component: () => import("../views/shop/ShopWrapper.vue"),
        children: [
          {
            path: "",
            name: "Shop",
            component: () => import("../views/shop/Shop.vue"),
            meta: {
              title: `${TITLE} - Shop`,
              headerTitle: "Shop",
              skipHidingLoader: true,
            },
          },
          {
            path: "basket",
            name: "Basket",
            component: () => import("../views/shop/Basket.vue"),
            meta: {
              title: `${TITLE} - Basket`,
              headerTitle: "Basket",
              noLoader: true,
            },
          },
          {
            path: "checkout",
            name: "Checkout",
            component: () => import("../views/shop/Checkout.vue"),
            meta: {
              title: `${TITLE} - Checkout`,
              headerTitle: "Checkout",
              noLoader: true,
            },
          },
          {
            path: "success",
            name: "Success",
            component: () => import("../views/shop/Success.vue"),
            meta: {
              title: `${TITLE} - Success`,
              headerTitle: "Success!",
              noLoader: true,
            },
          },
        ],
      },
      {
        path: "cook",
        name: "Cook",
        component: () => import("../views/Cook.vue"),
        meta: {
          title: `${TITLE} - Cook`,
          noLoader: true, // possibly temp
        },
      },
      {
        path: "cook/new-meal",
        name: "New Meal",
        component: () => import("../views/CreateNewMeal.vue"),
        meta: {
          title: `${TITLE} - Create new meal`,
          noLoader: true, // possibly temp
        },
      },
      {
        path: "offers/:id",
        name: "Offer Info",
        component: () => import("../views/OfferPage.vue"),
        meta: {
          title: `${TITLE} - Offer info`,
          skipHidingLoader: true,
        },
      },
      {
        path: "my-offers/:id",
        name: "My Offer Info",
        component: () => import("../views/MyOfferPage.vue"),
        meta: {
          title: `${TITLE} - Offer Info`,
          skipHidingLoader: true,
        },
      },
      {
        path: "my-meals/:id",
        name: "My Meal Info",
        component: () => import("../views/MyMealPage.vue"),
        meta: {
          title: `${TITLE} - Meal Info`,
          skipHidingLoader: true,
        },
      },
      {
        path: "meals/:id",
        name: "Meal Info",
        component: () => import("../views/MealPage.vue"),
        meta: {
          title: `${TITLE} - Meal Info`,
          skipHidingLoader: true,
        },
      },
      {
        path: "contact-us",
        name: "Contact Us",
        component: () => import("../views/ContactUs.vue"),
        meta: {
          title: `${TITLE} - Contact Us`,
          noLoader: true, // possibly temp
        },
      },
      {
        path: "search",
        name: "Search",
        props: true,
        component: () => import("../views/SearchPage.vue"),
        meta: {
          title: `${TITLE} - Search Results`,
          noLoader: true, // possibly temp
        },
      },
      {
        path: "cook-profile/:id",
        name: "Cook Profile",
        component: () => import("../views/CookProfile.vue"),
        meta: {
          title: `${TITLE} - Cook profile`,
          skipHidingLoader: true,
        },
      },
      {
        path: "booking/:id",
        name: "Booking",
        component: () => import("../views/BookingPage.vue"),
        meta: {
          title: `${TITLE} - Booking`,
          skipHidingLoader: true,
        },
      },
      {
        path: "edit-meal/:id",
        name: "Edit Meal",
        component: () => import("../views/EditMeal.vue"),
        meta: {
          title: `${TITLE} - Edit Meal`,
          skipHidingLoader: true,
        },
      },
      {
        path: "edit-offer/:id",
        name: "Edit Offer",
        component: () => import("../views/EditOffer.vue"),
        meta: {
          title: `${TITLE} - Edit Offer`,
          skipHidingLoader: true,
        },
      },
      {
        path: "privacy",
        name: "Privacy Policy",
        component: () => import("../views/PrivacyPolicyDashboard.vue"),
        meta: {
          title: `${TITLE} - Privacy Policy`,
          noLoader: true,
        },
      },
      {
        path: "terms",
        name: "Terms of Use",
        component: () => import("../views/TermsOfUseDashboard.vue"),
        meta: {
          title: `${TITLE} - Terms`,
          noLoader: true,
        },
      },
      {
        path: "not-found",
        name: "NotFound",
        component: () => import("../views/NotFound.vue"),
        meta: {
          title: `${TITLE} - Not Found`,
          noLoader: true,
        },
      },
      {
        path: "*",
        redirect:getDashboard()// "/dashboard",
      },
    ],
  },
  {
    path: "*",
    redirect:getDashboard() //"/dashboard",
  },
  {
    path: "/admin",
    component: () => import("../views/AdminDashboard.vue"),
    meta: {
      title: `${TITLE} - Admin`,
    },
    children: [
      {
        path: "",
        name: "Admin Dashboard",
        component: () => import("../components/AdminDashboardContent.vue"),
        meta: { noLoader: true, isAdmin:true },
        children: [
          {
            path: "",
            name: "Users",
            component: () => import("../components/Users.vue"),
            meta: {
              title: `${TITLE} - All Users`,
              noLoader: true,
            },
          },
          {
            path: "user-details/:id",
            name: "UserDetails",
            component: () => import("../components/UserDetails.vue"),
            meta: {
              title: `${TITLE} - User Details`,
              noLoader: true,
            },
          }
        ]
      },
      {
        path: "profile",
        component: () => import("../views/profile/ProfileWrapper.vue"),
        meta: {
          title: `${TITLE} - Profile`,
          noLoader: true,
        },
        children: [
          {
            path: "",
            name: "Edit Profile",
            component: () => import("../views/profile/EditProfile.vue"),
            meta: {
              title: `${TITLE} - Edit Profile`,
              noLoader: true,
            },
          }
        ]
      }
    ]
  }
];

function getDashboard(){
  const role = localStorage.getItem("role");
  const isAdmin=role=="admin";
  return isAdmin?"/admin":"/dashboard"
}

const router = new VueRouter({
  mode: 'history',
  routes,
});

function hideLoader() {
  if (Vue.prototype.$loader && Vue.prototype.$loader.hide) {
    Vue.prototype.$loader.hide();
    Vue.prototype.$loader = null;
  }
}

function showLoader() {
  hideLoader();
  Vue.prototype.$loader = Vue.$loading.show();
}
router.beforeResolve((to, from, next) => {
  if (to.name && (!to.meta || !to.meta.noLoader)) {
    showLoader();
  }
  next();
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
  const role = localStorage.getItem("role");
  const isAdmin = role == "admin";

  if (to.path === "/" && _token) {
    next(isAdmin ? "/admin" : "/dashboard");
  }

  if (to.meta.authHelper) {
    // check if token exists
    if (_token){
      next(isAdmin ? "/admin" : "/dashboard");
    }
  } else if (!_token) {
    if (to.path.includes("dashboard") || to.path.includes("admin")) {
      next("/login");
    }
  }

  // Add tiny timeout to finish page transition
  setTimeout(() => next(), 10);
});

export default router;
