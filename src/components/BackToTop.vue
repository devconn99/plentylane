<template>
    <div id="back-top" class="back-to-top">
        <div class="item-wrapper" title="Go to Top" @click="scrollToTop">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835">
                <path
                        d="M129.007 57.819c-4.68-4.68-12.499-4.68-17.191 0L3.555 165.803c-4.74 4.74-4.74 12.427 0 17.155 4.74 4.74 12.439 4.74 17.179 0l99.683-99.406 99.671 99.418c4.752 4.74 12.439 4.74 17.191 0 4.74-4.74 4.74-12.427 0-17.155L129.007 57.819z" />
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    name: "BackToTop",
    methods: {
        scrollToTop () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
        }
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.back-to-top {
    cursor: pointer;
    background: $greenNavyFooColor;
    height: 40px;
    width: 40px;
    right: 25px;
    bottom: 15px;
    position: fixed;
    text-align: center;
    border-radius: 50%;
    border: 2px solid $greenNavyFooColor;
    display: none;
    opacity: 0.7;
    -webkit-transition: .3s all ease;
    -o-transition: .3s all ease;
    transition: .3s all ease;
    @media screen and (max-width: $tableMinWidth) {
        width: 35px;
        height: 35px;
        right: 13px;
    }
    .item-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        svg {
            width: 15px;
            path {
                fill: $mainBackgroundColor;
            }
        }
    }
    &:hover {
        opacity: 1;
        -webkit-transition: .3s all ease;
        -o-transition: .3s all ease;
        transition: .3s all ease;
    }
}
</style>
