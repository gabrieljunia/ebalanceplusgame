<script setup lang="ts">
    import { ProductionCurve } from "../stores/ProductionStore";
    import { ConsumptionCurve } from "../stores/ConsumptionStore";
</script>


<template>
    <div class="slider-container">    
        <div class="inside-slider" v-for="i in 95">
            <div class="display-overlay" v-if="i > getIndexFromHour(times.timeStart) && i < getIndexFromHour(times.timeEnd)" 
                :style="{backgroundColor: drawNewValOverOld(i)}">
            </div>
            <div class="color-index" :style="{ backgroundColor: drawValById(i) }">
            </div>
        </div>
    </div>
</template>



<script lang="ts">

    const consumptionStore = useConsumptionStore();
    const gameParameterStore = useGameParametersStore();

    export default {
        name: "Slider", 
        props: {
            consumptionAmount: {
                type: Number, 
                required: true
            },
            times: {
                type: Object as () => Times, 
                required: true
            }
        },
        data() {
            return {
                indexStart: 0 as number,
                indexEnd: 0 as number,
            }
        },
        components: {
            
        }, 
        mounted() {

        },
        methods: {

            getProductionCurve(productionCurve: ProductionCurve | null){
                let prodListTotal: number[] = []
                if(productionCurve) {
                    if(productionCurve.total.length>0){
                        prodListTotal = productionCurve.total;
                    }
                }
                return prodListTotal;
            },

            compareProductionAndConsumption(){
                const consumptionCurve: ConsumptionCurve = consumptionStore.consumptionCurve;
                const productionCurve: number[] = this.getProductionCurve(gameParameterStore.productionCurve);
                let comparison: number[] = [];
                for(let i=0; i<productionCurve.length; i++) {
                    let existingConsumption = consumptionCurve.consumption.get(i);
                    if(existingConsumption){
                        comparison.push(productionCurve[i] - existingConsumption);
                    }
                    else {
                        comparison.push(0);
                    }
                }
                return comparison;
            }, 

            getDisplay(){
                const productionCurve: number[] = this.getProductionCurve(gameParameterStore.productionCurve);
                const comparison: number[] = this.compareProductionAndConsumption();
                let display: number[] = []
                for(let i = 0; i<productionCurve.length; i++){
                    if(productionCurve[i] > 0){
                        let tmp:number = 100*comparison[i] / productionCurve[i];
                        display.push(tmp);
                    } else {
                        display.push(-1);
                    }
                }
                return display;
            },

            getDisplayColor(consPercentage: number){
                console.log(consPercentage);
                if(consPercentage === 0 ){
                    return 'green';
                } else if(consPercentage === -1){
                    return 'black'
                }else if (consPercentage < 0 && consPercentage !== -1) {
                    return 'black';
                }else if(consPercentage < 15){
                    return 'red';
                } else if( consPercentage < 50) {
                    return 'orange';
                } else if(consPercentage < 80) {
                    return 'yellow';
                } else if(consPercentage < 100) {
                    return 'green';
                } else {
                    return 'purple';
                }
            },
            drawValById(index:number){
                let display = this.getDisplay();
                return this.getDisplayColor(display[index]);
            },

            // getIndexFromHour(){
            //     const indexes = consumptionStore.convertTimesToIndexes(this.times.timeStart, this.times.timeEnd);
            //     this.indexStart = indexes.indexStart;
            //     this.indexEnd = indexes.indexEnd;
            //     console.log(indexes);
            // },

            getIndexFromHour(hour: string) {
                if(!consumptionStore.convertTimeToIndex(hour)){       
                    return 0;
                }    
                else{
                    return consumptionStore.convertTimeToIndex(hour);
                }
            },
            addNewConsumptionToInitialConsumption(){
                const initialConsCurve: ConsumptionCurve = consumptionStore.consumptionCurve;
                let partNewCons: number[] = [];
                let startIndex: number = this.getIndexFromHour(this.times.timeStart);
                let endIndex: number = this.getIndexFromHour(this.times.timeEnd);
                for(let i=startIndex; i<endIndex; i++ ){
                    let existingConsumption = initialConsCurve.consumption.get(i);
                    if(existingConsumption){
                        partNewCons.push(existingConsumption + this.consumptionAmount);
                    }
                    else {
                        partNewCons.push(this.consumptionAmount);
                    }
                }
                return partNewCons
            },
            getNewDisplay() {
                const productionCurve: number[] = this.getProductionCurve(gameParameterStore.productionCurve);
                let partDisplay: number[] = []
                const partNewCons = this.addNewConsumptionToInitialConsumption();

                for(let i=this.indexStart; i< this.indexEnd; i++) {
                    if(productionCurve[i] != 0){
                        let tmp:number = 100*(productionCurve[i]- partNewCons[i]) / productionCurve[i];
                        partDisplay.push(tmp);
                        console.log(partDisplay[i])
                    } else {
                        partDisplay.push(-1);
                    }
                }
                return partDisplay;
            },

            drawNewValOverOld(index: number){
                let newDisplay =this.getNewDisplay();
                return this.getDisplayColor(newDisplay[index]);
            }
        },
        watch: {
        }
    };

    interface Times {
        timeStart: string;
        timeEnd: string;
    }
</script>


<style scoped lang="scss">
    @import '../styles/components/slider.scss';
</style>
