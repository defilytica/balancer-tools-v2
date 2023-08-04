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
