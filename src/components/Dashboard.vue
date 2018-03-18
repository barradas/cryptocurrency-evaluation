/* eslint-disable */
<template>
	<v-container fluid>
		<v-container v-if="!showBenchmark" grid-list-md fluid text-xs-center>
			<v-layout row wrap>
				<v-flex xs10>
					<v-subheader>Search coins</v-subheader>
					<v-text-field
							name="coins search"
							label="Search coins..."
							id="coinsSearch"
							v-model="searchQuery"
					></v-text-field>
				</v-flex>
				<v-flex xs2>
					<v-btn color="info" @click="findCoins()" type="button">Search</v-btn>
				</v-flex>
			</v-layout>
			<v-layout row wrap>
				<v-flex xs4>
					<v-subheader>Filter per Marketcap</v-subheader>
					<v-select
							:items="filtersData.marktCapRange"
							v-model="filterCriteria.marktCapRange"
							label="Select"
							class="input-group--focused"
							item-value="value"
					></v-select>
				</v-flex>
				<v-flex xs4>
					<v-subheader>Filter per Price</v-subheader>
					<v-select
							:items="filtersData.priceRange"
							v-model="filterCriteria.priceRange"
							label="Select"
							class="input-group--focused"
							item-value="value"
					></v-select>
				</v-flex>
				<v-flex xs4>
					<v-subheader>Filter by Available Supply</v-subheader>
					<v-select
							:items="filtersData.supplyRange"
							v-model="filterCriteria.supplyRange"
							label="Select"
							class="input-group--focused"
							item-value="value"
					></v-select>
				</v-flex>
			</v-layout>
		</v-container>
		<v-container v-if="!showBenchmark" grid-list-md fluid text-xs-center>
			<v-slide-y-transition mode="out-in">
				<v-layout column align-center>
					<v-btn color="info" @click="filterCoins()" type="button">Filter</v-btn>
					<v-btn color="info" @click="getCoins()" type="button">Reset</v-btn>
					<v-data-table
							:headers="headers"
							:items="coins"
							hide-actions
							class="elevation-1">
						<template slot="items" slot-scope="props">
							<td>#{{ props.item.rank }}</td>
							<td>{{ props.item.name }}</td>
							<td class="text-xs-right">{{ props.item.market_cap_usd }}</td>
							<td class="text-xs-right">${{ props.item.price_usd }}</td>
							<td class="text-xs-right">{{ props.item['24h_volume_usd'] }}</td>
							<td class="text-xs-right">{{ props.item.available_supply }}</td>
							<td class="text-xs-right">{{ props.item.percent_change_24h }} %</td>
							<td class="text-xs-right">{{ props.item.percent_change_7d }} %</td>
							<td class="text-xs-right">
								<v-btn color="info" @click="analyseCoin(props.item)" type="button">Analyse</v-btn>
							</td>
						</template>
					</v-data-table>
				</v-layout>
			</v-slide-y-transition>
		</v-container>
		<v-container v-if="showBenchmark" grid-list-md fluid text-xs-center>
			<v-btn color="info" @click="toggleBenchmark(false);" type="button">Back to coins overview</v-btn>
			<h1>{{ benchmark.baseComparisonCoin.name }} current price {{ benchmark.baseComparisonCoin.price_usd }}</h1>
			<h2>{{ benchmark.baseComparisonCoin.name }} is ranked - #{{ benchmark.baseComparisonCoin.rank }}</h2>
			<h2>{{ benchmark.baseComparisonCoin.name }} price if it reaches...</h2>
			<v-layout column align-center>
				<v-data-table
						:headers="headersPriceProjections"
						:items="benchmark.priceProjections"
						hide-actions
						class="elevation-1">
					<template slot="items" slot-scope="props">
						<td>{{ props.item.text }}</td>
						<td>{{ props.item.name }}</td>
						<td class="text-xs-right">${{ props.item.price }}</td>
					</template>
				</v-data-table>
			</v-layout>
		</v-container>
	</v-container>
