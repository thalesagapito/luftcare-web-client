<template lang="pug">
.page-wrapper
  page-scrim
  navbar
  .content
    nuxt
</template>

<script lang="ts">
import Vue from 'vue';
import PageScrim from '~/components/organisms/single-instance/TheScrim.vue';
import Navbar from '~/components/organisms/single-instance/navbar/TheNavbar.vue';

export default Vue.extend({
  components: {
    Navbar,
    PageScrim,
  },
});
</script>

<style lang="postcss" scoped>
.page-wrapper {
  @apply transition-colors duration-300 ease-in-out min-h-screen bg-white text-gray-900;
}
</style>
