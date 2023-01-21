import Vue from 'vue';

export default function ({ app }) {
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
  app.router.beforeResolve((to, from, next) => {
    if (to.name && (!to.meta || !to.meta.noLoader)) {
      showLoader();
    }
    next();
  });
  
  app.router.afterEach((to, from) => {
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
  
  app.router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.title) {
      document.title = to.meta.title;
    }
     const _token = localStorage.getItem("plAccessToken");
     if (to.path === "/" && _token) {
      next("/dashboard");
    }
  
    if (to.meta.authHelper) {
      // check if token exists
      const isInvitationLink = to.name == "InviteNetwork" || to.name == "InviteFriends";
      if(_token && !isInvitationLink) {
        // than redirect to home page
        next("/dashboard");
      }
    } else if (!_token) {
      if (to.path.includes("dashboard") || to.path.includes("admin")) {
        next("/login");
      }
    }
  
    // Add tiny timeout to finish page transition
    setTimeout(() => next(), 10);
  });
}