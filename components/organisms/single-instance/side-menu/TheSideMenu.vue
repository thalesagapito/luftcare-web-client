<template lang="pug">
  .the-side-menu-wrapper(:class="wrapperClass")
    el-menu.the-side-menu

      el-button(
        circle
        size="small"
        type="default"
        class="toggle-open"
        icon="el-icon-arrow-left"
        @click="toggleMenuDrawer"
      )

      img.logo(src="/logos/luftcare-logo-black.png")

      el-menu-item(
        v-for="({ iconName, label, index, onClick }) in topLinks"
        @click="onClick"
        :class="{ 'is-active': currentActiveLink === index }"
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
import { authMethods } from '@/mixins/RegisteredMixins';
import { ROUTE_NAME as PREFERENCES_ROUTE_NAME } from '@/pages/dashboard/preferencias/index.vue';
import { ROUTE_NAME as ADD_PATIENT_ROUTE_NAME } from '~/pages/dashboard/pacientes/adicionar.vue';

type SideMenuLinkIndex = 'home' | 'questionnaires' | 'patients' | 'preferences';

type SideMenuLink = {
  label: string;
  iconName: string;
  index: SideMenuLinkIndex;
  onClick: () => void;
};

type Data = {};
type Methods = {
  toggleMenuDrawer: () => void;
};
type Computed = {
  isDrawerOpen: boolean;
  wrapperClass: string;
  topLinks: SideMenuLink[];
  currentActiveLink: SideMenuLinkIndex | undefined;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  mixins: [authMethods],
  computed: {
    isDrawerOpen() {
      return this.$accessor.layout.isMenuDrawerOpen;
    },
    wrapperClass() {
      return this.isDrawerOpen ? '' : 'collapsed';
    },
    topLinks() {
      return [
        {
          iconName: 'el-icon-house',
          label: 'Início',
          index: 'home',
          onClick: () => this.$router.push('/dashboard'),
        },
        {
          iconName: 'el-icon-user',
          label: 'Pacientes',
          index: 'patients',
          onClick: () => this.$router.push('/dashboard/pacientes'),
        },
        {
          iconName: 'el-icon-notebook-2',
          label: 'Questionários',
          index: 'questionnaires',
          onClick: () => this.$router.push('/dashboard/questionarios'),
        },
        {
          iconName: 'el-icon-setting',
          label: 'Preferências',
          index: 'preferences',
          onClick: () => this.$router.push({ name: PREFERENCES_ROUTE_NAME }),
        },
      ];
    },
    currentActiveLink() {
      const { path: currentRoute } = this.$route;
      switch (currentRoute) {
        case '/dashboard':
          return 'home';
        case '/dashboard/pacientes':
        case ADD_PATIENT_ROUTE_NAME:
          return 'patients';
        case '/dashboard/questionarios':
        case '/dashboard/questionarios/novo':
          return 'questionnaires';
        case '/dashboard/preferencias':
          return 'preferences';
        default:
          return undefined;
      }
    },
  },
  methods: {
    toggleMenuDrawer() {
      this.$accessor.layout.toggleMenuDrawer();
    },
  },
});
</script>

<style lang="postcss" scoped>
.the-side-menu-wrapper {
  @apply hidden overflow-hidden flex-shrink-0 max-h-screen;

  .the-side-menu {
    @apply hidden h-full fixed flex-col left-0 top-0 pb-4;

    .toggle-open {
      @apply absolute right-0 mt-16 transform translate-x-1/2;
    }

    .logo {
      @apply w-24 my-9 mx-auto;
    }

    li {
      @apply mx-3 my-1 rounded-lg h-12 leading-none flex items-center text-gray-700 px-0 overflow-hidden;
      &.is-active {
        @apply text-lapis bg-lapis bg-opacity-10;
      }
    }
  }
}

.the-side-menu-wrapper,
.the-side-menu-wrapper .the-side-menu,
.the-side-menu-wrapper .the-side-menu .logo,
.the-side-menu-wrapper .the-side-menu li >>> i,
.the-side-menu-wrapper .the-side-menu .toggle-open >>> i {
  @apply transition-all duration-300 ease-out;
}

.the-side-menu-wrapper.collapsed,
.the-side-menu-wrapper.collapsed .the-side-menu {
  .toggle-open >>> i {
    @apply transform rotate-180;
  }
  .logo {
    @apply w-14 mt-9 mb-12;
  }
  li >>> i {
    margin-left: -8px;
  }
}

.the-side-menu-wrapper.collapsed .the-side-menu {
  li span {
    @apply hidden;
  }
}

@screen md {
  .the-side-menu-wrapper,
  .the-side-menu-wrapper .the-side-menu {
    @apply flex;
  }
}
</style>
