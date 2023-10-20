export interface MethodVariable {
    name: string;
    type: string;
}

export interface Method {
    methodName: string;
    methodDescription: string;
    methodVariables: MethodVariable[];
}

export interface BalancerContract {
    id: string;
    title: string;
    description: string;
    readMethods: Method[];
    writeMethods: Method[];
}

export interface BalancerSmartContractData {
    contracts: BalancerContract[];
}
