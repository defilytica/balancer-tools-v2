export interface PaladinQuestResponse {
    ecosystem: string;
    quests: Quests;
    gauges: Gauge[];
    rewardTokens: RewardToken[];
    votes: Votes;
    periodBias: string;
    lockersProposals: LockerProposal[];
}

export interface Quests {
    active: Quest[];
    upcoming: any[]; // Adjust type if more details are provided
}

export interface Quest {
    id: number;
    questID: number;
    board: string;
    chainId: number;
    gauge: string;
    rewardToken: string;
    duration: number;
    start: number;
    permissions: number;
    closeScenario: number;
    rpw: string;
    minRPV: string;
    maxRPV: string;
    minObjective: string;
    maxObjective: string;
    permissionsList?: string[];
}

export interface Gauge {
    protocol: string;
    address: string;
    name: string;
    chain: number;
    killed: boolean;
}

export interface RewardToken {
    address: string;
    minAmt: string;
    chainId: number;
}

export interface Votes {
    [gauge: string]: Vote[];
}

export interface Vote {
    user: string;
    gauge: string;
    time: number;
    weight: number;
    slope: string;
    endTs: number;
    bias: string;
}

export interface LockerProposal {
    path: string;
    ens: string;
    id: string;
    start: number;
    end: number;
    totalScore: string;
    votes: {
        [choice: string]: ProposalVote[];
    };
}

export interface ProposalVote {
    choice: string;
    voter: string;
    created: number;
    weight: number;
    bias: string;
    vlBias: string;
    vp: string;
}
