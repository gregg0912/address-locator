<template>
  <div class="tabs is-centered">
    <ul>
      <li>
        <router-link :to="{ name: 'home' }">Home</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'instructions' }">Instructions</router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "RouterTabs",
  watch: {
    $route(toParams) {
      if (document.querySelectorAll(".tabs li")) {
        document.querySelectorAll(".tabs li").forEach((tab) => {
          tab.classList.remove("is-active");
        });
      }
      const toPath = toParams.path;
      const toLink = document.querySelector(`a[href='${toPath}']`);
      if (toPath && toLink && toLink.closest("li")) {
        toLink.closest("li").classList.add("is-active");
      }
    },
  },
};
</script>
