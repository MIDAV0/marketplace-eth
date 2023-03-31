
import { BaseLayout } from "@components/ui/layout"
import { CourseCard, List } from "@components/ui/course"
import { getAllCourses } from "@content/courses/fetcher"
import { useWalletInfo } from "@components/hooks/web3"
import { Button } from "@components/ui/common"
import { OrderModal } from "@components/ui/order"
import { useState } from "react"
import { MarketHeader } from "@components/ui/marketplace"
import { useWeb3 } from "@components/providers"

export default function Marketplace({ courses }) {
    const { web3, contract } = useWeb3()
    const [selectedCourse, setSelectedCourse] = useState(null)
    const {canPurchaseCourse, account} = useWalletInfo()

    const purchaseCourse = async order => {
      const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id)

      const orderHash = web3.utils.soliditySha3(
        { type: "bytes16", value: hexCourseId },
        { type: "address", value: account.data },
      )

      const emailHash = web3.utils.sha3(order.email)

      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash },
        { type: "bytes32", value: orderHash },
      )

      const price = web3.utils.toWei(String(order.price))

      try {
        await contract.methods.purchaseCourse(
          hexCourseId,
          proof
        ).send({from: account.data, value: price})
      } catch {
        console.log("Purchase failed")
      }
    }
  
    return (
          <>
            <div className="py-4">
              <MarketHeader />
            </div>

            <List 
              courses={courses}
            >
              {(course) => 
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  disabled={!canPurchaseCourse}
                  Footer={() => 
                    <div className="mt-4">
                      <Button 
                        disabled={!canPurchaseCourse}
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
                onSubmit={purchaseCourse}
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