<template>
    <div class="hero-wave">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
             viewBox="0 0 1280 67">
            <defs>
                <path
                        d="M640 67H.998L.988.613C176.974 42.2 398.86 67 640 67zM1279.013.613L1279.002 67H640c241.14 0 463.024-24.8 639.013-66.387z"
                        id="a" fill="#FEF8E6"></path>
            </defs>
            <use fill="#FEF8E6" xlink:href="#a" fill-rule="evenodd"></use>
        </svg>
    </div>
</template>

<script>
export default {
    name: "HeroWave"
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.hero-wave {
    position: absolute;
    bottom: -1px;
    left: -10px;
    width: calc(100% + 20px);
    @media screen and (max-width: $phoneWidth) {
        bottom: -3px;
    }
    @media screen and (max-width: $mdphoneWidth) {
        bottom: -4px;
    }
}
</style>
