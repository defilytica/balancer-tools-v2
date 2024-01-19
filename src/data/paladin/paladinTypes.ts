export interface PaladinQuest {
    id: number
    type: number
    creator: string
    rewardToken: string
    gauge: string
    duration: number
    questStart: number
    TotalRewardAmount: string
    rewardAmountPerPeriod: string
    rewardPerVote: string
    objectiveVotes: string
    rewardAmountDistributed: string
    withdrawableAmount: string
    periodStart: number
    currentState: number
    blacklist?: string[]
}

export interface PaladinQuestsV2 {
    id: number;
    boardId: number;
    board: string;
    gauge: string;
    rewardToken: string;
    duration: number;
    start: number;
    permissions: Permissions;
    closeScenario: CloseScenario;
    rpw: string;
    minRPV: string;
    maxRPV: string;
    minObjective: string;
    maxObjective: string;
    permissionsList: string[];
}

export enum Permissions {
    Normal,
    Blacklist,
    Whitelist,
}

export enum CloseScenario {
    Withdraw,
    Rollover,
    Distribute,
}
