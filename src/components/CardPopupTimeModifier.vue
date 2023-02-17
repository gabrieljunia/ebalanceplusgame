<template>
    <div class="card-time-modifier">
        <div class="hour-container start-hour-container">
            <p>{{ $t("input.start") }}</p>
            <div class="hour-modifier-container" :class="{'input-error' : inputError || inputErrorStart}">
                <button
                    class="btn remove"
                    :class="{'disabled' : startHourMinus}"
                    @click="removeStepAmountFromStartHour">
                    -
                </button>
                <div class="input-container">
                    <input
                        type="time"
                        class="input-start input"
                        step="900"
                        id="startHour"
                        :value="startHour"
                        @input="updateStartHour">
                </div>
                <button
                    class="btn add"
                    :class="{'disabled' : startHourPlus}"
                    @click="addStepAmountToStartHour">
                    +
                </button>
            </div>
        </div>
        <div class="hour-container end-hour-container" v-if="isDurationLengthEditable">
            <p>{{ $t("input.end") }}</p>
            <div class="hour-modifier-container" :class="{'input-error' : inputError || inputErrorEnd}">
                <button
                    class="btn remove"
                    :class="{'disabled' : endHourMinus}"
                    @click="removeStepAmountFromEndHour">
                    -
                </button>
                <div class="input-container">
                    <input
                        type="time"
                        class="input-end input"
                        step="900"
                        id="endHour"
                        :value="endHour"
                        @input="updateEndHour">
                </div>
                <button
                    class="btn add"
                    :class="{'disabled' : endHourPlus}"
                    @click="addStepAmountToEndHour">
                    +
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import '../styles/components/cardPopupTimeModifier.scss';
</style>

