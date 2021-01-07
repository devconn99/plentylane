<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './style';
</style>
<script>
import Navbar from "./components/Navbar";
import NavbarWrapper from "./components/NavbarWrapper";
export default {
    components: {NavbarWrapper, Navbar}
}
</script>
