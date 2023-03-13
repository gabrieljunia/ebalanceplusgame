function getHourAndMinutesNumbersFromHourString(hourString: string) {
    const hourSplit = hourString.split(':');
    const hourNumber = parseInt(hourSplit[0]);
    const minutesNumber = parseInt(hourSplit[1]);
    return {hourNumber, minutesNumber};
}

function getHourStringFromHourAndMinutesNumbers(hourNumber: number, minutesNumber: number) {
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
}

export function compareTwoHours(hour1: string, hour2: string) {
    const hour1Numbers = getHourAndMinutesNumbersFromHourString(hour1);
    const hour2Numbers = getHourAndMinutesNumbersFromHourString(hour2);
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
}

export function removeTimeAmountFromHour(hour: string, timeAmount: string) {
    const hourNumbers = getHourAndMinutesNumbersFromHourString(hour);
    const timeAmountNumbers = getHourAndMinutesNumbersFromHourString(timeAmount);
    let newHourNumber = hourNumbers.hourNumber - timeAmountNumbers.hourNumber;
    let newMinutesNumber = hourNumbers.minutesNumber - timeAmountNumbers.minutesNumber;
    if(newMinutesNumber < 0) {
        newHourNumber -= 1;
        newMinutesNumber += 60;
    }
    if(newHourNumber < 0) {
        newHourNumber = 0;
        newMinutesNumber = 0;
    }
    return getHourStringFromHourAndMinutesNumbers(newHourNumber, newMinutesNumber);
}

export function addTimeAmountToHour(hour: string, timeAmount: string) {
    const hourNumbers = getHourAndMinutesNumbersFromHourString(hour);
    const timeAmountNumbers = getHourAndMinutesNumbersFromHourString(timeAmount);
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
    return getHourStringFromHourAndMinutesNumbers(newHourNumber, newMinutesNumber);
}

function convertTimeToIndex(hour: string): (number) {
    let listHour: string[] = hour.split(":", 2);
    let h:number = Number(listHour[0]);
    let m:number = Number(listHour[1]);
    let index:number = h*4+ m/15;
    return index;
}

function convertIndexToTime(index:number) {
    let h:number = Math.floor(index/4);
    let m:number = (index%4)*15;
    let time:string = h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');
    return time;
}

export function convertIndexesToTimes(indexStart:number, indexEnd:number) {
    let timeStart:string = convertIndexToTime(indexStart);
    let timeEnd:string = convertIndexToTime(indexEnd+1);
    return {timeStart:timeStart, timeEnd:timeEnd};
}

export function convertTimesToIndexes(timeStart:string, timeEnd:string) {
    let indexStart:number = convertTimeToIndex(timeStart);
    let indexEnd:number = convertTimeToIndex(timeEnd)-1;
    return {indexStart:indexStart, indexEnd:indexEnd};
}

export function checkTimeInput(timeStart:string, timeEnd:string) {
    if(timeStart === '' || timeEnd === ''){
        return false;
    }
    let indexStart:number = convertTimeToIndex(timeStart);
    let indexEnd:number = convertTimeToIndex(timeEnd)-1;
    if(indexStart > indexEnd || indexStart < 0 || indexEnd > 95){
        return false;
    }
    return true;
}
