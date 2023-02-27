<script setup lang="ts">
import { useMoneyStore } from '../stores/MoneyStore';
import { Equipment } from '../types/Equipment';
import CardPopup from './CardPopup.vue';
import { generateStringId } from '../helpers/idGenerator';

</script>

<template>
    <div class="sale-popup-container">
        <CardPopup
        :id="consumptionId"
        :type="type"
        :props-amount="amount"
        :props-max-energy-amount="maxAmount"
        :props-price="getPrice()"
        :equipment="equipment"
        :indexes="{start:startIndex,end:endIndex}"
        :props-is-initial-add-popup="true"
        @close-popup="closePopup"
        @save="saveConsumption"
        @cancel="closePopup"
        @delete="closePopup"
        @amount-error="amountError"
        @time-error="timeError"/>
    </div>

</template>

<script lang="ts">
    export default {
        id:"MarketSaleWindow",
        components: {
            CardPopup
        },
        data() {
            return {
                moneyStore: useMoneyStore(),
                energyStore: useEnergyStore(),
                scenarioStore: useScenarioStore(),
                consumptionStore: useConsumptionStore(),
                consumptionId: '',
                type: this.$t("market.saleConsumption"),
                startIndex: 0 as number,
                endIndex: 0 as number,
                maxAmount: 5000 as number,
                amount: 0 as number,
                price: 0,
                equipment: {
                    id: "",
                    energy_class: '',
                    type: {
                        id: "999", //todo add the create ID 
                        names : [{name: "vente d'énergie", lang: "fr"}, {name: "energy sale", lang: "en"}],
                        icon_name: "mdi:cash-usd",
                        color: "#233536",
                        isBattery: false,
                        isCharging: false,
                        equipmentTypeDurationParams: {
                            isDurationEditable: true,
                            isDurationLengthEditable: true,
                            originalDuration: "00:15",
                            step: "00:15",
                            minDuration: "0:15",
                            maxDuration: "23:45"
                        }
                    },
                    equipmentCostParams: {
                        originalPrice: 0,
                        hasCost: true,
                        isCostEditable: false,
                        step: 0,
                        minCost: 0,
                        maxCost: 0
                    },
                    equipmentConsumptionParams: {
                        originalConsumption: 0,
                        isConsumptionEditable: true,
                        step: 10,
                        minConsumption: 0,
                        maxConsumption: 5000
                    }
                } as Equipment
            }
        },
        methods: {
            closePopup() {
                this.energyStore.clickOnMarketSaleEnergy();
            },
            saveConsumption(save:{startIndex:number, endIndex:number,amount:number,price:number,startHour:string,endHour:string}) {
                this.consumptionStore.addConsumption(save.startIndex, save.endIndex, this.equipment, save.amount, save.price);
                this.energyStore.clickOnMarketSaleEnergy();
                this.addMoney()
            },
            amountError() {
                alert(this.$t('error.amountErrorHigherThanEnergyStorageCapacity'));
            },
            timeError() {
                alert(this.$t('error.timeError'));
            },

            addMoney() {
                this.moneyStore.addMoney(this.getPrice())
            },

            getPrice() {
                this.price = this.moneyStore.getPriceInsideIndexes(this.startIndex, this.endIndex, this.amount, this.equipment.equipmentConsumptionParams.step );
                return this.price;
            }
        },
        mounted() {
            this.equipment.id = generateStringId();
            this.consumptionId = generateStringId();
        }
    }

</script>

<style lang="scss">

</style>