import Link from 'next/link'
import { useWeb3 } from '@components/providers'
import { Button } from '@components/ui/common'
import { useAccount } from '@components/web3/hooks/useAccount'

export default function Navbar(){
    const { connect, isLoading, isWeb3Loaded, hooks} = useWeb3()
    const { account } = useAccount()


    return (
        <section>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <nav className="relative" aria-label="Global">
                <div className="flex justify-between items-center">
                <div>
                    <Link href="/" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Home</Link>
                    <Link href="/" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Marketplace</Link>
                    <Link href="/" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Blogs</Link>
                </div>
                <div>
                    <Link href="/" className="font-medium mr-8 text-indigo-600 hover:text-indigo-500">Whislist</Link>
                    {
                        isLoading ?
                            <Button
                                disabled={true}
                                onClick={connect} 
                            >
                                Loading...
                            </Button> : 
                            isWeb3Loaded ?
                                account ?
                                    <Button className='cursor-default' hoverable={false}>
                                        {
                                            account.slice(0, 6) + '...' + account.slice(-4)
                                        }
                                    </Button> 
                                    :
                                    <Button
                                        onClick={connect}
                                    >
                                        Connect Wallet
                                    </Button>
                                :
                            <Button
                                onClick={() => window.open('https://metamask.io/', "_blank")}
                            >
                                Install MetaMask
                            </Button>
                    }
                </div>
                </div>
            </nav>
            </div>
        </section>
    )
}