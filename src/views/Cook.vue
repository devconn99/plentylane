<template>
    <div class="cook-page mt-3">
        <p class="title-size1 mb-4">Let's get cooking!</p>
        <div class="d-flex flex-column my-3">
            <router-link to="cook/new-meal" tag="button" class="btn btn-green">New Meal</router-link>
            <b-button class="btn btn-green mt-3" disabled>Copy Meal</b-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Cook"
}
</script>

<style scoped lang="scss">

</style>
