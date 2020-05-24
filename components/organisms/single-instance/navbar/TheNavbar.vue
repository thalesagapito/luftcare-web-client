<template lang="pug">
  .navbar-wrapper
    brand-logo.logo
    nav-links.links
</template>

<script lang="ts">
import Vue from 'vue';
import BrandLogo from '~/components/atoms/BrandLogo.vue';
import NavLinks from '~/components/organisms/single-instance/navbar/TheNavbarLinks.vue';

export default Vue.extend({
  components: {
    NavLinks,
    BrandLogo,
  },
});
</script>

<style lang="postcss" scoped>
.navbar-wrapper {
  @apply h-16 grid justify-center items-center transition-colors duration-300 bg-white text-gray-900;
  grid-template-areas: "menu logo search";
  grid-template-columns: auto 1fr auto;
  justify-items: center;

  .links   {
    @apply hidden;
    grid-area: links;
  }
  .color {
    @apply hidden;
    grid-area: color;
  }
  .logo {
    @apply h-14;
    grid-area: logo;
  }
  .side-icon {
    @apply w-16 h-full overflow-hidden;
  }
  .menu { grid-area: menu }
  .search { grid-area: search }
}

@screen md {
  .navbar-wrapper {
    @apply h-auto;
    grid-template-areas: "color logo search"
                         "links links links";
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;

    .logo { @apply px-3 h-16 }
    .menu { @apply hidden }
    .color { @apply flex }
    .links { @apply flex py-2 }
  }
}

@screen md {
  .navbar-wrapper {
    .logo {
      @apply h-20 py-1;
    }
  }
}

@screen lg {
  .navbar-wrapper {
    .links {
      @apply py-4;
    }
    .side-icon {
      @apply w-20;
    }
  }
}
</style>
