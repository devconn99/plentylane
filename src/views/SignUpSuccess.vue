<template>
  <div id="authorization-page">
    <header class="header">
      <div class="container">
        <div class="header-box">
          <div class="logo-block">
            <router-link to="/">
              <img src="../assets/images/logo/logo_green.svg" alt="" class="img-fluid">
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="authorization">
        <div class="authorization-box">
          <div class="authorization-box-position pt-0 position-relative">
            <h1 class="title-size2 titleGreenNavyColor">Congratulations!</h1>

            <div class="authorization-box-info">
              <p>
                <span class="font-weight-bold">Welcome to Plenty Lane!</span>
                We'll ship your containers and send you an email with tips to get stated.
                In the meantime, <router-link to="/login">login</router-link> to see what's cooking.
              </p>
            </div>

            <b-button
              class="btnGreen btnBigSize btn50 text-uppercase hover-slide-left mt-5"
              @click="$router.push({ path: '/login' })"
            >
              <span>Login</span>
            </b-button>
          </div>
        </div>
        <div class="authorization-background green-bg"></div>
      </section>
    </main>
  </div>
</template>

<script>
  export default {
    name: "SignUpSuccess",
  }
</script>
