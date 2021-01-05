<template>
    <nav class="navbar navbar-expand-md justify-content-between">
        <a class="navbar-brand" href="/">
            <img src="../assets/logo.svg" width="94" height="48" alt="Plenty Lane logo">
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarItems" aria-controls="navbarItems" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarItems">
            <ul class="navbar-nav ml-auto">
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
                    <!-- TODO: include Login view to the router -->
                    <router-link class="nav-link" to="/login">Login</router-link>
                </li>
                <li class="nav-item">
                    <!-- TODO -->
                    <router-link class="btn btn-sign-up" to="/sign-up" tag="button">Sign Up</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
    name: "Navbar"
}
</script>

<style scoped lang="scss">
.navbar {
    padding-left: 80px;
    padding-right: 80px;
    background-color: #009C90;
    .navbar-nav {
        min-height: 48px;
        align-items: center;
        .nav-item {
            .nav-link {
                color: #FEF8E6;
                font-weight: bold;
                font-size: 16px;
                line-height: 24px;
                padding-left: 16px;
                padding-right: 16px;
                &.router-link-active {
                    color: #F5BE00;
                }
            }
            .btn-sign-up {
                margin-left: 16px;
                color: #FEF8E6;
                background-color: #FF806D;
                border-color: #FF806D;
                border-radius: 0;
                width: 124px;
                height: 48px;
                font-weight: bold;
            }
        }
    }
}
</style>
