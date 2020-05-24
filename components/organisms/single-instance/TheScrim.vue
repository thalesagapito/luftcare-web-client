<template lang="pug">
  transition(name="fade")
    .page-scrim(v-if="isScrimVisible" @click="closeAllDrawers")
</template>

<script lang="ts">
import Vue from 'vue';

type Computed = { isScrimVisible: boolean };
type Methods = { closeAllDrawers: () => void };

export default Vue.extend<{}, Methods, Computed, {}>({
  computed: {
    isScrimVisible() {
      return this.$accessor.layout.isMenuDrawerOpen || this.$accessor.layout.isSearchDrawerOpen;
    },
  },
  methods: {
    closeAllDrawers() {
      this.$accessor.layout.closeMenuDrawer();
      this.$accessor.layout.closeSearchDrawer();
    },
  },
});
</script>

<style lang="postcss" scoped>
.page-scrim {
  @apply fixed w-screen h-screen top-0 left-0 z-0 bg-black bg-opacity-40;
}
</style>
