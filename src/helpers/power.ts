export function roundNumberToTwoDecimals(amount: number): number {
    return Math.round(amount * 100) / 100;
}

function convertWattsToKilowatts(watts: number): number {
    if(watts === 0) {
        return 0;
    }
    return watts / 1000;
}

export function calculateMaxPowerPer15min(maxPower: number, indexes:{indexStart:number,indexEnd:number}): number {
    return maxPower / ((indexes.indexEnd - indexes.indexStart)+1);
}

export function calculateTotalWattsPer15min(wattsPer15min: number, indexes:{indexStart:number,indexEnd:number}): number {
    return wattsPer15min * ((indexes.indexEnd - indexes.indexStart)+1);
}

export function convertWattsPer15minToWattsPerHour(watts: number): number {
    if(watts === 0) {
        return 0;
    }
    return roundNumberToTwoDecimals(watts / 4);
}

export function convertWattsPer15minToKilowattsPerHour(watts: number): number {
    if(watts === 0) {
        return 0;
    }
    return roundNumberToTwoDecimals(convertWattsToKilowatts(watts) / 4);
}

export function getTotalKilowattsPerHour(wattsPer15min: number, indexes:{indexStart:number,indexEnd:number}): number {
    return convertWattsPer15minToKilowattsPerHour(calculateTotalWattsPer15min(wattsPer15min, indexes));
}
