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
        v-if="provinceConfig.optionList.length"
        :input-detail="provinceConfig"
        v-model="selectedProvince"
      />
      <DropdownInput
        v-if="provinceConfig.optionList.length"
        :input-detail="municipalityConfig"
        v-model="selectedMunicipality"
      />
      <DropdownInput
        v-if="provinceConfig.optionList.length"
        :input-detail="barangayConfig"
        v-model="selectedBarangay"
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
import { mapGetters } from "vuex";

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
      selectedProvince: null,
      selectedMunicipality: null,
      selectedBarangay: null,
      searchText: null,
      isLoading: false,
      fullPage: true,
      isAddressVisible: false,
      message: "",
      hasError: false,
    };
  },
  watch: {
    selectedProvince: function (value) {
      this.selectedMunicipality = null;
      this.selectedBarangay = null;
      this.$router.push({ name: "home", params: { province: value } });
    },
    selectedMunicipality: function (value) {
      this.selectedBarangay = null;
      if (value) {
        this.$router.push({
          name: "home",
          params: { province: this.selectedProvince, municipality: value },
        });
      }
    },
    searchText: function (value) {
      this.getDatalistOptions(value);
    },
    $route: function (route) {
      this.$store.dispatch("resetConfig", { configName: "barangay" });
      if (route.params && route.params.province && !this.selectedMunicipality) {
        this.$store.dispatch("resetConfig", { configName: "municipality" });
        this.getLocationOptions({
          province: route.params.province,
          municipality: route.params.municipality || "",
          configName: "municipality",
        });
        this.isAddressVisible = false;
      }

      if (route.params && route.params.municipality) {
        this.$store.dispatch("resetConfig", { configName: "barangay" });
        this.getLocationOptions({
          province: route.params.province,
          municipality: route.params.municipality,
          configName: "barangay",
        });
        this.$store.dispatch("setConfig", {
          configName: "municipality",
          config: { isDisabled: false },
        });
        this.isAddressVisible = true;
      }
    },
  },
  computed: {
    ...mapGetters([
      "provinceConfig",
      "municipalityConfig",
      "barangayConfig",
      "datalistOptions",
      "previousProvinces",
      "previousMunicipalities",
      "previousBarangays",
    ]),
    isVisible: function () {
      return this.selectedMunicipality &&
        this.selectedProvince &&
        this.searchText
        ? true
        : false;
    },
    iFrameSrc: function () {
      if (!this.searchText) {
        return "";
      }
      const APIKey = "AIzaSyDBZIXSclXCvGim_n17QvvjVhyxlutoqKA";
      return `https://www.google.com/maps/embed/v1/place?key=${APIKey}&q=${this.searchText}`;
    },
  },
  created: function () {
    this.getLocationOptions({
      province: "",
      municipality: "",
      configName: "province",
    });
  },
  methods: {
    getLocationOptions: async function ({
      province,
      municipality,
      configName,
    }) {
      this.isLoading = true;
      this.message = "";
      this.hasError = false;

      if (
        (configName === "province" && this.previousProvinces.length) ||
        (configName === "municipality" &&
          this.previousMunicipalities.find(
            (municipality) => municipality.provinceName === province
          )) ||
        (configName === "barangay" &&
          this.previousBarangays.find(
            (barangay) =>
              barangay.provinceName === province &&
              barangay.municipalityName === municipality
          ))
      ) {
        this.getValuesFromLocal({ province, municipality, configName });
      } else {
        this.getValuesFromAPI({ province, municipality, configName });
      }
    },
    getValuesFromLocal: async function ({
      province,
      municipality,
      configName,
    }) {
      console.log(`retrieved ${configName} from getValuesFromLocal`);

      let config = {};

      if (configName && configName === "province") {
        config.optionList = this.previousProvinces;
        config.isDisabled = false;
      } else if (
        province &&
        province.trim().length &&
        configName &&
        configName === "municipality"
      ) {
        config.optionList = this.previousMunicipalities.filter(
          (municipality) => municipality.provinceName === province
        );
        config.isDisabled = false;
      } else if (
        province &&
        province.trim().length &&
        municipality &&
        municipality.trim().length &&
        configName &&
        configName === "barangay"
      ) {
        config.optionList = this.previousBarangays.filter(
          (barangay) =>
            barangay.provinceName === province &&
            barangay.municipalityName === municipality
        );
        config.isDisabled = false;
      }

      await this.$store.dispatch("setConfig", { config, configName });
      this.isLoading = false;
    },
    getValuesFromAPI: async function ({ province, municipality, configName }) {
      console.log(`retrieved ${configName} from getValuesFromAPI`);
      let config = {};
      try {
        const placeDetailsURL = new URL(
          "http://localhost:5050/api/getLocations"
        );
        if (province.length || municipality.length) {
          placeDetailsURL.search = new URLSearchParams({
            province,
            municipality,
          });
        }
        const locations = await axios(placeDetailsURL.toString());
        if (
          locations &&
          locations.data &&
          locations.data.data &&
          locations.data.data.response &&
          locations.data.data.response.statusCode != 404
        ) {
          config.optionList = locations.data.data.response;
          config.isDisabled = false;
        } else {
          config.optionList = [];
          config.isDisabled = true;
          this.message =
            locations.data &&
            locations.data.data &&
            locations.data.data.response &&
            locations.data.data.response.message;
          this.hasError = true;
        }
        this.$store.dispatch("setConfig", { config, configName });
        this.$store.dispatch("setPreviousResults", {
          configName,
          newResults: config.optionList.map((option) => {
            return {
              name: option.name,
              ...(province &&
                (configName === "barangay" ||
                  configName === "municipality") && {
                  provinceName: province,
                }),
              ...(province &&
                configName === "barangay" && {
                  municipalityName: municipality,
                }),
            };
          }),
        });
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
        this.message =
          error &&
          error.response &&
          error.response.data &&
          error.response.data.error;
        this.isLoading = false;
        this.hasError = true;
        const config = {
          optionList: [],
        };
        this.$store.dispatch("setConfig", { config, configName });
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
          const datalistOptions = getDatalistOptions.data.map(
            (datalistOption) => datalistOption.address
          );
          this.$store.dispatch("setDataListOptions", { datalistOptions });
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
