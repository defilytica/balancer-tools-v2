export interface EnableGaugeInput {
    gauge: string;
    gaugeType: string;
}

export function generateEnableGaugePayload(inputs: EnableGaugeInput[]) {
    const transactions = inputs.map(input => ({
        to: "0x5DbAd78818D4c8958EfF2d5b95b28385A22113Cd",
        value: "0",
        data: null,
        contractMethod: {
            inputs: [
                { name: "gauge", type: "address", internalType: "address" },
                { name: "gaugeType", type: "string", internalType: "string" }
            ],
            name: "addGauge",
            payable: false
        },
        contractInputsValues: {
            gauge: input.gauge,
            gaugeType: input.gaugeType
        }
    }));

    return {
        version: "1.0",
        chainId: "1",
        createdAt: Date.now(),
        meta: {
            name: "Transactions Batch",
            description: "Add new gauges",
            txBuilderVersion: "1.16.3",
            createdFromSafeAddress: "0xc38c5f97B34E175FFd35407fc91a937300E33860",
            createdFromOwnerAddress: "",
            checksum: ""  // This would be a computed checksum, for now left as an empty string.
        },
        transactions
    };
}

export interface KillGaugeInput {
    target: string;
}

export function generateKillGaugePayload(targets: KillGaugeInput[]) {
    const transactions = targets.map(target => ({
        to: "0xf5dECDB1f3d1ee384908Fbe16D2F0348AE43a9eA",
        value: "0",
        data: null,
        contractMethod: {
            inputs: [
                { name: "target", type: "address", internalType: "address" },
                { name: "data", type: "bytes", internalType: "bytes" }
            ],
            name: "performAction",
            payable: true
        },
        contractInputsValues: {
            target: target.target,
            data: "0xab8f0945"
        }
    }));

    return {
        version: "1.0",
        chainId: "1",
        createdAt: Date.now(),
        meta: {
            name: "Transactions Batch",
            description: "Kill obsolete gauges",
            txBuilderVersion: "1.16.3",
            createdFromSafeAddress: "0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f",
            createdFromOwnerAddress: "",
            checksum: ""
        },
        transactions
    };
}

export interface PaymentInput {
    to: string;
    value: number;
    token: 'USDC' | 'BAL';
}

export function generateTokenPaymentPayload(inputs: PaymentInput[]) {
    const transactions = inputs.map(input => {
        const tokenAddress = input.token === 'USDC' ? "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" : "0xba100000625a3754423978a60c9317c58a424e3d";
        const decimals = input.token === 'USDC' ? 6 : 18;
        const value = input.value * (10 ** decimals);

        return {
            to: tokenAddress,
            value: "0",
            data: null,
            contractMethod: {
                inputs: [
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint256", name: "value", type: "uint256" }
                ],
                name: "transfer",
                payable: false
            },
            contractInputsValues: {
                to: input.to,
                value: value.toString()
            }
        };
    });

    return {
        version: "1.0",
        chainId: "1",
        createdAt: Date.now(),
        meta: {
            name: "Transactions Batch",
            description: "Fund grants for Q4 2023",
            txBuilderVersion: "1.13.3",
            createdFromSafeAddress: "0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f",
            createdFromOwnerAddress: "",
            checksum: ""
        },
        transactions
    };
}

export function generateHumanReadableForEnableGauge(inputs: EnableGaugeInput[]): string {
    const gaugesList = inputs.map(input => `gauge(address):${input.gauge}\ngaugeType(string): ${input.gaugeType}`).join("\n");

    return `The Balancer Maxi LM Multisig eth:0xc38c5f97B34E175FFd35407fc91a937300E33860 will interact with the GaugeAdderv4 at 0x5DbAd78818D4c8958EfF2d5b95b28385A22113Cd and call the addGauge function with the following arguments:\n${gaugesList}`;
}

export function generateHumanReadableTokenTransfer(payment: PaymentInput) {
    const tokenAddress = payment.token === 'USDC'
        ? "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        : "0xba100000625a3754423978a60c9317c58a424e3d";
    const decimals = payment.token === 'USDC' ? 6 : 18;
    const value = payment.value * (10 ** decimals);

    return `The Balancer DAO multisig 0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f will interact with ${payment.token} ${tokenAddress} by writing transfer passing the ${payment.to} as recipient and amount as ${payment.value} ${payment.token} ${value}.`;
}


