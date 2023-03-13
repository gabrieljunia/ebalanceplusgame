export interface ResultsConfirmationWindowParameters {
    isConfirmationWindowOpen: boolean;
    isConfirmationButtonDisplayed: boolean;
    isConfirmationButtonDisabled: boolean;
    confirmationButtonIcon: string;
}

export interface ResultsPerformanceIndicators {
    totalConsumption: number;
    totalProduction: number;
    totalOverConsumption: number;
    totalSoldEnergy: number;
    totalBoughtEnergy: number;
    totalStoredEnergy: number;
    totalUsedStoredEnergy: number;
    selfConsumptionRatio: number;
    selfProductionRatio: number;
}
