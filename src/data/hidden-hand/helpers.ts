import {BalancerStakingGauges} from "../balancer/balancerTypes";
import {HiddenHandIncentives} from "./hiddenHandTypes";
import {PaladinQuest} from "../paladin/paladinTypes";

export function decorateGaugesWithIncentives(balancerGauges: BalancerStakingGauges[], votingIncentives: HiddenHandIncentives, paladinQuests: PaladinQuest[]): BalancerStakingGauges[] {
    return balancerGauges.map((gauge) => {
        const matchingIncentive = votingIncentives.data.find((incentive) => incentive.proposal.toLowerCase() === gauge.address.toLowerCase());
        const matchingPaladin = paladinQuests.find((incentive) => incentive.gauge.toLowerCase() === gauge.address.toLowerCase());
        if (matchingIncentive && matchingPaladin) {
            return {
                ...gauge,
                voteCount: matchingIncentive.voteCount,
                valuePerVote: (matchingIncentive.valuePerVote + Number(matchingPaladin.rewardPerVote)),
                totalRewards: matchingIncentive.totalValue + Number(matchingPaladin.TotalRewardAmount),
            };

        } else if (matchingPaladin) {
            return {
                ...gauge,
                valuePerVote: Number(matchingPaladin.rewardPerVote),
                totalRewards: Number(matchingPaladin.TotalRewardAmount),
            };
        } else if (matchingIncentive) {
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
