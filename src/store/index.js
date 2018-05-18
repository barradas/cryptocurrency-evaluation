/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import _ from 'lodash';
import coinData from '../nodeCoinDataGetter/coinData.json';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		initialCoinsState: [],
		coins: [],
		portfolio: [],
		isBenchmarkVisible: false,
		isPortfolioVisible: false,
		isCoinListVisible: true,
		isLoggedIn:false
	},
	getters: {
		//coins: state => state.coins,
		initialCoinsState: state => state.initialCoinsState,
		coins: state => {
			return sortParams => {
				let params = _.pickBy(sortParams, _.isNumber);

				return _.filter(state.coins, (coin) => {
					if (_.isEmpty(params)) {
						return state.coins;
					} else {
						return parseInt(coin.market_cap_usd) <= sortParams.marktCapRange && parseInt(coin.available_supply) <= sortParams.supplyRange && _.parseInt(coin.price_usd) <= sortParams.priceRange;
					}
				});
			}
		},
		portfolio: state => {
			return state.portfolio;
		}
	},
	mutations: {
		getCoins (state, objects) {
			state.coins = objects;
			state.initialCoinsState = objects;
		},
		addToPortfolio (state, payload) {
			let coinIndex = _.findIndex(state.portfolio, function(obj) {
				return obj.coin.id === payload.id;
			});
			let coins = _.cloneDeep(state.coins);

			if (coinIndex === -1) {
				state.portfolio.push({coin: payload, percentage: 10});

				coins[_.findIndex(state.coins, ['id', payload.id])].selected = true;
				state.coins = coins;
			}

		},
		removeFromPortfolio(state, payload){
			let coinIndex = _.findIndex(state.portfolio, function(obj) {
				return obj.coin.id === payload.id;
			});

			let coins = _.cloneDeep(state.coins);

			if (coinIndex !== -1) {
				//let coinIndex =
				state.portfolio.splice(coinIndex ,1);
				coins[_.findIndex(state.coins, ['id', payload.id])].selected = false;
				state.coins = coins;
			}
		},
		toggleBenchmark (state, payload) {
			state.isBenchmarkVisible = payload;
			state.isCoinListVisible = !payload;
			state.isPortfolioVisible = !payload;
		},
		togglePortfolio (state, payload) {
			state.isPortfolioVisible = payload;
			state.isBenchmarkVisible = !payload;
			state.isCoinListVisible = !payload;
		},
		toggleCoinList (state, payload) {
			state.isPortfolioVisible = payload;
			state.isBenchmarkVisible = !payload;
			state.isCoinListVisible = !payload;
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
			if (payload.length > 2) {
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
				commit('getCoins', response.data);
			}).catch((responseError) => {
				console.log(responseError);
			});
			commit('getCoins', coinData);
		},
		login({commit}){
			Axios.post('https://auth').then(response => {

			}).catch(responseError => {

			});
		},
		addToPortfolio({commit}, payload){
			commit('addToPortfolio', payload);
		},
		removeFromPortfolio({commit}, payload){
			commit('removeFromPortfolio', payload);
		},
		filterCoins({commit}, payload){
			commit('filterCoins', payload);
		},
		toggleBenchmark({commit}, payload){
			commit('toggleBenchmark', payload);
		},
		togglePortfolio({commit}, payload){
			commit('togglePortfolio', payload);
		},
		toggleCoinList({commit}, payload){
			commit('toggleCoinList', payload);
		},
		findCoins({commit}, payload){
			commit('findCoins', payload);
		}
	}
});

export default store;

