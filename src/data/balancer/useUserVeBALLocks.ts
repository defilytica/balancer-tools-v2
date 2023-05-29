import {useAccount} from "wagmi";
import {useGetUserVotesLazyQuery} from "../../apollo/generated/graphql-codegen-generated";
import {useEffect} from "react";
import {UserVoteLocks} from "./balancerGaugeTypes";
import {gaugeClient} from "../../apollo/client";

export function useUserVeBALLocks() : UserVoteLocks | null{
    //if we have a user address connected, we fetch the veBAL balance and additional parameters
    const { address, isConnected } = useAccount();

    console.log("address string", address)

    const [getUserData, { data }] = useGetUserVotesLazyQuery({client: gaugeClient})

    useEffect(() => {
        if (isConnected && address) {
            getUserData({
                variables: {
                    userId: address.toLowerCase()
                }
            });
        }
    }, [isConnected, address]);

    if (!data) {
        return null;
    }


    let { user } = data;

    if (user && user.votingLocks){
        return {
            lockedBalance: Number(user.votingLocks[0].lockedBalance),
            unlockTime: Number(user.votingLocks[0].unlockTime)
        }
    }

    return null;

}