import { Consumption } from "../types/Consumption";

export function getMaxUsableEnergyAmountPossibleOverPeriod(
    availableEnergyList: number[],
    usedEnergyToRemoveList: number[],
    startIndex: number,
    endIndex: number,
): number {
    let maxUsableEnergyAmountPossible = availableEnergyList[startIndex] + usedEnergyToRemoveList[startIndex];
    let highestEnergyAmount = 0;
    for (let i = startIndex; i <= endIndex; i++) {
        const availableEnergy = availableEnergyList[i] + usedEnergyToRemoveList[i];
        maxUsableEnergyAmountPossible = availableEnergy < maxUsableEnergyAmountPossible ? availableEnergy : maxUsableEnergyAmountPossible;
        highestEnergyAmount = availableEnergy > highestEnergyAmount ? availableEnergy : highestEnergyAmount; 
    }
    const numberOfEnergyPeriods = (endIndex - startIndex) + 1;
    maxUsableEnergyAmountPossible = maxUsableEnergyAmountPossible > (highestEnergyAmount / numberOfEnergyPeriods) ? highestEnergyAmount / numberOfEnergyPeriods : maxUsableEnergyAmountPossible;
    return maxUsableEnergyAmountPossible;
}

export function getMaxUsableEnergyAmountPossibleOverPeriodWithoutConsumption(
    consumption: Consumption,
    availableEnergyList: number[],
    startIndex: number,
    endIndex: number,
): number {
    let indexMultiplier = 1;
    let usedEnergyToRemoveList = new Array(availableEnergyList.length).fill(0);
    for (let i = consumption.startIndex; i < usedEnergyToRemoveList.length; i++) {
        usedEnergyToRemoveList[i] = consumption.amount*indexMultiplier;
        if(i < consumption.endIndex){
            indexMultiplier++;
        }
    }
    return getMaxUsableEnergyAmountPossibleOverPeriod(availableEnergyList, usedEnergyToRemoveList, startIndex, endIndex);
}
