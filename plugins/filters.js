import Vue from 'vue';
Vue.filter("kebabToTitleCase", (value) => {
  return value
    ? value
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    : value;
});