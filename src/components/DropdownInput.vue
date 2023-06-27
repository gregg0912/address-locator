<template>
  <div class="column">
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label for="" class="label">{{ label }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <div class="select is-fullwidth">
              <select
                :disabled="inputDetail.isDisabled"
                :value="value"
                @input="$emit('input', $event.target.value)"
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
    </div>
  </div>
</template>
<script>
export default {
  name: "DropdownInput",
  props: {
    inputDetail: Object,
    value: String,
  },
  computed: {
    label: function () {
      return (
        this.inputDetail.name.charAt(0).toUpperCase() +
        this.inputDetail.name.slice(1)
      );
    },
  },
  // data: function () {
  //   return {
  //     selectedOption: null,
  //   };
  // },
  // methods: {
  //   handleOptionSelect: function () {
  //     let inputDetailIndex = 0;
  //     if (this.inputDetail.name === "municipality") {
  //       inputDetailIndex = 1;
  //     }
  //     if (this.inputDetail.name === "barangay") {
  //       inputDetailIndex = 2;
  //     }
  //     this.$emit("optionChange", inputDetailIndex, this.selectedOption);
  //   },
  // },
};
</script>
