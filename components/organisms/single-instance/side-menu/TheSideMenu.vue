<template lang="pug">
  el-menu.the-side-menu-wrapper
    img.logo(src="/logos/luftcare-logo-black.png")

    el-menu-item(
      v-for="({ iconName, label, index, onClick }) in topLinks"
      @click="onClick"
      :class="{ 'is-active': currentActiveLink === index }"
      :index="index"
      :key="index"
    )
      i(:class="iconName")
      span {{ label }}

    .flex-grow

    el-menu-item(@click="$authMethodsLogout")
      i.el-icon-switch-button
      span Sair
</template>

<script lang="ts">
import Vue from 'vue';
import { authMethods } from '~/mixins/RegisteredMixins';

type SideMenuLinkIndex = 'home' | 'forms';

type SideMenuLink = {
  label: string;
  iconName: string;
  index: SideMenuLinkIndex;
  onClick: () => void;
};

type Data = {};
type Methods = {};
type Computed = {
  topLinks: SideMenuLink[];
  bottomLinks: SideMenuLink[];
  currentActiveLink: SideMenuLinkIndex | undefined;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  mixins: [authMethods],
  computed: {
    topLinks() {
      return [
        {
          iconName: 'el-icon-house',
          label: 'Início',
          index: 'home',
          onClick: () => this.$router.push('/dashboard'),
        },
        {
          iconName: 'el-icon-notebook-2',
          label: 'Formulários',
          index: 'forms',
          onClick: () => this.$router.push('/dashboard/formularios'),
        },
      ];
    },
    bottomLinks() {
      return [
        {
          iconName: 'el-icon-switch-button',
          label: 'Sair',
          index: 'forms',
          onClick: () => this.$authMethodsLogout,
        },
      ];
    },
    currentActiveLink() {
      const { path: currentRoute } = this.$route;
      switch (currentRoute) {
        case '/dashboard':
          return 'home';
        case '/dashboard/formularios':
          return 'forms';
        default:
          return undefined;
      }
    },
  },
  methods: {},
});
</script>

<style lang="postcss" scoped>
.the-side-menu-wrapper {
  @apply hidden;

  .logo {
    @apply w-32 my-9 mx-auto;
  }

  li {
    @apply mx-3 my-2 rounded-lg h-12 leading-none flex items-center text-gray-700;
    &.is-active {
      @apply text-avocado bg-avocado bg-opacity-10;
    }
  }
}
@screen md {
  .the-side-menu-wrapper {
    @apply flex flex-col flex-shrink-0 flex-grow-0 w-64;
  }
}
</style>
