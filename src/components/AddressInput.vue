<template>
  <div class="field">
    <div class="control">
      <label class="label" for="address">Search for a specific address:</label>
      <input
        type="text"
        list="address_list"
        id="address"
        class="input"
        @input="$emit('searchTextChanged', $event.target.value)"
      />
      <datalist id="address_list">
        <option v-for="(option, index) in datalistOptions" :key="index">
          {{ option }}
        </option>
      </datalist>
    </div>
  </div>
</template>
<script>
export default {
  name: "AddressInput",
  props: {
    datalistOptions: Array,
  },
  computed: {
    addressOptions: function () {
      return this.datalistOptions.map((option) => {
        return `Hello ${option}`;
      });
    },
  },
};
</script>
