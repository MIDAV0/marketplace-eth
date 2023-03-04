
import { Hero, Breadcrumbs } from "@components/common"
import { EthRates, WalletBar } from "@components/web3"
import { Card } from "@components/order"
import { List } from "@components/course"
import { BaseLayout } from "@components/layout"

export default function Home() {
  return (
        <>
          <Hero />
          <Breadcrumbs />
          <WalletBar />
          <EthRates />
          <Card />
          <List />
        </>
  )
}

Home.Layout = BaseLayout