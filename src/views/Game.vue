<script setup lang="ts">
import BaseAlert from '../components/BaseAlert.vue';
import Board from '../components/Board.vue';
import BoardSnackBar from '../components/BoardSnackBar.vue';
import EquipmentList from '../components/EquipmentList.vue';
import BoardConsumptionAddWindow from '../components/BoardConsumptionAddWindow.vue';
import BoardConsumptionDetailsWindow from '../components/BoardConsumptionDetailsWindow.vue';
import EnergyMenuAddEnergyWindow from '../components/EnergyMenuAddEnergyWindow.vue';
import { useConsumptionStore } from '../stores/ConsumptionStore';
import { useBoardStore } from '../stores/BoardStore';
import { useEquipmentStore } from '../stores/EquipmentStore';
import { useEnergyStore } from '../stores/EnergyStore';
import EnergyMenuUseEnergyWindow from '../components/EnergyMenuUseEnergyWindow.vue';
import MarketMenuSaleWindow from '../components/MarketMenuSaleWindow.vue';
const consumptionStore = useConsumptionStore();
const boardStore = useBoardStore();
const gameParametersStore = useGameParametersStore();
const equipmentStore = useEquipmentStore();
const energyStore = useEnergyStore();
consumptionStore.addInitialConsumptionToConsumptionList();
energyStore.getBatteryEquipmentTypes()
</script>

<template>

    <div class="overlay" v-if="equipmentStore.clickedEquipment || boardStore.clickedTile || energyStore.clickedStoreEnergy || gameParametersStore.showedInfoOverlay"/>
    <TheGameInfoWindow v-if="gameParametersStore.showedInfoOverlay" />
    <div id="game-page" class="view">
        <BaseAlert
            :should-display="consumptionStore.isOverConsumption"
            alert-class="danger-alert"
            alert-text="alert.overConsumption"/>        
        <div class="consuption-window-container">
            <BoardConsumptionAddWindow 
                v-if="equipmentStore.clickedEquipment"
                :equipment="equipmentStore.clickedEquipment"/>
        </div>
        <BoardSnackBar />
        <EnergyMenuAddEnergyWindow v-if="energyStore.clickedStoreEnergy"/>
        <EnergyMenuUseEnergyWindow v-if="energyStore.clickedConsumeEnergy"/>
        <MarketMenuSaleWindow v-if="energyStore.clickedSaleMarket"/>
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
            <BoardConsumptionDetailsWindow 
                v-if="boardStore.clickedTile"
                :consumption="consumptionStore.getConsumptionById(boardStore.clickedTile.id)"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
    //@import "../styles/views/game.scss";
</style>
