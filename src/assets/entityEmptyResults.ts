import { ResultsConfirmationWindowParameters, ResultsPerformanceIndicators } from "../types/Results";

export const emptyResultsConfirmationWindowParameters: ResultsConfirmationWindowParameters = {
    isConfirmationWindowOpen: false,
    isConfirmationButtonDisplayed: true,
    isConfirmationButtonDisabled: false,
    confirmationButtonIcon: "mdi:check"
};

export const emptyResultsPerformanceIndicators: ResultsPerformanceIndicators = { 
    totalConsumption: 0,
    totalProduction: 0,
    totalOverConsumption: 0,
    totalSoldEnergy: 0,
    totalBoughtEnergy: 0,
    totalStoredEnergy: 0,
    totalUsedStoredEnergy: 0,
    selfConsumptionRatio: 0,
    selfProductionRatio: 0
};
