<template lang="pug">
  keep-alive
    transition(name="fade")
      img.brand-logo(src="/logos/luftcare-logo-white.png" alt="Logo da marca luftcare")
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="postcss" scoped>
.brand-logo-wrapper {
  @apply object-contain object-center;
}
</style>
