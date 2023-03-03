<script setup lang="ts">
    import { generateStringId } from '../helpers/idGenerator';
    import { Consumption } from '../types/Consumption';
    import { Equipment } from '../types/Equipment';
    import CardPopup from './CardPopup.vue';
    
</script>

<template>
    <CardPopup
        :id="energyConsumption.id"
        :equipment="energyConsumption.equipment"
        :type="type"
        :props-amount="energyConsumption.amount"
        :props-max-energy-amount="maxAmount"
        :props-price="price"
        :props-is-initial-add-popup="true"
        :indexes="{start: energyConsumption.startIndex, end: energyConsumption.endIndex}"
        @close-popup="closePopup"
        @save="saveEnergyUse"
        @cancel="closePopup"
        @delete="closePopup"
        @amount-error="amountError"
        @time-error="timeError"/>
</template>
<script lang="ts">
    export default {
        name: 'EnergyMenuUseEnergyWindow',
        components: {
            CardPopup
        },
        data() {
            return {
                moneyStore: useMoneyStore(),
                energyStore: useEnergyStore(),
                productionStore: useProductionStore(),
                price: useMoneyStore().priceOfConsumption,
                maxAmount: 0 as number,
                type: this.$t("market.purchase"),
                energyConsumption: {
                    id: '',
                    startIndex: 0 as number,
                    endIndex: 0 as number,
                    amount: 0 as number,
                    price: 0,
                    equipment: {
                        id: '0',
                        energy_class: '',
                        type: {
                            id: "999", //todo add the create ID 
                            names : [{text: "Achat d'énergie", lang: "fr"}, {text: "energy purchase", lang: "en"}],
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
                            },
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
                    } as Equipment,
                } as Consumption
            }
        },
        methods: {
            closePopup() {
                this.energyStore.clickedMarketBuyEnergy=false;
            },
            saveEnergyUse(save:{startIndex:number, endIndex:number,amount:number,price:number,startHour:string,endHour:string}) {
                // if (this.moneyStore.checkIfMoneyCanBeTakeOff(this.price)){
                //     alert("You don't have enough money to buy this energy");
                // } else {
                    this.energyStore.clickedMarketBuyEnergy = false;
                    this.energyConsumption.startIndex = save.startIndex;
                    this.energyConsumption.endIndex = save.endIndex;
                    this.energyConsumption.amount = save.amount;
                    this.energyConsumption.price = save.price;
                    this.energyStore.consumeEnergy(this.energyConsumption);
                    this.productionStore.addToAddedProductionList(this.energyConsumption);
                    this.getPrice();
                // }
            },
            amountError() {
                alert(this.$t('error.amountErrorHigherThanEnergyStored'));
            },
            timeError() {
                alert(this.$t('error.timeError'));
            }, 
            getPrice() {
                const step: number = this.energyConsumption.equipment.equipmentConsumptionParams.step;
                const amount: number = this.energyConsumption.amount;
                const startIndex: number = this.energyConsumption.startIndex;
                const endIndex: number = this.energyConsumption.endIndex;
                this.moneyStore.getTotalPrice(step, amount, startIndex, endIndex);
            }
        },
        watch: {
        },
        mounted() {
            this.energyConsumption.equipment.id = generateStringId();
            this.energyConsumption.id = generateStringId();
        }
    }
</script>