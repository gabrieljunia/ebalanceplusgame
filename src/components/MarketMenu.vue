<script setup lang="ts">
import { useEnergyStore } from '../stores/EnergyStore';
</script>

<template>
        
    <section id="menu" v-if="energyStore.clickedMarketIcon">
        <div class="menu-header" >
            <span class="stored-percentage">
                {{ moneyStore.money }} $
            </span>
            <h2 class="title">
                {{ $t("market.header") }}
            </h2>
            <span class="closebtn" @click="energyStore.clickOnMarketIcon()">&times;</span>
        </div>
        <div class="menu-figures">
            <div class="figure">
                <p class="text">{{ $t("energy.stored") }} :</p>
                <h3 class="text">{{energyStore.storedEnergy}} W</h3>
            </div>
            <!-- TODO: See if  I need this info -->
            <div class="figure">
                <p class="text">{{ $t("energy.max") }} :</p>
                <h3 class="text">{{energyStore.maxEnergy}} W</h3>
            </div>
        </div>
        <div class="menu-buttons">
            <button class="btn">{{ $t("button.purchase") }}</button>
            <button class="btn" @click="energyStore.clickOnSaleMarket()"> {{ $t("button.sale") }}</button>
        </div>


    </section>
</template>

<script lang="ts">
    const energyStore = useEnergyStore();
    const scenarioStore = useScenarioStore();
    const moneyStore = useMoneyStore();
    export default {
        name: "PurchaseSaleMenu",
        methods:{
            getInitialMoney(){
                const clickedScenario = scenarioStore.clickedScenario
                let initialMoney: number = 0;
                if(clickedScenario){
                    initialMoney = clickedScenario.moneyParameters.initialMoney;
                }
                return initialMoney;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../styles/components/energyAndMarketMenu.scss";
</style>