<template>
    <carousel
            :loop="options.loop"
            :items="options.items"
            :margin="options.margin"
            :stagePadding="options.stagePadding"
            :nav="options.nav"
            :dots="options.dots"
            :responsive="options.responsive"
    >
        <slot></slot>
    </carousel>
</template>

<script>
import carousel from 'vue-owl-carousel';
export default {
    name: "CarouselContainer",
    components: {carousel},
    data: () => ({
        options: {
            loop: false,
            items: 1,
            margin: 30,
            stagePadding: 0,
            nav: false,
            dots: false,
            responsive: {
                0: { items: 1.2, loop: true, margin: 15 },
                425: { items: 1.5, loop: true },
                575: { items: 2,  loop: true },
                700: { items: 2.5, loop: true },
                768: { items: 1.5, loop: true },
                920: { items: 2, loop: true },
                1280: { items: 3 }
            }
        }
    })
}
</script>

<style scoped>

</style>
