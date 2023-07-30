import {BalancerStakingGauges} from "../balancer/balancerTypes";
import {HiddenHandIncentives} from "./hiddenHandTypes";
import {PaladinQuest} from "../paladin/paladinTypes";

export function decorateGaugesWithIncentives(balancerGauges: BalancerStakingGauges[], votingIncentives: HiddenHandIncentives): BalancerStakingGauges[] {
    return balancerGauges.map((gauge) => {
        const matchingIncentive = votingIncentives.data.find((incentive) => incentive.proposal.toLowerCase() === gauge.address.toLowerCase());
        if (matchingIncentive) {
            return {
                ...gauge,
                voteCount: matchingIncentive.voteCount,
                valuePerVote: matchingIncentive.valuePerVote,
                totalRewards: matchingIncentive.totalValue,
            };
    } else {
            return gauge;
        }
    });
}

export function decorateGaugesWithPaladinQuests(balancerGauges: BalancerStakingGauges[], questData: PaladinQuest[]): BalancerStakingGauges[] {
    return balancerGauges.map((gauge) => {
        const quest = questData.find((incentive) => incentive.gauge.toLowerCase() === gauge.address.toLowerCase());
        if (quest) {
            return {
                ...gauge,
                paladinRewards: {
                    valuePerVote: Number(quest.rewardPerVote),
                    totalRewards: Number(quest.rewardAmountPerPeriod),
                    leftVotes: (Number(quest.objectiveVotes) / 1e18 - gauge.voteCount) > 0 ? (Number(quest.objectiveVotes) / 1e18 - gauge.voteCount) : 0,
                    isQuestComplete: gauge.voteCount < Number(quest.objectiveVotes) / 1e18,

                },
            };
        } else {
            return gauge;
        }
    });
}
