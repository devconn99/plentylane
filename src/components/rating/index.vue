<template>
  <div class="rating-app">
    <RatingStar
      @onChange="updateRatingValue(i)"
      v-for="(rating, i) in totalRatings"
      :key="i"
      :isRated="rating.rated"
    />
  </div>
</template>

<script>
import RatingStar from "./RatingStar.vue";

export default {
  name: "Rating",
  props:{
    value:{
      type:Number,
      default:0
    }
  },
  components: {
    RatingStar,
  },
  data() {
    return {
      totalRatings: [
        {
          index: 0,
          rated: false,
        },
        {
          index: 1,
          rated: false,
        },
        {
          index: 2,
          rated: false,
        },
        {
          index: 3,
          rated: false,
        },
        {
          index: 4,
          rated: false,
        },
      ],
    };
  },
  watch:{
    value:{
      handler: function (newVal) {
        this.manipulateRating()   
      },
      immediate:true
    }
  },
  mounted(){
    this.manipulateRating()
  },
  methods: {
    updateRatingValue(index) {
      this.totalRatings.forEach((res) => {
        if (res.index <= index) {
          res.rated = true;
        } else {
          res.rated = false;
        }
      });
      const rate=(this.totalRatings[index].index+1);
      this.$emit("input", rate);
    },
    manipulateRating() {
      const rate = this.value;
      const rateIndex = this.value - 1;

      if(rate) {
        this.totalRatings.forEach((res) => {
          res.rated = res.index <= rateIndex;
        });
      }
    }
  },
};
</script>

<style lang="scss">
.rating-app {
  display: flex;
}
</style>
