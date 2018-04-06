/* eslint-disable */
<template>
	<v-container fluid>
		<!-- PORTFOLIO -->
		<v-container grid-list-md fluid text-xs-center>
			<!--<v-btn color="info"-->
			       <!--@click="toggleBenchmark(false);"-->
			       <!--type="button">Back to coins overview-->
			<!--</v-btn>-->
			<h1>Portofolio</h1>
			<v-slide-y-transition mode="out-in">
				<v-layout column align-center>
					<v-data-table
							:headers="headersPortfolio"
							:items="portfolio"
							hide-actions
							class="elevation-1">
						<template slot="items" slot-scope="props">
							<td class="text-xs-left">{{ props.item.coin.name }}
							</td>
							<td class="text-xs-left">{{ props.item.coin.market_cap_usd }}
							</td>
							<td class="text-xs-left">{{ props.item.coin.price_usd }}
							</td>
							<td class="text-xs-left">{{ props.item.percentage }}</td>
							<td class="text-xs-left"></td>
						</template>
					</v-data-table>
				</v-layout>
			</v-slide-y-transition>
		</v-container>
	</v-container>
</template>
<script>

	import store from '../store'

	export default {
		data () {
			return {
				headersPortfolio: [
					{text: 'Coin name', align: 'left', sortable: false, value: 'coinName'},
					{text: 'Marketcap', align: 'left', sortable: false, value: 'marketcap'},
					{text: 'Price USD', align: 'left', sortable: false, value: 'priceUsd'},
					{text: 'Percentage Invested', align: 'left', sortable: false, value: 'percentage'},
					{text: 'Total Amount', sortable: false, value: 'percentage'}
				],
				totalInvestment: 100
			}
		},
		computed: {
			portfolio(){
				return this.$store.getters.portfolio;
			}
		},
		watch: {}
	}
</script>
