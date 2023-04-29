
import { BaseLayout } from "@components/ui/layout"
import { CourseCard, List } from "@components/ui/course"
import { getAllCourses } from "@content/courses/fetcher"
import { useOwnedCourse, useOwnedCourses, useWalletInfo } from "@components/hooks/web3"
import { Button } from "@components/ui/common"
import { OrderModal } from "@components/ui/order"
import { useState } from "react"
import { MarketHeader } from "@components/ui/marketplace"
import { useWeb3 } from "@components/providers"
import { Loader } from "@components/ui/common"
import { Message } from "@components/ui/common"


export default function Marketplace({ courses }) {
    const { web3, contract, requireInstall } = useWeb3()
    const [selectedCourse, setSelectedCourse] = useState(null)
    const {hasConnectedWallet, account, isConnecting} = useWalletInfo()
    const { ownedCourses } = useOwnedCourses(courses, account.data)

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
                  disabled={!hasConnectedWallet}
                  Footer={() => {
                      if (requireInstall) {
                        return (
                            <Button 
                              disabled={true}
                              variant="lightBlue"
                              >
                              Install
                            </Button>
                        )
                      }
                      
                      if (isConnecting) {
                        return (
                          <Button 
                            disabled={true}
                            variant="lightBlue"
                            >
                            <Loader />
                          </Button>
                       )
                      }

                      if (!ownedCourses.hasInitialResponse) {
                        return (
                          <Button 
                            disabled={true}
                            variant="lightBlue"
                            >
                              Loading State
                          </Button>
                        )
                      }

                      const owned = ownedCourses.lookup[course.id]

                      if (owned) {
                        return (
                          <>
                            <Button 
                              disabled={true}
                              variant="lightBlue"
                              >
                                Owned
                            </Button>
                            <div className="mt-2">
                              <Message>
                                  {owned.state.substring(0, 1).toUpperCase() + owned.state.substring(1)}
                              </Message>
                            </div>
                          </>
                        )
                      }

                      return(
                          <Button 
                            disabled={!hasConnectedWallet}
                            variant="lightBlue"
                            onClick={() => setSelectedCourse(course)}
                            >
                            Purchase
                          </Button>
                      )
                    }
                  }
                />
              }
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