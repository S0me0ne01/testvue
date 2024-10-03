import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authToken: null,
    requests: [],
    premises: [],
    filteredPremises: [],
    apartments: [],
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      state.authToken = token;
    },
    SET_REQUESTS(state, requests) {
      state.requests = requests;
    },
    SET_PREMISES(state, premises) {
      state.premises = premises;
      state.filteredPremises = premises;
    },
    SET_FILTERED_PREMISES(state, filteredPremises) {
      state.filteredPremises = filteredPremises;
    },
    SET_APARTMENTS(state, apartments) {
      state.apartments = apartments;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('https://dev.moydomonline.ru/api/auth/login/', credentials);
        commit('SET_AUTH_TOKEN', response.data.key);
        return response.data.key;
      } catch (error) {
        throw new Error('Ошибка входа');
      }
    },
    async fetchRequests({ commit, state }) {
      try {
        const response = await axios.get('https://dev.moydomonline.ru/api/appeals/v1.0/appeals/', {
          headers: { Authorization: `Token ${state.authToken}` },
        });
        commit('SET_REQUESTS', response.data.results);
      } catch (error) {
        console.error('Ошибка выполнения запроса:', error);
      }
    },
    async fetchPremises({ commit, state }) {
      try {
        const response = await axios.get('https://dev.moydomonline.ru/api/geo/v2.0/user-premises/', {
          headers: { Authorization: `Token ${state.authToken}` },
        });
        commit('SET_PREMISES', response.data);
      } catch (error) {
        console.error('Ошибка получения зданий:', error);
      }
    },
    async fetchApartments({ commit, state }, premiseId) {
      try {
        const response = await axios.get(`https://dev.moydomonline.ru/api/geo/v1.0/apartments/?premise_id=${premiseId}`, {
          headers: { Authorization: `Token ${state.authToken}` },
        });
        commit('SET_APARTMENTS', response.data);
      } catch (error) {
        console.error('Ошибка получения квартир:', error);
      }
    },
    async createRequest({ state }, formData) {
      try {
        await axios.post('https://dev.moydomonline.ru/api/appeals/v1.0/appeals/', formData, {
          headers: { Authorization: `Token ${state.authToken}` },
        });
      } catch (error) {
        throw new Error(error.response?.data?.detail || 'Ошибка выполнения');
      }
    },
    async updateRequest({ state }, { id, formData }) {
      try {
        await axios.patch(`https://dev.moydomonline.ru/api/appeals/v1.0/appeals/${id}/`, formData, {
          headers: { Authorization: `Token ${state.authToken}` },
        });
      } catch (error) {
        throw new Error(error.response?.data?.detail || 'Ошибка выполнения');
      }
    },
  },
  getters: {
    premisesList: (state) => state.filteredPremises,
  },
});
