import Link from 'next/link'

export default function Navbar(){
    return (
        <section>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <nav className="relative" aria-label="Global">
                <div className="flex justify-between">
                <div>
                    <Link href="/" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Home</Link>
                    <Link href="/" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Marketplace</Link>
                    <Link href="/" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Blogs</Link>
                </div>
                <div>
                    <Link href="/" className="font-medium mr-8 text-indigo-600 hover:text-indigo-500">Whislist</Link>
                    <a href="#" className="rounded-lg px-8 py-3 borded text-base font-medium mr-8 text-white bg-indigo-600 hover:bg-indigo-700">Connect Wallet</a>
                </div>
                </div>
            </nav>
            </div>
        </section>
    )
}