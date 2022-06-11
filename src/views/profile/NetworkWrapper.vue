<template>
  <div class="network-wrapper">
    <div
      class="dashboard-content"
      v-bind:class="{ 'mobile-aside-enabled': isMobileAsideEnabled }"
    >
      <div class="container-fluid">
        <my-network />
      </div>
    </div>
  </div>
</template>

<script>
import MyNetwork from './MyNetwork.vue';

export default {
  name: "NetworkWrapper",
  components: { MyNetwork},
  data: () => ({
    isMobileAsideEnabled: false
  }),
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.isMobileAsideEnabled = false;
    });
  },
  beforeRouteUpdate (to, from, next) {
    this.isMobileAsideEnabled = false;
    next();
  },
  created () {
    this.$eventHub.$on('show-mobile-profile-aside', () => {
      this.isMobileAsideEnabled = true;
    })
  },
  beforeDestroy () {
    this.$eventHub.$off('show-mobile-profile-aside');
  }
}
</script>
