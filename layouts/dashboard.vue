<template lang="pug">
  .dashboard-wrapper
    the-side-menu.menu
    .content
      .container.mx-auto
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
  @apply flex w-screen;

  $side-menu-width: 16rem;
  .menu:not(.collapsed),
  .menu:not(.collapsed) >>> .the-side-menu {
    width: $side-menu-width;
  }

  .content {
    @apply flex flex-col items-center justify-start bg-gray-100 bg-opacity-60 transition-all duration-300 ease-out;
    width: calc(100vw - $side-menu-width);
    & > div {
      @apply w-full;
    }
  }

  $collapsed-side-menu-width: 5rem;
  .menu.collapsed,
  .menu.collapsed >>> .the-side-menu {
    width: $collapsed-side-menu-width;
  }
  .menu.collapsed ~ .content {
    width: calc(100vw - $collapsed-side-menu-width);
    & > div {
      @apply w-full;
    }
  }
}


@screen xl {
  .dashboard-wrapper {
    $side-menu-width: 18rem;
    .menu:not(.collapsed),
    .menu:not(.collapsed) >>> .the-side-menu {
      width: $side-menu-width;
    }

    .content {
      width: calc(100vw - $side-menu-width);
    }
  }
}
</style>