<script lang="ts">
    export default {
        name: 'CardPopupTimeModifier',
        props: {
            startHour: {
                type: String,
                required: true
            },
            endHour: {
                type: String,
                required: true
            },
            minDuration: {
                type: String,
                required: true
            },
            maxDuration: {
                type: String,
                required: true
            },
            stepDuration: {
                type: String,
                required: true
            },
            originalDuration: {
                type: String,
                required: true
            },
            isDurationLengthEditable: {
                type: Boolean,
                required: true
            },
            inputError: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                inputErrorStart: false as boolean,
                inputErrorEnd: false as boolean,
                startHourPlus: false as boolean,
                startHourMinus: false as boolean,
                endHourPlus: false as boolean,
                endHourMinus: false as boolean
            }
        },
        methods: {
            updateStartHour(event: Event) {
                const newStartHour = (event.target as HTMLInputElement).value;
                if(newStartHour === '' || newStartHour === null) {
                    this.inputErrorStart = true;
                } else if(!this.isStartHourBeforeEndHour(newStartHour, this.endHour)) {
                    this.inputErrorStart = true;
                } else {
                    this.inputErrorStart = false;
                    this.inputErrorEnd = false;
                    this.$emit('start-hour', newStartHour);
                    this.updateEndHourIfStartHourChangedAndDurationLengthIsNotEditable(newStartHour);
                }
            },
            updateEndHour(event: Event) {
                const newEndHour = (event.target as HTMLInputElement).value;
                if(newEndHour === '' || newEndHour === null) {
                    this.inputErrorEnd = true;
                } else if(!this.isStartHourBeforeEndHour(this.startHour, newEndHour)) {
                    this.inputErrorEnd = true;
                    console.log('end hour is not before start hour');
                } else {
                    this.inputErrorEnd = false;
                    this.inputErrorStart = false;
                    this.$emit('end-hour', newEndHour);
                }
            },
            addStepAmountToStartHour() {
                if(!this.startHourPlus) {
                    const newStartHour = this.addTimeAmountToHour(this.startHour, this.stepDuration);
                    this.$emit('start-hour', newStartHour);
                    this.updateEndHourIfStartHourChangedAndDurationLengthIsNotEditable(newStartHour);
                }
            },
            addStepAmountToEndHour() {
                if(!this.endHourPlus) {
                    const newEndHour = this.addTimeAmountToHour(this.endHour, this.stepDuration);
                    this.$emit('end-hour', newEndHour);
                }
            },
            removeStepAmountFromStartHour() {
                if(!this.startHourMinus) {
                    const newStartHour = this.removeTimeAmountFromHour(this.startHour, this.stepDuration);
                    this.$emit('start-hour', newStartHour);
                    this.updateEndHourIfStartHourChangedAndDurationLengthIsNotEditable(newStartHour);
                }
            },
            removeStepAmountFromEndHour() {
                if(!this.endHourMinus) {
                    const newEndHour = this.removeTimeAmountFromHour(this.endHour, this.stepDuration);
                    this.$emit('end-hour', newEndHour);
                }
            },
            updateEndHourIfStartHourChangedAndDurationLengthIsNotEditable(newStartHour: string) {
                if(!this.isDurationLengthEditable) {
                    const newEndHour = this.addTimeAmountToHour(newStartHour, this.originalDuration);
                    this.$emit('end-hour', newEndHour);
                }
            },
            addTimeAmountToHour(hour: string, timeAmount: string) {
                const hourNumbers = this.getHourAndMinutesNumbersFromHourString(hour);
                const timeAmountNumbers = this.getHourAndMinutesNumbersFromHourString(timeAmount);
                let newHourNumber = hourNumbers.hourNumber + timeAmountNumbers.hourNumber;
                let newMinutesNumber = hourNumbers.minutesNumber + timeAmountNumbers.minutesNumber;
                if(newMinutesNumber >= 60) {
                    newHourNumber += 1;
                    newMinutesNumber -= 60;
                }
                if(newHourNumber >= 24) {
                    newHourNumber = 23;
                    newMinutesNumber = 45;
                }
                return this.getHourStringFromHourAndMinutesNumbers(newHourNumber, newMinutesNumber);
            },
            removeTimeAmountFromHour(hour: string, timeAmount: string) {
                const hourNumbers = this.getHourAndMinutesNumbersFromHourString(hour);
                const timeAmountNumbers = this.getHourAndMinutesNumbersFromHourString(timeAmount);
                let newHourNumber = hourNumbers.hourNumber - timeAmountNumbers.hourNumber;
                let newMinutesNumber = hourNumbers.minutesNumber - timeAmountNumbers.minutesNumber;
                if(newMinutesNumber < 0) {
                    newHourNumber -= 1;
                    newMinutesNumber += 60;
                }
                if(newHourNumber < 0) {
                    newHourNumber = 0;
                }
                return this.getHourStringFromHourAndMinutesNumbers(newHourNumber, newMinutesNumber);
            },
            getHourStringFromHourAndMinutesNumbers(hourNumber: number, minutesNumber: number) {
                let hourString = '';
                let minutesString = '';
                if(hourNumber < 10) {
                    hourString = `0${hourNumber}`;
                } else {
                    hourString = `${hourNumber}`;
                }
                if(minutesNumber < 10) {
                    minutesString = `0${minutesNumber}`;
                } else {
                    minutesString = `${minutesNumber}`;
                }
                return `${hourString}:${minutesString}`;
            },
            getHourAndMinutesNumbersFromHourString(hourString: string) {
                const hourSplit = hourString.split(':');
                const hourNumber = parseInt(hourSplit[0]);
                const minutesNumber = parseInt(hourSplit[1]);
                return {hourNumber, minutesNumber};
            },
            compareTwoHours(hour1: string, hour2: string) {
                const hour1Numbers = this.getHourAndMinutesNumbersFromHourString(hour1);
                const hour2Numbers = this.getHourAndMinutesNumbersFromHourString(hour2);
                if(hour1Numbers.hourNumber < hour2Numbers.hourNumber) {
                    return -1;
                } else if(hour1Numbers.hourNumber > hour2Numbers.hourNumber) {
                    return 1;
                } else {
                    if(hour1Numbers.minutesNumber < hour2Numbers.minutesNumber) {
                        return -1;
                    } else if(hour1Numbers.minutesNumber > hour2Numbers.minutesNumber) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            getStartAndEndHourNumbers() {
                const startHourSplit = this.startHour.split(':');
                const startHourNumber = parseInt(startHourSplit[0]);
                const startMinutesNumber = parseInt(startHourSplit[1]);
                const endHourSplit = this.endHour.split(':');
                const endHourNumber = parseInt(endHourSplit[0]);
                const endMinutesNumber = parseInt(endHourSplit[1]);
                return {startHourNumber, startMinutesNumber, endHourNumber, endMinutesNumber};
            },
            isStartHourBeforeEndHour(startHour: string, endHour: string) {
                if(this.compareTwoHours(this.addTimeAmountToHour(startHour, this.stepDuration), endHour) === -1) {
                    return true;
                } else {
                    return false;
                }
            },
            isDurationOverMaxDuration() {
                const durationNumbers = this.getStartAndEndHourNumbers();
                const maxDurationSplit = this.maxDuration.split(':');
                const maxDurationHourNumber = parseInt(maxDurationSplit[0]);
                const maxDurationMinutesNumber = parseInt(maxDurationSplit[1]);
                if(durationNumbers.endHourNumber - durationNumbers.startHourNumber > maxDurationHourNumber) {
                    return true;
                } else if(durationNumbers.endHourNumber - durationNumbers.startHourNumber === maxDurationHourNumber) {
                    if(durationNumbers.endMinutesNumber - durationNumbers.startMinutesNumber > maxDurationMinutesNumber) {
                        return true;
                    }
                } else {
                    return false;
                }
            },
            isDurationUnderMinDuration() {
                const durationNumbers = this.getStartAndEndHourNumbers();
                const minDurationSplit = this.minDuration.split(':');
                const minDurationHourNumber = parseInt(minDurationSplit[0]);
                const minDurationMinutesNumber = parseInt(minDurationSplit[1]);
                if(durationNumbers.endHourNumber - durationNumbers.startHourNumber < minDurationHourNumber) {
                    return true;
                } else if(durationNumbers.endHourNumber - durationNumbers.startHourNumber === minDurationHourNumber) {
                    if(durationNumbers.endMinutesNumber - durationNumbers.startMinutesNumber < minDurationMinutesNumber) {
                        return true;
                    }
                } else {
                    return false;
                }
            },
            setTimeModificationParams() {
                if(this.isStartHourBeforeEndHour(this.startHour, this.endHour)){
                    this.inputErrorStart = false;
                    this.inputErrorEnd = false;
                    this.setTimeModificationParamsFromMinMaxDuration();
                    if(this.startHour === '00:00' || this.startHour === '0:0') {
                        this.startHourMinus = true;
                    } else{
                        this.startHourMinus = false;
                    }
                    if(this.endHour === '23:45') {
                        this.endHourPlus = true;
                    } else{
                        this.endHourPlus = false;
                    }
                } else {
                    this.startHourPlus = true;
                    this.endHourMinus = true;
                }
                this.setTimeModificationParamsIfDurationLengthIsNotEditable();
            },
            setTimeModificationParamsIfDurationLengthIsNotEditable() {
                if(!this.isDurationLengthEditable){
                    if(this.addTimeAmountToHour(this.startHour, this.addTimeAmountToHour(this.originalDuration,this.stepDuration))==="23:45") {
                        this.startHourPlus = true;
                    } else {
                        this.startHourPlus = false;
                    }
                    if(this.startHour === '00:00') {
                        this.startHourMinus = true;
                    } else{
                        this.startHourMinus = false;
                    }
                }
            },
            setTimeModificationParamsFromMinMaxDuration() {
                if(this.isDurationOverMaxDuration()) {
                    this.startHourPlus = true;
                    this.endHourMinus = true;
                } else {
                    this.startHourPlus = false;
                    this.endHourMinus = false;
                }
                if(this.isDurationUnderMinDuration()) {
                    this.startHourMinus = true;
                    this.endHourPlus = true;
                } else {
                    this.startHourMinus = false;
                    this.endHourPlus = false;
                }
            }
        },
        emits: ['start-hour', 'end-hour'],
        watch: {
            startHour: {
                handler() {
                    this.setTimeModificationParams();
                },
                immediate: true
            },
            endHour: {
                handler() {
                    this.setTimeModificationParams();
                },
                immediate: true
            }
        }
    }
</script>
