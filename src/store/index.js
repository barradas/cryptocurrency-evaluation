/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import _ from 'lodash';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		initialCoinsState:[],
		coins: [],
		isBenchmarkVisible: false
	},
	getters: {
		coins: state => state.coins,
		initialCoinsState: state => state.initialCoinsState
	},
	mutations: {
		getCoins (state, objects) {
			state.coins = objects;
			state.initialCoinsState = objects;
		},
		toggleBenchmark (state, payload) {
			state.isBenchmarkVisible = payload;
		},
		filterCoins(state, payload){
			let filteredData = [];

			_.forEach(state.coins, coin => {
				if (coin['market_cap_usd'] <= payload.marktCapRange &&
					coin['price_usd'] <= payload.priceRange &&
					coin['available_supply'] <= payload.supplyRange) {
					filteredData.push(coin);
				}
			});
			state.coins = filteredData;
		},
		findCoins (state, payload) {
			let matchedCoins = [];
			if (payload.length > 0) {
				payload = _.lowerCase(payload);
				_.forEach(state.initialCoinsState, coin => {
					if (_.lowerCase(coin.name).indexOf(payload) !== -1) {

						matchedCoins.push(coin);
					}
				});
				state.coins = matchedCoins;
			}

		},
	},
	actions: {
		getCoins({commit}){
			Axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=500').then((response) => {
				commit('getCoins',response.data);
			}).catch((responseError) => {
				console.log(responseError);
			});
		},
		filterCoins({commit}, payload){
			commit('filterCoins', payload);
		},
		toggleBenchmark({commit}, payload){
			commit('toggleBenchmark', payload);
		},
		findCoins({commit}, payload){
			commit('findCoins', payload);
		}
	}
});

export default store;

