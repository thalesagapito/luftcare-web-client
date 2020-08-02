<template lang="pug">
  .auth-wrapper
    .content
      .inner-container
        img.logo(src="/logos/luftcare-logo-black.png")
        nuxt
    .image
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="postcss" scoped>
.auth-wrapper {
  @apply flex flex-grow;
  .content {
    @apply flex flex-col items-center justify-center w-full bg-white px-10;

    .inner-container {
      @apply max-w-sm w-full py-6;
      .logo {
        @apply w-32 mb-9 self-start;
      }

      & >>> .title {
        @apply text-gray-900 font-bold text-xl mb-4;
      }
    }

  }
  .image {
    @apply hidden;
  }
}

@screen md {
  .auth-wrapper {
    .content {
      @apply max-w-md;
    }
    .image {
      @apply flex flex-1;
      background-image: linear-gradient(to top right, #5C6AC4 0%, #3AAFA2 140%);
    }
  }
}

@screen lg {
  .auth-wrapper {
    .content {
      @apply max-w-lg;
    }
  }
}
</style>
