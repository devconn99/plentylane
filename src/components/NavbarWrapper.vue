<template>
    <div class="navbar-wrapper">
        <Navbar></Navbar>
        <slot></slot>
    </div>
</template>

<script>
import Navbar from "./Navbar"
export default {
    name: "NavbarWrapper",
    components: {Navbar}
}
</script>

<style scoped lang="scss">
@import "../variables.scss";

.navbar-wrapper {
    min-height: 322px;
    width: 100%;
    background-color: $navbar-bg;
    position: relative;
    padding-top: 25px;
    &:after {
        content: '';
        position: absolute;
        bottom: -30px; // TODO: check it later!
        display: block;
        height: 170px;
        background: radial-gradient(100% 100% at top, transparent 60%, #FEF8E6 61%);
        width: 100%;
    }
}
</style>
