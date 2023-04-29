
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


export default function Marketplace({ courses }) {
    const { web3, contract, requireInstall } = useWeb3()
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [isNewPurchase, setNewPurchase] = useState(true)

    const {hasConnectedWallet, account, isConnecting, network} = useWalletInfo()
    const { ownedCourses } = useOwnedCourses(courses, account.data, network.data)

    const purchaseCourse = async order => {
      const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id)

      const orderHash = web3.utils.soliditySha3(
        { type: "bytes16", value: hexCourseId },
        { type: "address", value: account.data },
      )

      const price = web3.utils.toWei(String(order.price))

      if (isNewPurchase) {
        const emailHash = web3.utils.sha3(order.email)
        const proof = web3.utils.soliditySha3(
          { type: "bytes32", value: emailHash },
          { type: "bytes32", value: orderHash },
        )
        
        await _purchaseCourse(hexCourseId, proof, price)
      } else {
        await _repurchaseCourse(orderHash, price)
      }
    }

    const _purchaseCourse = async (hexCourseId, proof, value) => {
      try {
        await contract.methods.purchaseCourse(
          hexCourseId,
          proof
        ).send({from: account.data, value})
      } catch {
        console.log("Purchase failed")
      }
    }

    const _repurchaseCourse = async (courseHash, value) => {
      try {
        await contract.methods.repurchaseCourse(
          courseHash
        ).send({from: account.data, value})
      } catch {
        console.log("Repurchase failed")
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
              {(course) => {
                const owned = ownedCourses.lookup[course.id]

                return (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  state={owned?.state}
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

                      if (owned) {
                        return (
                          <>
                            <div>
                              <Button 
                                disabled={true}
                                variant="lightBlue"
                                >
                                  Owned
                              </Button>
                              { owned.state === "deactivated" && 
                                <Button 
                                  disabled={false}
                                  variant="lightBlue"
                                  onClick={() => {
                                      setNewPurchase(false)
                                      setSelectedCourse(course)
                                    }}
                                  >
                                    Fund to Activate
                                </Button>                              
                              }
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
                )}
              }
            </List>
            { selectedCourse &&
              <OrderModal 
                course={selectedCourse} 
                isNewPurchase={isNewPurchase}
                onSubmit={purchaseCourse}
                onClose={() => {
                  setSelectedCourse(null)
                  setNewPurchase(true)
                }}
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