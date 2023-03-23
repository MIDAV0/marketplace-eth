
import { BaseLayout } from "@components/ui/layout"
import { CourseCard, List } from "@components/ui/course"
import { getAllCourses } from "@content/courses/fetcher"
import { EthRates, WalletBar } from "@components/ui/web3"
import { useAccount, useNetwork } from "@components/hooks/web3"
import { Button } from "@components/ui/common"
import { OrderModal } from "@components/ui/order"
import { useState } from "react"
import { useEthPrice } from "@components/hooks/useEthPrice"

export default function Marketplace({ courses }) {
    const [selectedCourse, setSelectedCourse] = useState(null)
    const { account } = useAccount()
    const { network } = useNetwork()
    const { eth } = useEthPrice()
  
    return (
          <>
            <div className="py-4">
                <WalletBar 
                    address={account.data}
                    network={{
                      data: network.data,
                      target: network.targetNetwork,
                      isSupported: network.isSupported
                    }}
                    /> 
                    <EthRates ethPrice={eth.data} coursePrice={eth.coursePrice}/>
            </div>


            <List 
              courses={courses}
            >
            {(course) => <CourseCard 
              key={course.id} 
              course={course} 
              Footer={() => 
                <div className="mt-4">
                  <Button 
                    variant="lightBlue"
                    onClick={() => setSelectedCourse(course)}
                    >
                    Purchase
                  </Button>
                </div>
              }
                />}
            </List>
            { selectedCourse &&
              <OrderModal 
                course={selectedCourse} 
                onClose={() => setSelectedCourse(null)}
                />
            }
          </>
    )
}

export function getStaticProps(){
  const { data } = getAllCourses()

  return {
    props: {
      courses: data
    }
  }
}

Marketplace.Layout = BaseLayout