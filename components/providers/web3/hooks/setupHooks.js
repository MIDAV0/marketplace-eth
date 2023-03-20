

import { handler as createUseAccount } from "./useAccount";

export const setupHooks = web3 => {
    return {
        useAccount: useAccount(web3)
    }
}