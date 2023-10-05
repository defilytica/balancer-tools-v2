export interface BalancerPermission {
    Fx: string;
    Contract: string;
    Deployment: string;
    Authorized_Caller_Addresses: string[];
    Authorized_Caller_Names: string[];
}

export interface FetchResponse {
    data: BalancerPermission[];
    error: Error | null;
    isLoading: boolean;
}