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
        0: { items: 1.2, margin: 15 },
        425: { items: 1.5 },
        575: { items: 2 },
        700: { items: 2.5 },
        768: { items: 1.5 },
        920: { items: 2 },
        1280: { items: 3 }
      }
    }
  })
}
</script>

<style scoped>

</style>
