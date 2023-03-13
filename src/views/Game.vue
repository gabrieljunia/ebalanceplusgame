<script setup lang="ts">
    import Board from '../components/Board.vue';
    import BaseAlert from '../components/BaseAlert.vue';
    import EquipmentList from '../components/EquipmentList.vue';
    import BoardIconsBar from '../components/BoardIconsBar.vue';
    import BoardConsumptionDetails from '../components/BoardConsumptionDetails.vue';
    import BoardConsumptionAddWindow from '../components/BoardConsumptionAddWindow.vue';
    import EnergyMenuAddEnergyWindow from '../components/EnergyMenuAddEnergyWindow.vue';
    import EnergyMenuUseEnergyWindow from '../components/EnergyMenuUseEnergyWindow.vue';
</script>

<template>
    <div class="overlay" v-if="displayOverlay"/>
    <TheGameInfoWindow v-if="gameParametersStore.showedInfoOverlay"/>
    <ResultsMenuConfirmation/>
    <div id="game-page" class="view">
        <BaseAlert
            :should-display="consumptionStore.isOverConsumption"
            alert-class="danger-alert"
            alert-text="alert.overConsumption"/>        
        <BoardConsumptionAddWindow 
            v-if="equipmentStore.clickedEquipment"
            :equipment="equipmentStore.clickedEquipment"/>
        <BoardIconsBar />
        <EnergyMenuAddEnergyWindow v-if="energyStore.clickedStoreEnergy"/>
        <EnergyMenuUseEnergyWindow v-if="energyStore.clickedConsumeEnergy"/>
        <div class="board-list-container">
            <EquipmentList />
            <Board
                :board-visual-params="boardStore.board.boardVisualParams"
                :board-width="boardStore.board.width"
                :board-height="boardStore.board.height"
                :px-size-for15m="boardStore.tileParams.pxSizeFor15min"
                :px-size-for10-w="boardStore.tileParams.pxSizeFor10W"
                :consumption-tiles-list="boardStore.board.consumptionTiles"
                :production-tiles-list="boardStore.board.productionTiles"
                :production-curve-props="gameParametersStore.getProductionCurve"/>
        </div>
        <BoardConsumptionDetails
            :consumption-tile="boardStore.clickedTile"
            :production-tile="boardStore.clickedProductionTile"/>
    </div>
</template>

<script lang="ts">
    export default {
        name: "Game",
        components: {
            BaseAlert,
            Board,
            BoardIconsBar,
            EquipmentList,
            BoardConsumptionDetails,
            BoardConsumptionAddWindow,
            EnergyMenuAddEnergyWindow,
            EnergyMenuUseEnergyWindow
        },
        data() {
            return {
                consumptionStore: useConsumptionStore(),
                boardStore: useBoardStore(),
                gameParametersStore: useGameParametersStore(),
                equipmentStore: useEquipmentStore(),
                energyStore: useEnergyStore(),
                resultsStore: useResultsStore()
            }
        },
        computed: {
            displayOverlay() {
                return this.equipmentStore.clickedEquipment || this.boardStore.isTileClicked || 
                this.energyStore.clickedStoreEnergy || this.gameParametersStore.showedInfoOverlay || 
                this.resultsStore.getIsConfirmationWindowOpen;
            }
        }
    }
</script>
