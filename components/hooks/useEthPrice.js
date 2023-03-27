import useSWR from 'swr'

const URL = "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
export const COURSE_PRICE = 15

const fetcher = async url => {
    const response = await fetch(url)
    const json = await response.json()
    return json.market_data.current_price.usd ?? null
}


export const useEthPrice = () => {

    const swrRes = useSWR(
        URL,
        fetcher,
        { refreshInterval: 10000 }
    )

    const perItem = ( swrRes.data && (COURSE_PRICE/Number(swrRes.data)).toFixed(6)) ?? null

    return { eth: {...swrRes, coursePrice: perItem}}
}