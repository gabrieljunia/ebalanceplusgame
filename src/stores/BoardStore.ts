import { defineStore } from 'pinia';
import { emptyTile } from '../assets/entityEmptyTile';
import { Consumption } from '../types/Consumption';
import { Board, BoardVisualParams, Tile, TileParams } from '../types/Board';
import { convertValueToPixels, convertValuesListToPixelsList } from '../helpers/drawInPixels';

export const useBoardStore = defineStore({
    id: 'BoardStore',
    state: () => {
        return {
            board: {
                width: 1440,
                height: 1500,
                boardVisualParams: {
                    isProductionCurveSmoothed: true,
                    shouldDisplayProductionCurve: true,
                    shouldDisplayConsumptionCurve: false,
                    shouldDisplayKWLines: true,
                    shouldDisplayHoursLines: true,
                    is3kWLineRed: true,
                } as BoardVisualParams,
                consumptionTiles: [],
                productionTiles: []
            } as Board,
            tileParams: {
                pxSizeFor10W: 5,
                pxSizeFor15min: 15,
            } as TileParams,
            clickedTile: emptyTile as Tile,
            clickedProductionTile: emptyTile as Tile,
            isTileClicked: false,
        };
    },
    actions: {
        setTilesFromProductionList() {
            const productionCurve: number[] = useGameParametersStore().getProductionCurveTotal;
            const addedProductionList = useProductionStore().getAddedProductionListSortedByStartIndex;
            this.board.productionTiles = this.generate15MinTilesFromList(addedProductionList, productionCurve);
        },
        setTilesFromConsumptionList() {
            const consumptionList = useConsumptionStore().getConsumptionListSortedByStartIndex;
            this.board.consumptionTiles = this.generateTilesFromList(consumptionList, null);
        },
        TilesFromConsumption(consumptionList: Consumption[]){
            this.board.consumptionTiles = this.generateTilesFromList(consumptionList, null);
        },
        generate15MinTilesFromList(listOfConsumptions: Consumption[], productionCurve: number[] | null) {
            const occupiedSlotHeightsOnBoardByIndex: number[] = this.getOccupiedSlotHeightsOnBoardByIndex(productionCurve);
            const tiles: Tile[] = [];
            for(const consumption of listOfConsumptions){
                for(let i=consumption.startIndex; i<=consumption.endIndex; i++){
                    let consumptionHeight = convertValueToPixels(consumption.amount, this.tileParams.pxSizeFor10W, 10);
                    occupiedSlotHeightsOnBoardByIndex[i] += consumptionHeight;
                    tiles.push(this.generateTile(consumption, i, i, (this.board.height+consumptionHeight)-occupiedSlotHeightsOnBoardByIndex[i]));
                }
            }
            return tiles;
        },
        generateTilesFromList(listOfConsumptions: Consumption[], productionCurve: number[] | null) {
            const occupiedSlotHeightsOnBoardByIndex: number[] = this.getOccupiedSlotHeightsOnBoardByIndex(productionCurve);
            const tiles: Tile[] = [];
            for (const consumption of listOfConsumptions) {
                let consumptionYValuesList: number[] = [];
                let lastCreatedTileIndex = 0;
                let storedYValue = 0;
                let consumptionHeight = convertValueToPixels(consumption.amount, this.tileParams.pxSizeFor10W, 10);
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
            return tiles;
        },
        getOccupiedSlotHeightsOnBoardByIndex(productionCurve: number[] | null) {
            if(productionCurve) {
                const occupiedSlotHeightsOnBoardByIndex: number[] = new Array(96).fill(0);
                for (let i=0; i<96; i++) {
                    occupiedSlotHeightsOnBoardByIndex[i] += convertValueToPixels(productionCurve[i], this.tileParams.pxSizeFor10W, 10);
                }
                return occupiedSlotHeightsOnBoardByIndex;
            } else {
                return new Array(96).fill(0);
            }
        },
        generateTile(consumption: Consumption, startIndex: number, endIndex: number, y: number) {
            const height = convertValueToPixels(consumption.amount, this.tileParams.pxSizeFor10W, 10);
            return {
                id: consumption.id,
                x: convertValueToPixels(startIndex, this.tileParams.pxSizeFor15min, 1),
                y: y - height,
                width: convertValueToPixels(endIndex - startIndex + 1, this.tileParams.pxSizeFor15min, 1),
                height: height,
                color: consumption.equipment.type.color,
            } as Tile;
        },
        removeTileFromBoard(tileId: string) {
            this.board.consumptionTiles = this.board.consumptionTiles.filter(tile => tile.id !== tileId);
        },
        setClickedTile(tile: Tile | null) {
            if(tile){
                this.clickedTile = tile;
            } else {
                this.clickedTile = emptyTile;
            }
            this.setIsTileClicked();
        },
        setClickedProductionTile(tile: Tile | null) {
            if(tile){
                this.clickedProductionTile = tile;
            } else {
                this.clickedProductionTile = emptyTile;
            }
            this.setIsTileClicked();
        },
        deleteClickedTileConsumption() {
            if(this.clickedTile) {
                useConsumptionStore().removeFromConsumptionList(this.clickedTile.id);
            }
            this.setClickedTileToEmpty();
        },
        deleteClickedProductionTileConsumption() {
            if(this.clickedProductionTile) {
                useProductionStore().removeFromAddedProductionList(this.clickedProductionTile.id);
            }
            this.setClickedProductionTileToEmpty();
        },
        modifyClickedTileConsumptionHours(startHour: string, endHour: string) {
            if(this.clickedTile) {
                useConsumptionStore().modifyConsumptionHours(this.clickedTile.id, startHour, endHour);
            }
            this.setClickedTileToEmpty();
        },
        modifyClickedProductionTile(startHour: string, endHour:string, amount: number) {
            if(this.clickedProductionTile) {
                useProductionStore().modifyAddedProduction(this.clickedProductionTile.id, startHour, endHour, amount);
            }
            this.setClickedProductionTileToEmpty();
        },
        setClickedTileToEmpty() {
            this.clickedTile = emptyTile;
            this.setIsTileClicked();
        },
        setClickedProductionTileToEmpty() {
            this.clickedProductionTile = emptyTile;
            this.setIsTileClicked();
        },
        setIsTileClicked(){
            if (this.clickedTile.id !== emptyTile.id || this.clickedProductionTile.id !== emptyTile.id) {
                this.isTileClicked = true;
            } else {
                this.isTileClicked = false;
            }
        }
    },
    getters: {
        getProductionCurveInPixels(state) {
            const productionCurve = useGameParametersStore().productionCurve;
            productionCurve.solar = convertValuesListToPixelsList(productionCurve.solar, state.tileParams.pxSizeFor10W, 10);
            productionCurve.wind = convertValuesListToPixelsList(productionCurve.wind, state.tileParams.pxSizeFor10W, 10);
            productionCurve.hydro = convertValuesListToPixelsList(productionCurve.hydro, state.tileParams.pxSizeFor10W, 10);
            productionCurve.total = convertValuesListToPixelsList(productionCurve.total, state.tileParams.pxSizeFor10W, 10);
            return productionCurve;
        }
    }
});