</template>
<script>
	//TODO finish the filters
	//TODO create a screen for price prejections per portfolio so that I can see diffrente scenarios for my portfolio
	//TODO create a way to adjust portfolio asset percentages and adjust and see the portfolio per scenario
	//TODO create tool which will project prices based on an increase in total market cap taking. If the total marketcap increases to a certain amount what will be the prices of the analysed currency
	import store from '../store'

	export default {
		data () {
			return {
				headers: [
					{text: 'Rank', align: 'center', sortable: false, value: 'name'},
					{text: 'Name', align: 'center', sortable: false, value: 'name'},
					{text: 'Market cap (usd)', sortable: false, value: 'marktCapUsd'},
					{text: 'Price (usd)', align: 'center', sortable: false, value: 'priceUsd'},
					{text: 'Volume 24h', sortable: false, value: 'volume24H'},
					{text: 'Available Supply', sortable: false, value: 'supply'},
					{text: 'Change 24h', sortable: false, value: 'change24H'},
					{text: 'Change 7d', sortable: false, value: 'change7D'},
					{text: 'Actions', sortable: false, value: 'actions'}
				],
				headersPriceProjections: [
					{text: 'Scenario', align: 'left', sortable: false, value: 'scenario'},
					{text: 'Name', align: 'left', sortable: false, value: 'name'},
					{text: 'Price (usd) of... ', sortable: false, value: 'priceUsd'},

				],
				filtersData: {
					marktCapRange: [
						{text: 'Select a value', value: null},
						{text: 'less than 100000000', value: 100000000},
						{text: 'less than 300000000', value: 300000000},
						{text: 'less than 500000000', value: 500000000}
					],
					priceRange: [
						{text: 'Select a value', value: null},
						{text: 'less than 1', value: 1},
						{text: 'less than 5', value: 5},
						{text: 'less than 10', value: 10}],
					supplyRange: [
						{text: 'Select a value', value: null},
						{text: 'less than 100000000', value: 100000000},
						{text: 'less than 300000000', value: 300000000},
						{text: 'less than 500000000', value: 500000000}
					]
				},
				filterCriteria: {
					marktCapRange: null,
					priceRange: null,
					supplyRange: null
				},
				benchmark: {
					baseComparisonCoin: null,
					priceProjections: [
						{text: 'Top 1 marketcap', price: null, coinName: null},
						{text: 'Top 2 marketcap', price: null, coinName: null},
						{text: 'Top 3 marketcap', price: null, coinName: null},
						{text: 'Top 5 marketcap', price: null, coinName: null},
						{text: 'Top 10 marketcap', price: null, coinName: null},
						{text: 'Top 20 marketcap', price: null, coinName: null},
						{text: 'Top 30 marketcap', price: null, coinName: null}
					]
				},
				searchQuery: ''

			}
		},
		mounted() {
			this.getCoins();
		},
		methods: {
			getCoins(){
				store.dispatch('getCoins');
			},
			filterCoins(){
				store.dispatch('filterCoins', this.filterCriteria);
			},
			findCoins(){
				store.dispatch('findCoins', this.searchQuery);
			},
			analyseCoin(coin){
				this.benchmark.baseComparisonCoin = coin;

				let top1MarkCap = this.initialCoinsState[0].market_cap_usd;
				let top2MarkCap = this.initialCoinsState[1].market_cap_usd;
				let top3MarkCap = this.initialCoinsState[2].market_cap_usd;
				let top5MarkCap = this.initialCoinsState[4].market_cap_usd;
				let top10MarkCap = this.initialCoinsState[9].market_cap_usd;
				let top20MarkCap = this.initialCoinsState[19].market_cap_usd;
				let top30MarkCap = this.initialCoinsState[29].market_cap_usd;

				this.toggleBenchmark(true);

				this.benchmark.priceProjections[0].price = coin.price_usd * top1MarkCap / coin.market_cap_usd;
				this.benchmark.priceProjections[1].price = coin.price_usd * top2MarkCap / coin.market_cap_usd;
				this.benchmark.priceProjections[2].price = coin.price_usd * top3MarkCap / coin.market_cap_usd;
				this.benchmark.priceProjections[3].price = coin.price_usd * top5MarkCap / coin.market_cap_usd;
				this.benchmark.priceProjections[4].price = coin.price_usd * top10MarkCap / coin.market_cap_usd;
				this.benchmark.priceProjections[5].price = coin.price_usd * top20MarkCap / coin.market_cap_usd;
				this.benchmark.priceProjections[6].price = coin.price_usd * top30MarkCap / coin.market_cap_usd;

				this.benchmark.priceProjections[0].name = this.initialCoinsState[0].name;
				this.benchmark.priceProjections[1].name = this.initialCoinsState[1].name;
				this.benchmark.priceProjections[2].name = this.initialCoinsState[2].name;
				this.benchmark.priceProjections[3].name = this.initialCoinsState[4].name;
				this.benchmark.priceProjections[4].name = this.initialCoinsState[9].name;
				this.benchmark.priceProjections[5].name = this.initialCoinsState[19].name;
				this.benchmark.priceProjections[6].name = this.initialCoinsState[29].name;

			},
			toggleBenchmark(bool){
				store.dispatch('toggleBenchmark', bool);
			}
		},
		computed: {
			coins(){
				return this.$store.getters.coins;
			},
			initialCoinsState(){
				return this.$store.getters.initialCoinsState;
			},
			showBenchmark(){
				return this.$store.state.isBenchmarkVisible;
			}
		},
		watch: {}
	}
</script>
