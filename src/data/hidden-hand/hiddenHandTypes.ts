export interface HiddenHandIncentives {
    error: boolean
    data: HiddenHandData[]
}

export interface HiddenHandData {
    proposal: string
    proposalHash: string
    title: string
    proposalDeadline: number
    totalValue: number
    voteCount: number
    valuePerVote: number
    bribes: Bribe[]
}

export interface Bribe {
    symbol: string
    token: string
    amount: number
    chainId: number
}
