
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

export const handler = (web3, provider) => () => {
    
    const { mutate, ...rest } = useSWR(() =>
        web3 ? "web3/network" : null,
        async () => {
            const netId = await web3.eth.getChainId()
            return NETWORKS[netId]
        }
    )

    useEffect(() => {
        provider &&
        provider.on('chainChanged',
        netId => mutate(NETWORKS[parseInt(netId, 16)]))
    }, [web3])
    
    return {
        network: {
            mutate,
            ...rest
        }
    }
} 