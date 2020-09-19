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
import { authMethods } from '~/mixins/RegisteredMixins';
import { DASHBOARD_PATH } from '~/pages/dashboard/index.vue';
import { PATIENT_PATH } from '~/pages/dashboard/pacientes/_id.vue';
import { PATIENTS_PATH } from '~/pages/dashboard/pacientes/index.vue';
import { PREFERENCES_PATH } from '~/pages/dashboard/preferencias/index.vue';
import { ADD_PATIENT_PATH } from '~/pages/dashboard/pacientes/adicionar.vue';
import { QUESTIONNAIRES_PATH } from '~/pages/dashboard/questionarios/index.vue';
import { NEW_QUESTIONNAIRE_PATH } from '~/pages/dashboard/questionarios/novo.vue';

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
          onClick: () => this.$router.push(DASHBOARD_PATH),
        },
        {
          iconName: 'el-icon-user',
          label: 'Pacientes',
          index: 'patients',
          onClick: () => this.$router.push(PATIENTS_PATH),
        },
        {
          iconName: 'el-icon-notebook-2',
          label: 'Questionários',
          index: 'questionnaires',
          onClick: () => this.$router.push(QUESTIONNAIRES_PATH),
        },
        {
          iconName: 'el-icon-setting',
          label: 'Preferências',
          index: 'preferences',
          onClick: () => this.$router.push(PREFERENCES_PATH),
        },
      ];
    },
    currentActiveLink() {
      const { path: currentRoute } = this.$route;
      switch (currentRoute) {
        case DASHBOARD_PATH:
          return 'home';
        case PATIENT_PATH:
        case PATIENTS_PATH:
        case ADD_PATIENT_PATH:
          return 'patients';
        case QUESTIONNAIRES_PATH:
        case NEW_QUESTIONNAIRE_PATH:
          return 'questionnaires';
        case PREFERENCES_PATH:
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
