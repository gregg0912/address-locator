"use strict";

import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";

Vue.use(Vuex);

const state = {
  provinceConfig: {
    name: "province",
    isDisabled: false,
    optionList: [],
  },
  municipalityConfig: {
    name: "municipality",
    isDisabled: true,
    optionList: [],
  },
  barangayConfig: {
    name: "barangay",
    isDisabled: true,
    optionList: [],
  },
  datalistOptions: [],
  previousProvinces: [],
  previousMunicipalities: [],
  previousBarangays: [],
};

const getters = {
  datalistOptions: function (state) {
    return state.datalistOptions;
  },
  provinceConfig: function (state) {
    return state.provinceConfig;
  },
  municipalityConfig: function (state) {
    return state.municipalityConfig;
  },
  barangayConfig: function (state) {
    return state.barangayConfig;
  },
  previousProvinces: function (state) {
    return state.previousProvinces;
  },
  previousMunicipalities: function (state) {
    return state.previousMunicipalities;
  },
  previousBarangays: function (state) {
    return state.previousBarangays;
  },
};

const mutations = {
  SET_PROVINCES(state, config) {
    _.assign(state.provinceConfig, config);
  },

  SET_MUNICIPALITIES(state, config) {
    _.assign(state.municipalityConfig, config);
  },

  SET_BARANGAYS(state, config) {
    _.assign(state.barangayConfig, config);
  },

  SET_DATALIST_OPTIONS(state, newDataList) {
    state.datalistOptions = newDataList;
  },

  SET_PREVIOUS_PROVINCES(state, newResults) {
    state.previousProvinces = newResults;
  },

  SET_PREVIOUS_MUNICIPALITIES(state, newResults) {
    state.previousMunicipalities = _.unionWith(
      state.previousMunicipalities,
      newResults,
      _.isEqual
    );
    console.log(state.previousMunicipalities);
  },

  SET_PREVIOUS_BARANGAYS(state, newResults) {
    state.previousBarangays = _.unionWith(
      state.previousBarangays,
      newResults,
      _.isEqual
    );
    console.log(state.previousMunicipalities);
  },
};

const actions = {
  setConfig: function ({ commit }, payload) {
    // console.log(payload);
    if (payload.configName && payload.config) {
      switch (payload.configName) {
        case "province":
          commit("SET_PROVINCES", payload.config);
          break;
        case "municipality":
          commit("SET_MUNICIPALITIES", payload.config);
          break;
        case "barangay":
          commit("SET_BARANGAYS", payload.config);
          break;
      }
    }
  },

  resetConfig: function ({ dispatch }, payload) {
    if (payload.configName) {
      payload.config = {
        isDisabled: true,
        optionList: [],
      };
      dispatch("setConfig", payload);
    }
  },

  setDataListOptions: function ({ commit }, payload) {
    if (payload.datalistOptions) {
      commit("SET_DATALIST_OPTIONS", payload.datalistOptions);
    }
  },

  setPreviousResults: function ({ commit }, payload) {
    if (payload.configName && payload.newResults) {
      switch (payload.configName) {
        case "province":
          commit("SET_PREVIOUS_PROVINCES", payload.newResults);
          break;
        case "municipality":
          commit("SET_PREVIOUS_MUNICIPALITIES", payload.newResults);
          break;
        case "barangay":
          commit("SET_PREVIOUS_BARANGAYS", payload.newResults);
          break;
      }
    }
  },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
