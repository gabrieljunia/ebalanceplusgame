<script setup lang="ts">
    import { convertWattsPer15minToWattsPerHour, convertWattsPer15minToKilowattsPerHour, roundNumberToTwoDecimals } from '../helpers/power';
    import { Icon } from '@iconify/vue';
</script>

<template>
    <div class="indicator-container">
        <div class="indicator-name">
            <h4>{{ indicatorName }}</h4>
        </div>
        <div class="indicator-value-container">
            <div class="indicator-value">
                <p>{{ indicatorValueWithUnit }}</p>
            </div>
            <div class="indicator-value-comparison"
                v-if="!isInitialValue && !isInitialValueEqual"
                :style="{'color':getColor}">
                <Icon :icon="getIcon" class="icon"/>
                <p :class="{ 'indicator-value-comparison-higher': isInitialValueHigher, 'indicator-value-comparison-lower': !isInitialValueHigher }">
                    {{ differenceBetweenInitialAndCurrent }}
                </p>
            </div>
            <div class="indicator-unit-switch">
                <div class="indicator-unit-switch-container">
                    <button
                        class="indicator-unit-switch-button start"
                        :class="{ 'indicator-unit-switch-button-active': isUnitWh }"
                        @click="switchUnitToWh">
                        <p>{{ unitWh }}</p>
                    </button>
                    <button
                        class="indicator-unit-switch-button end"
                        :class="{ 'indicator-unit-switch-button-active': !isUnitWh }"
                        @click="switchUnitToKwh">
                        <p>{{ unitKWh }}</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "../styles/components/resultsSituationDisplayIndicatorsIndicator.scss";
</style>

<script lang="ts">
    export default {
        name: "ResultsSituationDisplayIndicatorsIndicator",
        props: {
            indicatorNameI18nKey: {
                type: String,
                required: true,
            },
            indicatorValue: {
                type: Number,
                required: true,
            },
            isInitialValue: {
                type: Boolean,
                required: false,
                default: false,
            },
            initialValue: {
                type: Number,
                required: false,
                default: 0,
            },
            reverseColorIndicators: {
                type: Boolean,
                required: false,
                default: false,
            },
            colorIndicatorHigher: {
                type: String,
                required: false,
                default: "#CC0000",
            },
            colorIndicatorLower: {
                type: String,
                required: false,
                default: "#4AA72F",
            }
        },
        data() {
            return {
                unitWh: "W/h",
                unitKWh: "kW/h",
                isUnitWh: true,
                isInitialValueHigher: false,
                isInitialValueEqual: true,
            };
        },
        computed: {
            indicatorName(): string {
                return this.$t(this.indicatorNameI18nKey);
            },
            indicatorValueWithUnit(): number {
                return this.isUnitWh ? convertWattsPer15minToWattsPerHour(this.indicatorValue) : convertWattsPer15minToKilowattsPerHour(this.indicatorValue);
            },
            initialValueWithUnit(): number {
                return this.isUnitWh ? convertWattsPer15minToWattsPerHour(this.initialValue) : convertWattsPer15minToKilowattsPerHour(this.initialValue);
            },
            differenceBetweenInitialAndCurrent(): number {
                return roundNumberToTwoDecimals(this.isInitialValueHigher ? this.initialValueWithUnit - this.indicatorValueWithUnit : this.indicatorValueWithUnit - this.initialValueWithUnit);
            },
            getIcon(): string {
                return this.isInitialValueHigher ? "mdi:arrow-down" : "mdi:arrow-up";
            },
            getColor(): string {
                if(this.reverseColorIndicators){
                    return this.isInitialValueHigher ? this.colorIndicatorHigher : this.colorIndicatorLower;
                } else {
                    return this.isInitialValueHigher ? this.colorIndicatorLower : this.colorIndicatorHigher;
                }
            },
        },
        methods: {
            switchUnitToWh(): void {
                this.isUnitWh = true;
            },
            switchUnitToKwh(): void {
                this.isUnitWh = false;
            },
            setIsInitialValueHigherOrEqual(): void {
                this.isInitialValueHigher = this.initialValueWithUnit > this.indicatorValueWithUnit;
                this.isInitialValueEqual = this.initialValueWithUnit === this.indicatorValueWithUnit;
            },
        },
        mounted() {
            if(convertWattsPer15minToWattsPerHour(this.indicatorValue) < 10000) {
                this.switchUnitToWh();
            } else {
                this.switchUnitToKwh();
            }
        },
        watch: {
            indicatorValue: {
                handler: function (newValue: boolean) {
                    if (newValue) {
                        this.setIsInitialValueHigherOrEqual();
                    }
                },
                immediate: true,
            },
        },
    }
</script>
