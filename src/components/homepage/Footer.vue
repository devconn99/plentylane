<template>
    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="col-lg-9">
                    <div class="footer-box">
                        <div class="footer-box-part1">
                            <div class="logo-block">
                                <router-link to="/">
                                    <img src="../../assets/images/logo/logo_red.svg" alt="" class="img-fluid">
                                </router-link>
                            </div>
                            <nav class="footer-nav">
                                <ul class="footer-nav-menu-landing">
                                    <li>
                                        <router-link to="/how-it-works">How it works</router-link>
                                    </li>
                                    <li>
                                        <router-link to="/pricing">Pricing</router-link>
                                    </li>
                                    <li>
                                        <router-link to="/faqs">FAQs</router-link>
                                    </li>
                                    <li>
                                        <router-link to="/food-safety">Food Safety</router-link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div class="copyright">
                            &copy;2020
                            <a href="https://www.plentylane.com" target="_blank">PlentyLane.com</a>. <span>All Rights Reserved.</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 d-none d-lg-block ml-auto">
                    <div class="footer-login">
                        <div class="footer-login-btn">
                            <router-link to="/sign-up" class="main-btn btn-red hover-slide-left">
                                <span>Sign Up Today!</span>
                            </router-link>
                        </div>
                        <div class="footer-login-text titleLightColor">
                            Already have an account?
                        </div>
                        <div class="footer-login-link">
                            <router-link to="login">
                                <SvgIcon icon="lock"></SvgIcon>
                                Login
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
import SvgIcon from '../SvgIcon';
export default {
    name: "Footer",
    components: {SvgIcon}
}
</script>

<style scoped lang="scss">

</style>
