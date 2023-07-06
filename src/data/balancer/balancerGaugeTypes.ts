export interface UserVoteLocks{
    lockedBalance: number,
    unlockTime: number,
}

export interface GaugeAllocation {
    gaugeAddress: string,
    percentage: number,
    rewardInUSD: number,
    isNew: boolean,
}