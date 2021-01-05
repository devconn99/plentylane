<template>
  <div class="home">
    <!--<img alt="Vue logo" src="../assets/logo.svg">-->
    <HelloWorld msg="Welcome to the Plenty Lane App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
