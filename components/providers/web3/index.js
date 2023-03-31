const { createContext, useContext } = require('react');
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { useState, useEffect, useMemo } from 'react';
import { setupHooks } from './hooks/setupHooks';
import { loadContract } from '@utils/loadContract';


const Web3Context = createContext(null);


export default function Web3Provider({ children }){
    const [web3Api, setWeb3Api] = useState(
        {
            provider: null,
            web3: null,
            contract: null,
            isLoading: true,
            hooks: setupHooks({provider: null, web3: null, contract: null}),
        }
    )

    useEffect(() => {
        const loadProvider = async () => {
            const provider = await detectEthereumProvider()
            if (provider) {
                const web3 = new Web3(provider)
                const contract = await loadContract("CourseMarketplace", web3)
                setWeb3Api({
                    provider,
                    web3,
                    contract,
                    isLoading: false,
                    hooks: setupHooks({web3, provider, contract}),
                })
            } else {
                setWeb3Api(api => ({
                    ...api,
                    isLoading: false,
                }))
                console.error('Please install MetaMask!')
            }
        }

        loadProvider()
    }, [])

    const _web3Api = useMemo(() => {
        const { web3, provider } = web3Api
        return {
            ...web3Api,
            requireInstall: !web3Api.isLoading && !web3Api.web3,
            connect: provider ? 
                async () => { 
                    try {
                        await provider.request({ method: 'eth_requestAccounts' })
                    } catch {
                        console.error("Cannot connect")
                        window.location.reload()
                    }
                } :
                () => console.error("Cannot reload")
        }
    }, [web3Api])


    return (
        <Web3Context.Provider value={_web3Api}>
            {children}
        </Web3Context.Provider>
    )
}

export function useWeb3(){
    return useContext(Web3Context)
}

export function useHooks(cb) {
    const { hooks } = useWeb3()
    return cb(hooks)
}