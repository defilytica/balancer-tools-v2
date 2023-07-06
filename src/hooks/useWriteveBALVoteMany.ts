import {useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {GaugeAllocation} from "../data/balancer/balancerGaugeTypes";


export function useWriteveBALVoteMany(allocations: GaugeAllocation[]) {

    const addresses = Array(8)
        .fill(`0x${"0000000000000000000000000000000000000000"}`)
        .map((_, index) =>
            index < allocations.length
                ? `0x${allocations[index].gaugeAddress.slice(2, 42)}`
                : `0x${"0000000000000000000000000000000000000000"}`
        );

    const weights = Array(8)
        .fill(0)
        .map((_, index) =>
            index < allocations.length ? BigInt(allocations[index].percentage) : BigInt(0)
        );

    const {config} = usePrepareContractWrite({
        address: '0xc128468b7ce63ea702c1f104d55a2566b13d3abd',
        abi: [
            {
                name: 'vote_for_many_gauge_weights',
                type: 'function',
                stateMutability: 'nonpayable',
                inputs: [
                    {internalType: '_gauge_addrs', type: `address[${8}]`},
                    {internalType: '_user_weight', type: `unit256[${8}]`}
                ],
                outputs: [],
            },
        ],
        functionName: 'vote_for_many_gauge_weights',
        // args: [addresses, weights]
    })
    const {data, write} = useContractWrite(config)
    console.log("contractWrite", write)
    console.log("contractWritedata", data)

    const { isLoading } = useWaitForTransaction({
        hash: data?.hash,
    })

    if (!data && isLoading) {
        return undefined
    }
    return write;
}