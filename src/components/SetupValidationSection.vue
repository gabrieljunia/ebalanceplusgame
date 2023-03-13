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
                {{ $t("button.random") }}
            </button>
            <button
                class="btn play-btn"
                @click="validateChosenScenarioAndProductionCurve">
                {{ $t("button.play") }}
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
                resultsStore: useResultsStore(),
                multiplayerStore: useMultiplayerStore()
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
                this.moneyStore.setInitialMoney();
                this.gameParametersStore.isGameStarted = true;
                this.resultsStore.setInitialSituationPerformanceIndicators();
                this.sendGameParametersToMultiplayerStore();
                this.sendUserToGamePage();
            },
            sendUserToGamePage(){
                this.$router.push('/game');
            },
            sendGameParametersToMultiplayerStore(){
                if(this.gameParametersStore.isMultiplayer){
                    this.multiplayerStore.setUserGameParameters(this.gameParametersStore.productionCurve.id, this.gameParametersStore.scenario.id);
                }
            }
        }
    }
</script>
