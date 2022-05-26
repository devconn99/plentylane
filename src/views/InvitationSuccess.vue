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
          <div class="authorization-label">
            <p></p>
          </div>

          <div class="authorization-box-position pt-0 position-relative">
            <h1 class="title-size2 titleGreenNavyColor">Congratulations!</h1>

            <div class="authorization-box-info">
              <p>
                <span class="font-weight-bold">Invitaion Accepted</span>
                Please <router-link to="/login">login</router-link> here.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
  export default {
    name: "SignUpSuccess",
  }
</script>

<style scoped lang="scss">
  .authorization-label {
    margin: 0 80px 25px;

    p, strong {
      line-height: 1.75;
      font-size: 20px;
      text-align: center;
      margin: 0;
      color: #194F5A;
    }
  }
</style>
