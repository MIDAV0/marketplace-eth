
import useSWR from "swr"

export const handler = (web3, provider) => () => {
    
    const swrResponse = useSWR(() =>
        web3 ? "web3/network" : null,
        async () => {
            const netId = await web3.eth.net.getId()
            return netId
        }
    )
    
    return {
        network: {
            ...swrResponse
        }
    }
} 