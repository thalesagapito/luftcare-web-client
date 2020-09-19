<template lang="pug">
  .dashboard-wrapper
    the-side-menu.menu
    .content
      .container.mx-auto
        nuxt
</template>

<script lang="ts">
import Vue from 'vue';
import CurrentUserQueryGQL from '~/graphql/queries/User/currentUser';
import TheSideMenu from '~/components/organisms/single-instance/side-menu/TheSideMenu.vue';
import { CurrentUserQuery } from '~/types/gql';

type Data = {
  currentUser: CurrentUserQuery['currentUser'];
};
type Methods = {};
type Computed = {};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { TheSideMenu },
  apollo: {
    currentUser: {
      query: CurrentUserQueryGQL,
      // TODO figure this out
      // loadingKey: 'isPatientsTableLoading',
      // error: debounce(smartQueryErrorHandler, 10),
      fetchPolicy: 'cache-and-network',
      update: ({ currentUser } : CurrentUserQuery) => currentUser,
    },
  },
  mounted() {
    this.$accessor.currentUser.setCurrentUser(this.currentUser);
  },
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
