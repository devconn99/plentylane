<template>
  <div
    :class="isRated ? 'bg-yellow' : 'rating-star'"
    @click="selectStarToRate()"
  />
</template>

<script>
export default {
  name: "RatingStar",
  props: {
    isRated: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    selectStarToRate() {
      this.$emit("onChange");
    },
  },
};
</script>

<style lang="scss">
.rating-star,
.bg-yellow {
  width: 40px;
  height: 40px;
  margin: 0 10px;
  cursor: pointer;
  &:hover {
    color: #f3d52a;
  }
}
.rating-star {
  color: black;
  &:before {
    content: "☆";
    position: absolute;
    transform: scale(2);
  }
}
.bg-yellow {
  color: #FFE135;
  &:before {
    content: "★";
    position: absolute;
    transform: scale(2);
  }
}
</style>
