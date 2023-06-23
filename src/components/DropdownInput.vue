<template>
  <div class="column">
    <div class="field">
      <div class="control">
        <label for="" class="label">Select a {{ label }}</label>
        <div class="select is-fullwidth">
          <select
            :disabled="inputDetail.isDisabled"
            v-on:change="handleOptionSelect"
            v-model="selectedOption"
          >
            <option
              v-for="option in inputDetail.optionList"
              :key="option.id"
              :value="option.name"
            >
              {{ option.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DropdownInput",
  props: {
    inputDetail: Object,
  },
  computed: {
    label: function () {
      return (
        this.inputDetail.name.charAt(0).toUpperCase() +
        this.inputDetail.name.slice(1)
      );
    },
  },
  data: function () {
    return {
      selectedOption: null,
    };
  },
  methods: {
    handleOptionSelect: function () {
      let inputDetailIndex = 0;
      if (this.inputDetail.name === "municipality") {
        inputDetailIndex = 1;
      }
      if (this.inputDetail.name === "barangay") {
        inputDetailIndex = 2;
      }
      this.$emit("optionChange", inputDetailIndex, this.selectedOption);
    },
  },
};
</script>
