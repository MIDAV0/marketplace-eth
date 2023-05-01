
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const adminAddresses = {
    "0xec817ea9870db4cec249233767119d27939b179de2864a47cf4de53e4b5fd4d1" : true,
    "0xf38236c1551ef1ddd351359acba73b6267894b88865b8cf2503270d1a958afef" : true,

}

export const handler = (web3, provider) => () => {

    const { data, mutate, ...rest } = useSWR(() => 
        web3 ? "web3/accounts" : null,
        async () => {
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]

            if (!account) {
                throw new Error("No account found. Refresh the browser.")
            }
            return account
        }
    )

    
    useEffect(() => {
        const mutator = accounts => mutate(accounts[0] ?? null)
        provider?.on('accountsChanged', mutator)

        return () => {
            provider?.removeListener("accountsChanged", mutator)
        }
    }, [provider])

    return { 
            data,
            isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
            mutate,
            ...rest
    }
} 