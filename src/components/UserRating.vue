<template>
  <div class="cook-info-benefits-box longbox">
    <SvgIcon icon="star"></SvgIcon>
    <span>
      <template v-if="rating">{{rating}}</template>
      <template v-else>No rating yet</template>
    </span>
  </div>
</template>

<script>
import SvgIcon from './SvgIcon';
export default {
  name: "UserRating",
  components: {SvgIcon},
  props: ['rating']
}
</script>

<style scoped>

</style>
