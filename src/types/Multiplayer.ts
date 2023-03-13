export interface ConnectionParameters {
    host: string;
    port: number;
    protocol: string;
    endpoint: string;
    options: {
        username: string;
        password: string;
        clean: boolean;
        connectTimeout: number;
        reconnectPeriod: number;
        clientId: string;
    };
}

export interface Player {
    id: string;
    name: string;
    score: number;
    moneyWon: number;
    isConnected: boolean;
    isHost: boolean;
}

export interface playerGameParameters {
    playerId: string;
    productionCurveId: string;
    scenarioId: string;
}
