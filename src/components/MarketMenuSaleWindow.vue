<script setup lang="ts">
    import { useEnergyStore } from '../stores/EnergyStore';
    import { useConsumptionStore } from '../stores/ConsumptionStore';
    import { useMoneyStore } from '../stores/MoneyStore';
    import { Equipment } from '../types/Equipment';
    import CardPopup from './CardPopup.vue';
    import { generateStringId } from '../helpers/idGenerator';
</script>


<template>
    <CardPopup
        :id="consumptionId"
        :type="type"
        :props-amount="amount"
        :props-max-energy-amount="maxAmount"
        :props-price="moneyStore.price"
        :equipment="equipment"
        :indexes="{start:startIndex,end:endIndex}"
        :props-is-initial-add-popup="true"
        @close-popup="closePopup"
        @save="saveConsumption"
        @cancel="closePopup"
        @delete="closePopup"
        @amount-error="amountError"
        @time-error="timeError"
        />
</template>


<script lang="ts">

    export default {
        name: 'MarketMenuSaleWindow',
        components: {
            CardPopup
        },
        data() {
            return {
                moneyStore: useMoneyStore(),
                energyStore: useEnergyStore(),
                consumptionStore: useConsumptionStore(),
                scenarioStore: useScenarioStore(),
                consumptionId: '',
                type: this.$t("market.saleConsumption"),
                inputError: false as boolean,
                startHour: '00:00' as string,
                endHour: '00:15' as string,
                startIndex: 0 as number,
                endIndex: 0 as number,
                maxAmount: 10000 as number,
                amount: 0 as number,
                price: 0,
                equipment: {
                    id: '0',
                    energy_class: '',
                    type:{
                        id:'energySale',
                        names:[
                            {lang:'fr',name:"vendre de l'énergie"},
                            {lang:'en',name:'energy sold'}
                        ],
                        icon_name:'mdi:home-currency-usd',
                        color: '#002552',
                        isBattery: false,
                        equipmentTypeDurationParams:{
                            isDurationEditable: true,
                            isDurationLengthEditable: true,
                            originalDuration: "00:15",
                            step: "00:15",
                            minDuration: "00:15",
                            maxDuration: "23:45"
                        }
                    },
                    equipmentCostParams:{
                        originalPrice: 0,
                        hasCost: false,
                        isCostEditable: false,
                        step: 0,
                        minCost: 0,
                        maxCost: 100000
                    },
                    equipmentConsumptionParams:{
                        originalConsumption: 0,
                        isConsumptionEditable: true,
                        step: 50,
                        minConsumption: 0,
                        maxConsumption: 10000
                    },
                } as Equipment,
                indexes: {} as Object,
            }
        },
        methods: {
            closePopup() {
                this.energyStore.clickOnSaleMarket();
            },
            saveConsumption(save:{startIndex:number, endIndex:number,amount:number,price:number,startHour:string,endHour:string}) {
                this.consumptionStore.addConsumption(this.startIndex, this.endIndex, this.equipment, this.amount, this.price);
                this.energyStore.clickOnSaleMarket();
            },
            addMoney() {
                const newPrice: number = this.getPrice();
                this.moneyStore.addMoney(newPrice);
            }, 
            getPrice() {
                this.price = this.moneyStore.getTotalPrice(this.equipment.equipmentConsumptionParams.step, this.amount,this.startIndex, this.endIndex);
                return this.price
            },
            amountError() {
                alert(this.$t('error.amountErrorHigherThanEnergyStorageCapacity'));
            },
            timeError() {
                alert(this.$t('error.timeError'));
            }
        },
        computed : {
            getInitialMonet() {
                this.moneyStore.getInitialMoney;
            }
        },
        mounted() {
            this.equipment.id = generateStringId();
            this.consumptionId = generateStringId();
        }
    }
</script>
