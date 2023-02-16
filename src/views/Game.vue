<script setup lang="ts">
import Alert from '../components/Alert.vue';
import Board from '../components/Board.vue';
import GameBoardSnackBar from '../components/GameBoardSnackBar.vue';
import EquipementList from '../components/EquipementList.vue';
import { useConsumptionStore } from '../stores/ConsumptionStore';
import { useBoardStore } from '../stores/BoardStore';
import { useEquipmentStore } from '../stores/EquipmentStore';
import { useEnergyStore } from '../stores/EnergyStore';
import AddConsumptionWindow from '../components/AddConsumptionWindow.vue';
import BoardConsumptionDetails from '../components/BoardConsumptionDetails.vue';
import EnergyAddEnergyWindow from '../components/EnergyAddEnergyWindow.vue';
import SaleEnergyWindow from '../components/SaleEnergyWindow.vue';
const consumptionStore = useConsumptionStore();
const boardStore = useBoardStore();
const gameParametersStore = useGameParametersStore();
const equipmentStore = useEquipmentStore();
const energyStore = useEnergyStore();
consumptionStore.addInitialConsumptionToConsumptionList();
</script>

<template>
    <div class="overlay" v-if="equipmentStore.clickedEquipment || boardStore.clickedTile || energyStore.clickedStoreEnergy"/>
    <div id="game-page" class="view">
        <Alert
            :should-display="consumptionStore.isOverConsumption"
            alert-class="danger-alert"
            alert-text="alert.overConsumption"/>        
        <div class="consuption-window-container">
            <AddConsumptionWindow 
                v-if="equipmentStore.clickedEquipment"
                :equipment="equipmentStore.clickedEquipment"/>
        </div>
        <GameBoardSnackBar />
        <EnergyAddEnergyWindow v-if="energyStore.clickedStoreEnergy"/>
        <SaleEnergyWindow v-if="energyStore.clickedSaleMarket"/>
        <div class="board-list-container">
            <EquipementList />
            <Board
              :board-width="boardStore.board.width"
              :board-height="boardStore.board.height"
              :px-size-for15m="boardStore.tileParams.pxSizeFor15min"
              :px-size-for10-w="boardStore.tileParams.pxSizeFor10W"
              :tiles-list="boardStore.board.tiles"
              :production-curve-props="gameParametersStore.getProductionCurve"/>
            <BoardConsumptionDetails 
                v-if="boardStore.clickedTile"
                :consumption="consumptionStore.getConsumptionById(boardStore.clickedTile.id)"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "../styles/views/game.scss";
</style>
