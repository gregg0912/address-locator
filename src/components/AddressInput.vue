<template>
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label" for="address">Search address:</label>
    </div>
    <div class="field-body">
      <div class="field">
        <div class="control">
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
    </div>
  </div>
</template>
<script>
export default {
  name: "AddressInput",
  props: {
    datalistOptions: Array,
  },
};
</script>
