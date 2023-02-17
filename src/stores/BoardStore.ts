import { defineStore } from 'pinia';
import { Consumption } from '../types/Consumption';
import { Board, Tile, TileParams } from '../types/Board';

export const useBoardStore = defineStore({
    id: 'BoardStore',
    state: () => {
        return {
            board: {
                width: 1440,
                height: 1500,
                tiles: []
            } as Board,
            tileParams: {
                pxSizeFor10W: 5,
                pxSizeFor15min: 15,
            } as TileParams,
            clickedTile: null as Tile | null
        };
    },
    actions: {
        setTilesFromConsumptionList() {
            const tiles: Tile[] = [];
            const occupiedSlotHeightsOnBoardByIndex: number[] = new Array(96).fill(0);
            const consumptionList = useConsumptionStore().getConsumptionListSortedByStartIndex;
            for (const consumption of consumptionList) {
                let consumptionYValuesList: number[] = [];
                let lastCreatedTileIndex = 0;
                let storedYValue = 0;
                let consumptionHeight = (consumption.amount/10) * this.tileParams.pxSizeFor10W;
                for (let i=consumption.startIndex; i<=consumption.endIndex; i++) {
                    occupiedSlotHeightsOnBoardByIndex[i] += consumptionHeight;
                    consumptionYValuesList.push(occupiedSlotHeightsOnBoardByIndex[i]);
                }
                storedYValue = consumptionYValuesList[0];
                for (const yValue of consumptionYValuesList) {
                    if (yValue !== storedYValue) {
                        tiles.push(
                            this.generateTile(
                                consumption,
                                consumption.startIndex+lastCreatedTileIndex,
                                consumption.startIndex+lastCreatedTileIndex+consumptionYValuesList.indexOf(yValue)-1,
                                (this.board.height+consumptionHeight) - storedYValue
                            ));
                        lastCreatedTileIndex = consumptionYValuesList.indexOf(yValue);
                    }
                    storedYValue = yValue;
                }
                if (lastCreatedTileIndex !== consumptionYValuesList.length-1 || consumptionYValuesList.length === 1) {
                    tiles.push(
                        this.generateTile(
                            consumption,
                            consumption.startIndex+lastCreatedTileIndex,
                            consumption.endIndex,
                            (this.board.height+consumptionHeight) - storedYValue
                        ));
                }
            };
            this.board.tiles = tiles;
        },
        TilesFromConsumption(consumptionList: Consumption[]){
            const tiles: Tile[] = [];
            const occupiedSlotHeightsOnBoardByIndex: number[] = new Array(96).fill(0);
            for (const consumption of consumptionList) {
                let consumptionYValuesList: number[] = [];
                let lastCreatedTileIndex = 0;
                let storedYValue = 0;
                let consumptionHeight = (consumption.amount/10) * this.tileParams.pxSizeFor10W;
                for (let i=consumption.startIndex; i<=consumption.endIndex; i++) {
                    occupiedSlotHeightsOnBoardByIndex[i] += consumptionHeight;
                    consumptionYValuesList.push(occupiedSlotHeightsOnBoardByIndex[i]);
                }
                storedYValue = consumptionYValuesList[0];
                for (const yValue of consumptionYValuesList) {
                    if (yValue !== storedYValue) {
                        tiles.push(
                            this.generateTile(
                                consumption,
                                consumption.startIndex+lastCreatedTileIndex,
                                consumption.startIndex+lastCreatedTileIndex+consumptionYValuesList.indexOf(yValue)-1,
                                (this.board.height+consumptionHeight) - storedYValue
                            ));
                        lastCreatedTileIndex = consumptionYValuesList.indexOf(yValue);
                    }
                    storedYValue = yValue;
                }
                if (lastCreatedTileIndex !== consumptionYValuesList.length-1 || consumptionYValuesList.length === 1) {
                    tiles.push(
                        this.generateTile(
                            consumption,
                            consumption.startIndex+lastCreatedTileIndex,
                            consumption.endIndex,
                            (this.board.height+consumptionHeight) - storedYValue
                        ));
                }
            };
            this.board.tiles = tiles;
        },


        generateTile(consumption: Consumption, startIndex: number, endIndex: number, y: number) {
            return {
                id: consumption.id,
                x: startIndex * this.tileParams.pxSizeFor15min,
                y: y - ((consumption.amount/10) * this.tileParams.pxSizeFor10W),
                width: ((endIndex - startIndex)+1) * this.tileParams.pxSizeFor15min,
                height: (consumption.amount/10) * this.tileParams.pxSizeFor10W,
                color: consumption.equipment.type.color,
            } as Tile;
        },
        // TODO : define method to sort tiles (according to size on x-axis ?
        removeTileFromBoard(tileId: string) {
            this.board.tiles = this.board.tiles.filter(tile => tile.id !== tileId);
        },
        setClickedTile(tile: Tile | null) {
            this.clickedTile = tile;
        },
        deleteClickedTileConsumption() {
            if(this.clickedTile) {
                useConsumptionStore().removeFromConsumptionList(this.clickedTile.id);
            }
            this.clickedTile = null;
        },
        modifyClickedTileConsumptionHours(startHour: string, endHour: string) {
            if(this.clickedTile) {
                useConsumptionStore().modifyConsumptionHours(this.clickedTile.id, startHour, endHour);
            }
            this.clickedTile = null;
        }, 
    },
    getters: {
        getProductionCurveInPixels(state) {
            const productionCurve = useGameParametersStore().productionCurve;
            productionCurve.solar = productionCurve.solar.map((element: number) => convertToPx(element, state.tileParams.pxSizeFor10W));
            productionCurve.wind = productionCurve.wind.map((element: number) => convertToPx(element, state.tileParams.pxSizeFor10W));
            productionCurve.hydro = productionCurve.hydro.map((element: number) => convertToPx(element, state.tileParams.pxSizeFor10W));
            productionCurve.total = productionCurve.total.map((element: number) => convertToPx(element, state.tileParams.pxSizeFor10W));
            return productionCurve;
        }
    }
});

function convertToPx(value: number, pxSizeFor10W: number) {
    return (value * pxSizeFor10W) / 10;
}
