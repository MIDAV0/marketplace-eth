
export default function EthRates({ethPrice, coursePrice}){
    return (
        <div className="grid grid-cols-4 mb-5">
            <div className="flex flex-1 items-stretch text-center">
            <div className="p-10 border drop-shadow rounded-md">
                <div>
                <span className="text-2xl font-bold">ETH = {ethPrice}$</span>
                </div>
                <p className="text-xl text-gray-500">Current eth Price</p>
            </div>
            </div>
            <div className="flex flex-1 items-stretch text-center">
            <div className="p-10 border drop-shadow rounded-md">
                <div>
                <span className="text-2xl font-bold">{coursePrice} = 15$</span>
                </div>
                <p className="text-xl text-gray-500">Price per course</p>
            </div>
            </div>
        </div>
    )
}
