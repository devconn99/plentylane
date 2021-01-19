<template>
    <div id="preloader-active" ref="preLoader">
        <div class="preloader green-bg d-flex align-items-center justify-content-center">
            <div class="preloader-inner position-relative">
                <div class="preloader-circle"></div>
                <div class="preloader-img pere-text">
                    <img src="../assets/images/logo/logo_green.svg" alt="" class="img-fluid">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PreLoader"
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.preloader {
    background-image: url('../assets/images/authorization/authorization.svg'); // path is fine
    background-position: center;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999;
     -webkit-transition: .6s all ease;
     -o-transition: .6s all ease;
    transition: .6s all ease;
    margin: 0 auto;
}
.preloader .preloader-circle {
    width: 150px;
    height: 150px;
    position: relative;
    border-style: solid;
    border-width: 8px;
    border-top-color: $greenColor;
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
    z-index: 10;
    border-radius: 50%;
     -webkit-box-shadow: 0 1px 5px 0 rgba(35, 181, 185, 0.15);
    box-shadow: 0 1px 5px 0 rgba(35, 181, 185, 0.15);
    background-color: $mainBackgroundColor;
     -webkit-animation: zoom 2000ms infinite ease;
    animation: zoom 2000ms infinite ease;
     -webkit-transition: .6s all ease;
     -o-transition: .6s all ease;
    transition: .6s all ease;
}
.preloader .preloader-img {
    position: absolute;
    top: 50%;
    z-index: 200;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
    display: inline-block;
     -webkit-transform: translateY(-50%);
     -ms-transform: translateY(-50%);
    transform: translateY(-50%);
     -webkit-transition: .6s all ease;
     -o-transition: .6s all ease;
    transition: .6s all ease;
}
.preloader .preloader-img img {
    max-width: 75%;
}
.preloader .pere-text strong {
    color: $greenColor;
    text-transform: uppercase;
}

@-webkit-keyframes zoom {
    0% {
         -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
         -webkit-transition: .6s all ease;
         -o-transition: .6s all ease;
        transition: .6s all ease;
    }
    100% {
         -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
         -webkit-transition: .6s all ease;
         -o-transition: .6s all ease;
        transition: .6s all ease;
    }
}
@keyframes zoom {
    0% {
         -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
         -webkit-transition: .6s all ease;
         -o-transition: .6s all ease;
        transition: .6s all ease;
    }
    100% {
         -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
         -webkit-transition: .6s all ease;
         -o-transition: .6s all ease;
        transition: .6s all ease;
    }
}
</style>
