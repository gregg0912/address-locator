<template>
  <div class="container">
    <loading :active="isLoading" :is-full-page="fullPage" />
    <DropdownInput
      v-for="(inputDetail, index) in inputDetails"
      :key="index"
      :input-detail="inputDetail"
      @optionChange="handleOptionChange"
    />
    <AddressInput
      v-show="isAddressVisible"
      :datalist-options="datalistOptions"
      @searchTextChanged="handleSearchTextChange"
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
import AddressInput from "./AddressInput.vue";
import DropdownInput from "./DropdownInput.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import axios from "axios";

export default {
  name: "AddressForm",
  components: {
    AddressInput,
    DropdownInput,
    Loading,
  },
  data: function () {
    return {
      inputDetails: [
        {
          name: "province",
          isDisabled: false,
          optionList: [],
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
    };
  },
  created() {
    this.$watch(
      () => this.$route.params,
      () => {
        this.getLocationOptions();
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    );
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
  },
  computed: {
    isVisible: function () {
      return this.selectedBarangay &&
        this.selectedMunicipality &&
        this.selectedProvince
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
          }
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        if (this.inputDetails[inputDetailIndex]) {
          this.inputDetails[inputDetailIndex].optionList = [];
        }
        console.log(error);
        this.isLoading = false;
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
        this.selectedMunicipality &&
        this.selectedBarangay
      ) {
        autocompleteURL.search = new URLSearchParams({
          province: this.selectedProvince,
          municipality: this.selectedMunicipality,
          barangay: this.selectedBarangay,
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
    handleSearchTextChange: function (searchText) {
      this.searchText = searchText;
      this.getDatalistOptions(searchText);
    },
  },
};
</script>
