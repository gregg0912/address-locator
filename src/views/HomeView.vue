<template>
  <div class="home">
    <KeepAlive>
      <AddressForm />
    </KeepAlive>
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
