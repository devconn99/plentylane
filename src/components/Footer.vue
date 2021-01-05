<template>
    <div class="d-flex flex-column w-100">
        <div class="header-footer d-flex w-100 justify-content-center align-items-center">
            <img class="header-footer-image" src="../assets/share-more-clean-less.svg" alt="Image share more clean less">
        </div>
        <div class="bottom-footer d-flex align-items-center w-100">
            <div class="footer-nav-wrapper d-flex flex-column">
                <!-- navigation -->
                <nav class="navbar navbar-expand p-0">
                    <img src="../assets/logo.svg" width="94" height="48" alt="Plenty Lane logo">
                    <div class="collapse navbar-collapse">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item">
                                <router-link class="nav-link" to="/how-it-works">How it works</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/pricing">Pricing</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/faqs">FAQs</router-link>
                            </li>
                            <li class="nav-item">
                                <!-- TODO: set correct `to` param -->
                                <router-link class="nav-link" to="/food-safety">Food Safety</router-link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <p class="text-copyright">
                    &copy;2020
                    <a href="https://www.plentylane.com" target="_blank">PlentyLane.com</a>. All Rights Reserved.
                </p>
            </div>
            <div class="sign-up-login-wrapper d-flex flex-column">
                <button class="btn btn-sign-up">Sign Up Today!</button>
                <p>Already have an account?</p>
                <button class="btn btn-login">
                    <img src="../assets/icons/lock.svg" alt="Lock icon">
                    <span class="btn-login-text">Login</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Footer"
}
</script>

<style scoped lang="scss">
.header-footer {
    height: 297px;
    background-color: #18B585;
    .header-footer-image {
        width: 296px;
        height: 212px;
    }
}
.bottom-footer {
    background-color: #17434C;
    min-height: 256px;
    padding-left: 80px;
    padding-right: 80px;
    justify-content: space-between;
    .footer-nav-wrapper {
        width: 100%;
        align-items: baseline;
        margin-right: 20px;
        .text-copyright {
            color: #fff;
            font-size: 14px;
            line-height: 24px;
            a {
                color: #fff !important;
            }
        }
        .navbar {
            margin-bottom: 90px;
            .navbar-collapse {
                margin-left: 58px;
            }
            .navbar-nav {
                .nav-item {
                    &:first-of-type {
                        margin-left: 0;
                    }
                    &:last-of-type {
                        margin-right: 0;
                    }
                    margin-left: 15px;
                    margin-right: 15px;
                    .nav-link {
                        color: #009C90;
                        font-size: 16px;
                        line-height: 24px;
                    }
                }
            }
        }
    }
    .sign-up-login-wrapper {
        width: 100%;
        color: #FEF8E6;
        align-items: center;
        max-width: 240px;
        margin-left: 20px;
        p {
            font-size: 16px;
            line-height: 24px;
        }
        .btn-sign-up {
            width: 240px;
            min-height: 48px;
            background-color: #FF806D;
            border-radius: 0;
            color: #FFFEFA;
            font-size: 18px;
            letter-spacing: 0.6px;
            margin-bottom: 30px;
            font-weight: bold;
        }
        .btn-login {
            color: #009C90;
            font-size: 18px;
            border-radius: 0;
            font-weight: bold;
            .btn-login-text {
                margin-left: 9px;
            }
        }
    }
}
</style>
