<template lang="pug">
  .dashboard-wrapper
    the-side-menu
    .content
      .container.mx-auto
        nuxt
</template>

<script lang="ts">
import Vue from 'vue';
import TheSideMenu from '@/components/organisms/single-instance/side-menu/TheSideMenu.vue';

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
  @apply grid;
  grid-template-columns: 100vw;

  .content {
    @apply flex flex-col items-center justify-start w-full bg-gray-100 bg-opacity-60;
    & > div {
      @apply w-full;
    }
  }
}
@screen md {
  $sidebar-width: 14rem;
  .dashboard-wrapper {
    grid-template-columns: $sidebar-width calc(100vw - $sidebar-width);
  }
}
@screen lg {
  $sidebar-width: 16rem;
  .dashboard-wrapper {
    grid-template-columns: $sidebar-width calc(100vw - $sidebar-width);
  }
}
@screen xl {
  $sidebar-width: 20rem;
  .dashboard-wrapper {
    grid-template-columns: $sidebar-width calc(100vw - $sidebar-width);
  }
}
</style>
