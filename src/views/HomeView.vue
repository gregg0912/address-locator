<template>
  <div class="home">
    <AddressForm />
  </div>
</template>

<script>
// @ is an alias to /src
import AddressForm from "@/components/AddressForm.vue";

export default {
  name: "HomeView",
  components: {
    AddressForm,
  },
};
</script>
