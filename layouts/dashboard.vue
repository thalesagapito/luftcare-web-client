<template lang="pug">
  .dashboard-wrapper
    the-side-menu
    .content
      nuxt
</template>

<script lang="ts">
import Vue from 'vue';
import TheSideMenu from '~/components/organisms/single-instance/side-menu/TheSideMenu.vue';

type Data = {};
type Methods = {};
type Computed = {};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { TheSideMenu },
});
</script>

<style lang="postcss" scoped>
.dashboard-wrapper {
  @apply flex flex-grow overflow-x-hidden;

  .content {
    @apply flex flex-col flex-grow items-center justify-start w-full bg-gray-100 bg-opacity-70;
  }
}
</style>
