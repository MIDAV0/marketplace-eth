
import useSWR from "swr"
import { useEffect } from "react"

const NETWORKS = {
    1 : "Ethereum Mainnet",
    61 : "Ethereum Classic Mainnet",
    3 : "Ropsten Testnet",
    4 : "Rinkeby Testnet",
    42: "Kovan Testnet",
    56 : "Binance Smart Chain Mainnet",
    97 : "Binance Smart Chain Testnet", 
    137 : "Polygon Mainnet",
    80001 : "Polygon Mumbai Testnet",
    1337 : "Gaga Testnet",
}

const targetNetwork = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID]

export const handler = (web3, provider) => () => {
    
    const { data, mutate, ...rest } = useSWR(() =>
        web3 ? "web3/network" : null,
        async () => {
            const netId = await web3.eth.getChainId()

            if (!netId) {
                throw new Error("No network found. Refresh the browser.")
            }

            return NETWORKS[netId]
        }
    )


    useEffect(() => {
        const mutator = chainId => mutate(NETWORKS[parseInt(netId, 16)])
        provider?.on('chainChanged', mutator)

        return () => {
            provider?.removeListener("chainChanged", mutator)
        }
    }, [provider])
    
    return {
            data,
            mutate,
            targetNetwork: targetNetwork,
            isSupported: data == targetNetwork,
            ...rest
    }
} 