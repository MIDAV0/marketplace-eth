
import Image from 'next/image'
import { useEthPrice, COURSE_PRICE } from "@components/hooks/useEthPrice"
import { Loader } from '@components/ui/common'

export default function EthRates(){
    const { eth } = useEthPrice()

    
    return (
        <div className="flex text-center">
            <div className="p-10 border drop-shadow rounded-md">
                <div className='flex items-center justify-center'>
                    { eth.data ?
                        <>
                            <Image
                                layout="fixed"
                                height={35}
                                width={35}
                                src="/small-eth.webp"
                            />
                            <span className="text-2xl font-bold">
                                = {eth.data}$
                            </span>
                        </>
                        :
                        <div className='w-full flex justify-center'>
                            <Loader />
                        </div>
                    }   
                </div>
                <p className="text-xl text-gray-500">Current eth Price</p>
            </div>
            <div className="p-10 border drop-shadow rounded-md">
                <div className='flex items-center justify-center'>
                { eth.data ?
                    <>
                        <span className="text-2xl font-bold">{eth.coursePrice}</span>
                        <Image
                                layout="fixed"
                                height={35}
                                width={35}
                                src="/small-eth.webp"
                            />
                        <span className="text-2xl font-bold"> = {COURSE_PRICE}$</span>
                    </>
                    :
                    <div className='w-full flex justify-center'>
                        <Loader />
                    </div>
                }
                </div>
                <p className="text-xl text-gray-500">Price per course</p>
            </div>
        </div>
    )
}
