<template>
  <div class="tabs is-centered">
    <ul>
      <li :class="{ 'is-active': homeIsActive }">
        <router-link :to="{ name: 'home' }">Home</router-link>
      </li>
      <li :class="{ 'is-active': instructionsIsActive }">
        <router-link :to="{ name: 'instructions' }">Instructions</router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "RouterTabs",
  data: function () {
    return {
      homeIsActive: false,
      instructionsIsActive: false,
    };
  },
  watch: {
    $route: function (toParams) {
      this.homeIsActive = toParams.name && toParams.name === "home";
      this.instructionsIsActive =
        toParams.name && toParams.name === "instructions";
    },
  },
  created: function () {
    this.homeIsActive =
      this.$route.params &&
      this.$route.params.name &&
      this.$route.params.name === "home";
    this.instructionsIsActive =
      this.$route.params &&
      this.$route.params.name &&
      this.$route.params.name === "instructions";
  },
};
</script>
