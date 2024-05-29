import {BalancerStakingGauges} from "./balancerTypes";
import {useEffect, useState} from "react";
import {Multicall} from "ethereum-multicall";
import {ethers} from "ethers";
import veBALVoteMany from "../../constants/abis/veBALVoteMany.json"
import {veBALVoteAddress} from "../../constants";
import {useAccount} from "wagmi";

const useDecorateGaugesWithVotes = (stakingGaugeData: BalancerStakingGauges[]): BalancerStakingGauges[] => {

    const [decoratedGauges, setDecoratedGauges] = useState<BalancerStakingGauges[]>()
    const [isLoading, setIsLoading] = useState(true)
    const { address } = useAccount();

    const fetchUserVotes = async (gaugeData: BalancerStakingGauges[] | undefined, votingAddress: string): Promise<BalancerStakingGauges[]> => {
        const updatedGaugeData: BalancerStakingGauges[] = [];
        if (gaugeData && gaugeData.length > 0) {
            //get gauge votes from voter contract
            const multicall = new Multicall({
                ethersProvider: new ethers.providers.JsonRpcProvider('https://ethereum-rpc.publicnode.com'),
                tryAggregate: true
            });


            const contractCallContext = gaugeData.map((gauge) => ({
                reference: gauge.address,
                contractAddress: veBALVoteAddress,
                abi: veBALVoteMany,
                calls: [
                    {reference: "voteUserSlope", methodName: 'vote_user_slopes', methodParameters: [votingAddress, gauge.address]},
                ],
            }));


            try {
                const resultsArray = await multicall.call(contractCallContext);
                //console.log("multicaller vote resultsArray", resultsArray);

                gaugeData.forEach((gauge, i) => {
                    const gaugeContext = resultsArray.results[gauge.address];

                    const voteSlopeContext = gaugeContext.callsReturnContext.find(call => call.reference === "voteUserSlope");
                    const slope1 = voteSlopeContext && voteSlopeContext.returnValues[0] ? BigInt(voteSlopeContext.returnValues[0].hex).toString(): '0';
                    const slope2 = voteSlopeContext && voteSlopeContext.returnValues[1] ? BigInt(voteSlopeContext.returnValues[1].hex).toString() : '0';
                    const slope3 = voteSlopeContext && voteSlopeContext.returnValues[2] ? BigInt(voteSlopeContext.returnValues[2].hex).toString() : '0';
                    //console.log("slopes: ", [slope1, slope2, slope3])
                    const updatedGauge = {
                        ...gaugeData[i],
                        userVotingPower: Number(slope1 !== '0' ? parseInt(slope2) / 100 : 0)
                    }
                    updatedGaugeData.push(updatedGauge);

                });

            } catch (error) {
                console.error('Error executing voting multicall:', error);
                return [];
            }

        }
        return updatedGaugeData

    }
    //Fetch and populate gauge supply numbers
    useEffect(() => {
        if (stakingGaugeData && stakingGaugeData.length > 0) {
            setIsLoading(false);
            fetchUserVotes(stakingGaugeData, address ? address.toString() : '')
                .then((decoratedData) => {
                    setDecoratedGauges([...decoratedData]);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching working supply:', error);
                    setIsLoading(false);
                });
            setIsLoading(false);
        }
    }, [isLoading, JSON.stringify(stakingGaugeData), address]);

    if (decoratedGauges !== undefined) {
        return decoratedGauges;
    } else {
        return [];
    }
}
export default useDecorateGaugesWithVotes;
