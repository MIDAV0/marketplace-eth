

import { handler as createUseAccount } from "./useAccount";
import { handler as createUseNetwork } from "./useNetwork";
import { handler as createUseOwnedCourses } from "./useOwnCourses";
import { handler as createUseOwnedCourse } from "./useOwnedCourse";
import { handler as createManagedCourses } from "./useManagedCourses";


export const setupHooks = ({web3, provider, contract}) => {
    return {
        useAccount: createUseAccount(web3, provider),
        useNetwork: createUseNetwork(web3),
        useOwnedCourses: createUseOwnedCourses(web3, contract),
        useOwnedCourse: createUseOwnedCourse(web3, contract),
        useManagedCourses: createManagedCourses(web3, contract)
    }
}