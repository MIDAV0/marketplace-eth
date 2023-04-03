import { ActiveLink } from '@components/ui/common'
import { useWeb3 } from '@components/providers'
import { Button } from '@components/ui/common'
import { useAccount } from '@components/hooks/web3'
import { useRouter } from 'next/router'

export default function Navbar(){
    const { connect, isLoading, requireInstall } = useWeb3()
    const { account } = useAccount()

 
    return (
        <section>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <nav className="relative" aria-label="Global">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <ActiveLink href="/" >
                        <span className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                            Home
                        </span>
                    </ActiveLink>
                    <ActiveLink href="/marketplace">
                        <span className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                            Marketplace
                        </span>
                    </ActiveLink>
                    <ActiveLink href="/blogs">
                        <span className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                            Blogs
                        </span>
                    </ActiveLink>
                </div>
                <div>
                    <ActiveLink href="/whishlists">
                        <span className="font-medium mr-8 text-indigo-600 hover:text-indigo-500">
                            Whishlist
                        </span>
                    </ActiveLink>
                    {
                        isLoading ?
                            <Button
                                disabled={true}
                                onClick={connect} 
                            >
                                Loading...
                            </Button> : 
                                account.data ?
                                    <Button className='cursor-default' hoverable={false}>
                                        {
                                            account.data.slice(0, 6) + '...' + account.data.slice(-4)
                                        }
                                    </Button> 
                                    :
                                    !requireInstall ?
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