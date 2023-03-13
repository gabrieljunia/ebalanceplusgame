<script setup lang="ts">
import BaseCanvas from './BaseCanvas.vue';
import { useBoardStore } from '../stores/BoardStore';
import { ProductionCurve } from '../types/Production';
import { BoardVisualParams,Tile } from '../types/Board';
import { convertValuesListToPixelsList } from '../helpers/drawInPixels';
</script>

<template>
    <section id="game-board" class="board">
        <BaseCanvas
            :canvas-id="canvasId"
            :width="canvasWidth"
            :height="canvasHeight"
            @click="canvasClick"
            @mousemove="canvasMouseMove"/>
    </section>
</template>

<style lang="scss">
@import '../styles/components/board.scss';
</style>

<script lang="ts">
    const boardStore = useBoardStore();
    export default {
        name: 'Board',
        props: {
            boardVisualParams: {
                type: Object as () => BoardVisualParams,
                default: () => ({}),
                required: true
            },
            boardWidth: Number,
            boardHeight: Number,
            pxSizeFor15m: Number,
            pxSizeFor10W: Number,
            productionCurveProps: null,
            consumptionTilesList: {
                type: Array as () => Tile[],
                default: () => [],
                required: true
            },
            productionTilesList: {
                type: Array as () => Tile[],
                default: () => [],
                required: true
            },
        },
        components: {
            BaseCanvas
        },
        data() {
            return {
                canvasId: 'canvas',
                canvas: null as CanvasRenderingContext2D | null,
                canvasWidth: 1440,
                canvasHeight: 1500,
                lastPosition: { x: 0, y: 0 } as { x: number, y: number },
                productionCurve: null as ProductionCurve | null,
                tiles: [] as Tile[],
                productionTiles: [] as Tile[]
            };
        },
        mounted() {
            const canvasHTMLElement = document.getElementById(this.canvasId) as HTMLCanvasElement | null;
            if(canvasHTMLElement){
                const ctx = canvasHTMLElement.getContext("2d");    
                this.canvas = ctx;
            }
            this.render();
        },
        methods: {
            canvasClick(event: MouseEvent) {
                const x = event.offsetX;
                const y = event.offsetY;
                const clickedTiles = this.tiles.filter((tile: Tile) => this.isInsideTile(x, y, tile));
                const clickedProductionTiles = this.productionTiles.filter((tile: Tile) => this.isInsideTile(x, y, tile));
                if(clickedTiles.length){
                    boardStore.setClickedTile(clickedTiles[0]);
                } else{
                    boardStore.setClickedTile(null);
                }
                if(clickedProductionTiles.length){
                    boardStore.setClickedProductionTile(clickedProductionTiles[0]);
                } else{
                    boardStore.setClickedProductionTile(null);
                }
            },
            canvasMouseMove(event: MouseEvent) {
                const x = event.offsetX;
                const y = event.offsetY;
                this.lastPosition = { x, y };
            },
            clearCanvas(startX: number, startY: number, endX: number, endY: number) {
                if(this.canvas){
                    this.canvas.clearRect(startX,startY,endX,endY);
                }
            },
            drawTiles(tiles:Tile[]) {
                for(const tile of tiles){
                    this.drawRectangle(tile.x,tile.y,tile.width,tile.height,tile.color)
                }
            },
            drawRectangle(x: number, y: number, width: number, height: number, color:string) {
                if(this.canvas){
                    this.canvas.fillStyle = color;
                    this.canvas.fillRect(x, y, width, height);
                }
            },
            drawProductionCurve(productionCurve: ProductionCurve | null, isCurveSmoothed: boolean, shouldDisplayProductionCurve: boolean) {
                if(productionCurve && shouldDisplayProductionCurve){
                    const pxSize = this.pxSizeFor10W ? this.pxSizeFor10W : 5;
                    if(productionCurve.solar.length>0){
                        this.drawCurve(convertValuesListToPixelsList(productionCurve.solar,pxSize,10), 'yellow', isCurveSmoothed);
                    }
                    if(productionCurve.wind.length>0){
                        this.drawCurve(convertValuesListToPixelsList(productionCurve.wind,pxSize,10), 'green', isCurveSmoothed);
                    }
                    if(productionCurve.hydro.length>0){
                        this.drawCurve(convertValuesListToPixelsList(productionCurve.hydro,pxSize,10), 'blue', isCurveSmoothed);
                    }
                    if(productionCurve.total.length>0){
                        this.drawCurve(convertValuesListToPixelsList(productionCurve.total,pxSize,10), 'black', isCurveSmoothed);
                    }
                }
            },
            drawKWLines(displayKWLines: boolean,is3kWLineRed: boolean) {
                if(displayKWLines){
                    const ySize = (this.pxSizeFor10W ? this.pxSizeFor10W : 5)*100;
                    let y=0;
                    for(let i =0; i<(this.canvasHeight/ySize); i++) {
                        const color = is3kWLineRed && i%3===0 ? 'red' : '#DBEBE7';
                        this.drawLine(0,y,this.canvasWidth,y, color);
                        y=y+ySize;
                    }
                }
            },
            drawHoursLines(displayHoursLines: boolean) {
                if(displayHoursLines) {
                    const xSize = this.pxSizeFor15m ? this.pxSizeFor15m : 15;
                    let x=0;
                    for(let i =0; i<=24; i++) {
                        this.drawLine(x,0,x,this.canvasHeight, '#DBEBE7');
                        x=x+xSize*4;
                    }
                }
            },
            drawCurve(points: number[], color: string, isCurveSmoothed: boolean){
                const xSize = this.pxSizeFor15m ? this.pxSizeFor15m : 15;
                let x=0;
                if(isCurveSmoothed){
                    for(let i =0; i<points.length-1; i++) {
                        this.drawLine(x,this.canvasHeight-points[i],x+xSize,this.canvasHeight-points[i+1], color);
                        x=x+xSize;
                    }
                } else {
                    for(let i =0; i<points.length-1; i++) {
                        this.drawLine(x,this.canvasHeight-points[i],x+xSize,this.canvasHeight-points[i], color);
                        this.drawLine(x+xSize,this.canvasHeight-points[i],x+xSize,this.canvasHeight-points[i+1], color);
                        x=x+xSize;
                    }
                }
                this.drawLine(x,this.canvasHeight-points[points.length-1],x+xSize,this.canvasHeight-points[points.length-1], color);
            },
            drawLine(startX: number, startY: number, endX: number, endY: number, color: string) {
                if(this.canvas){
                    this.canvas.strokeStyle = color;
                    this.canvas.beginPath();
                    this.canvas.moveTo(startX, startY);
                    this.canvas.lineTo(endX, endY);
                    this.canvas.stroke();
                }
            }, 
            isInsideTile(x: number, y: number, tile: Tile) {
                return (x >= tile.x && x <= tile.x + tile.width) && (y >= tile.y && y <= tile.y + tile.height);
            },
            render() {
                this.clearCanvas(0,0,this.canvasWidth,this.canvasHeight);
                this.drawHoursLines(this.boardVisualParams.shouldDisplayHoursLines);
                this.drawKWLines(this.boardVisualParams.shouldDisplayKWLines,this.boardVisualParams.is3kWLineRed);
                this.drawTiles(this.productionTiles);
                this.drawTiles(this.tiles);
                this.drawProductionCurve(this.productionCurve,this.boardVisualParams.isProductionCurveSmoothed, this.boardVisualParams.shouldDisplayProductionCurve);
            }
        },
        watch: {
            boardWidth : {
                handler(newWidth) {
                    this.canvasWidth=newWidth;
                    this.render();
                },
                immediate: true
            },
            boardHeight : {
                handler(newHeight) {
                    this.canvasHeight=newHeight;
                    this.render();
                },
                immediate: true
            },
            productionCurveProps : {
                handler(newProductionCurve) {
                    this.productionCurve=ref(newProductionCurve);
                    this.render();
                },
                immediate: true
            },
            consumptionTilesList : {
                handler(newTiles) {
                    this.tiles=newTiles;
                    this.render();
                },
                immediate: true
            },
            productionTilesList : {
                handler(newTiles) {
                    this.productionTiles=newTiles;
                    this.render();
                },
                immediate: true
            },
        }
    };
</script>
