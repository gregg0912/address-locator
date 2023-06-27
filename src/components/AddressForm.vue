<template>
  <div class="container">
    <NotificationMessage
      :message="message"
      v-show="hasError"
      @closeNotif="hasError = false"
    />
    <loading :active="isLoading" :is-full-page="fullPage" />
    <div class="columns">
      <DropdownInput
        v-for="(inputDetail, index) in inputDetails"
        :key="index"
        :input-detail="inputDetail"
        @optionChange="handleOptionChange"
      />
    </div>
    <AddressInput
      v-show="isAddressVisible"
      :datalist-options="datalistOptions"
      v-model="searchText"
    />
    <iframe
      v-show="isVisible"
      width="600"
      height="450"
      style="border: 0"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      :src="iFrameSrc"
    >
    </iframe>
  </div>
</template>
<script>
import "vue-loading-overlay/dist/vue-loading.css";
import axios from "axios";

import AddressInput from "./AddressInput.vue";
import DropdownInput from "./DropdownInput.vue";
import Loading from "vue-loading-overlay";
import NotificationMessage from "./NotificationMessage.vue";

export default {
  name: "AddressForm",
  components: {
    AddressInput,
    DropdownInput,
    Loading,
    NotificationMessage,
  },
  data: function () {
    return {
      inputDetails: [
        {
          name: "province",
          isDisabled: false,
          optionList: this.getLocationOptions(),
        },
        {
          name: "municipality",
          isDisabled: true,
          optionList: [],
        },
        {
          name: "barangay",
          isDisabled: true,
          optionList: [],
        },
      ],
      selectedProvince: null,
      selectedMunicipality: null,
      selectedBarangay: null,
      searchText: null,
      isLoading: false,
      fullPage: true,
      isAddressVisible: false,
      datalistOptions: [],
      message: "",
      hasError: false,
    };
  },
  watch: {
    selectedProvince: function (value) {
      this.inputDetails[1].isDisabled = true;
      this.inputDetails[1].optionList = [];
      this.inputDetails[2].isDisabled = true;
      this.inputDetails[2].optionList = [];
      this.selectedMunicipality = null;
      this.selectedBarangay = null;
      this.getLocationOptions(value, "", 1);
      this.inputDetails[1].isDisabled = false;
      this.isAddressVisible = false;
    },
    selectedMunicipality: function (value) {
      this.inputDetails[2].isDisabled = true;
      this.inputDetails[2].optionList = [];
      this.selectedBarangay = null;
      this.inputDetails[1].isDisabled = false;
      if (value) {
        this.getLocationOptions(this.selectedProvince, value, 2);
        this.inputDetails[2].isDisabled = false;
        this.isAddressVisible = true;
      }
    },
    searchText: function (value) {
      this.getDatalistOptions(value);
    },
  },
  computed: {
    isVisible: function () {
      return this.selectedMunicipality &&
        this.selectedProvince &&
        this.searchText
        ? true
        : false;
    },
    iFrameSrc: function () {
      const APIKey = "AIzaSyDBZIXSclXCvGim_n17QvvjVhyxlutoqKA";
      if (!this.searchText) {
        return "";
      }
      return `https://www.google.com/maps/embed/v1/place?key=${APIKey}&q=${this.searchText}`;
    },
  },
  methods: {
    getLocationOptions: async function (
      province = "",
      municipality = "",
      inputDetailIndex = 0
    ) {
      this.isLoading = true;
      this.message = "";
      this.hasError = false;
      try {
        const placeDetailsURL = new URL(
          "http://localhost:5000/api/getLocations"
        );
        if (province.length || municipality.length) {
          placeDetailsURL.search = new URLSearchParams({
            province: province,
            municipality: municipality,
          });
        }
        const getLocations = await axios(placeDetailsURL.toString());
        if (this.inputDetails[inputDetailIndex]) {
          if (
            getLocations &&
            getLocations.data &&
            getLocations.data.data &&
            getLocations.data.data.response &&
            getLocations.data.data.response.statusCode != 404
          ) {
            this.inputDetails[inputDetailIndex].optionList =
              getLocations.data.data.response;
          } else {
            this.inputDetails[inputDetailIndex].optionList = [];
            this.inputDetails[inputDetailIndex].isDisabled = true;
            this.message = getLocations.data.data.response.message;
            this.hasError = true;
          }
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        if (this.inputDetails[inputDetailIndex]) {
          this.inputDetails[inputDetailIndex].optionList = [];
        }
        console.log(error);
        this.message = error.message;
        this.isLoading = false;
        this.hasError = true;
      }
    },
    handleOptionChange: function (inputDetailIndex, selectedOption) {
      if (inputDetailIndex === 0) {
        this.selectedProvince = selectedOption;
      }
      if (inputDetailIndex === 1) {
        this.selectedMunicipality = selectedOption;
      }

      if (inputDetailIndex === 2) {
        this.selectedBarangay = selectedOption;
      }
    },
    getDatalistOptions: async function () {
      this.isLoading = true;
      const autocompleteURL = new URL("http://localhost:3000/autocomplete");

      if (
        this.searchText &&
        this.selectedProvince &&
        this.selectedMunicipality
      ) {
        let barangayOption = "";
        if (!this.selectedBarangay) {
          barangayOption = this.selectedBarangay;
        }
        autocompleteURL.search = new URLSearchParams({
          province: this.selectedProvince,
          municipality: this.selectedMunicipality,
          barangay: barangayOption,
          searchText: this.searchText,
        });
      }

      try {
        const getDatalistOptions = await axios(autocompleteURL.toString());
        if (
          getDatalistOptions &&
          getDatalistOptions.data &&
          !getDatalistOptions.data.message
        ) {
          this.datalistOptions = getDatalistOptions.data.map(
            (datalistOption) => datalistOption.address
          );
        }
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    },
  },
};
</script>
