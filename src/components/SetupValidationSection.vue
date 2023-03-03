<template>
    <section class="validation-section">
        <h2 class="section-title">{{ $t("setup.launchNewGame") }}</h2>
        <p class="description">
            {{ $t("setup.setupExplanation") }}
        </p>
        <div class="btn-container">
            <button
                class="btn random-btn"
                @click="validateRandomGame">
                <Router-Link to="/game">
                    {{ $t("button.random") }}
                </Router-Link>
            </button>
            <button
                class="btn play-btn"
                @click="validateChosenScenarioAndProductionCurve">
                <Router-Link to="/game">
                    {{ $t("button.play") }}
                </Router-Link>
            </button>
        </div>
    </section>
</template>

<style lang="scss">
    @import "../styles/components/setupValidationSection.scss";
</style>

<script lang="ts">
    export default {
        name: 'SetupValidationSection',
        data(){
            return {
                productionStore: useProductionStore(),
                scenarioStore: useScenarioStore(),
                gameParametersStore: useGameParametersStore(),
                energyStore: useEnergyStore(),
                consumptionStore: useConsumptionStore(),
                moneyStore: useMoneyStore(),
            }
        },
        methods:{
            validateRandomGame(){
                this.gameParametersStore.setRandomProductionCurveAndScenario();
                this.initiateGamePage();
            },
            validateChosenScenarioAndProductionCurve(){
                this.gameParametersStore.setProductionCurveAndScenario(this.productionStore.clickedProductionCurve, this.scenarioStore.clickedScenario);
                this.initiateGamePage();
            },
            initiateGamePage(){
                this.consumptionStore.addInitialConsumptionToConsumptionList();
                this.energyStore.getBatteryEquipmentTypes()
                this.moneyStore.setInitialMoneyAndPriceOfEnergy();
                this.gameParametersStore.isGameStarted = true;
            }
        }
    }
</script>
