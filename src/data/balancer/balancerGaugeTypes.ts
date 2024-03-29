export interface UserVoteLocks{
    lockedBalance: number,
    unlockTime: number,
}

export interface GaugeAllocation {
    gaugeAddress: string,
    percentage: number,
    rewardInUSD: number,
    userValuePerVote: number,
    isNew: boolean,
    initialPercentage: number,
    paladinValuePerVote: number,
    paladinRewardInUSD: number,
    paladinLeftVotes: number,
    previousUserPercentage?: number,
}
