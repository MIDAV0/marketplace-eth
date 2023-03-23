
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const adminAddresses = {
    "0xec817ea9870db4cec249233767119d27939b179de2864a47cf4de53e4b5fd4d1" : true,

}

export const handler = (web3, provider) => () => {

    const { data, mutate, ...rest } = useSWR(() => 
        web3 ? "web3/accounts" : null,
        async () => {
            const accounts = await web3.eth.getAccounts()
            return accounts[0]
        }
    )

    useEffect(() => {
        provider &&
        provider.on('accountsChanged', 
        accounts => mutate(accounts[0] ?? null))
    }, [provider])

    return { 
            data,
            isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
            mutate,
            ...rest
    }
} 