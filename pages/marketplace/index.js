
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
import { toast } from "react-toastify"
import { withToast } from "@utils/toast"


export default function Marketplace({ courses }) {
    const { web3, contract, requireInstall } = useWeb3()
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [isNewPurchase, setNewPurchase] = useState(true)
    const [busyCourseId, setBusyCourseId] = useState(null)

    const {hasConnectedWallet, account, isConnecting, network} = useWalletInfo()
    const { ownedCourses } = useOwnedCourses(courses, account.data, network.data)

    const purchaseCourse = async (order, course) => {
      const hexCourseId = web3.utils.utf8ToHex(course.id)

      const orderHash = web3.utils.soliditySha3(
        { type: "bytes16", value: hexCourseId },
        { type: "address", value: account.data },
      )

      const price = web3.utils.toWei(String(order.price))

      setBusyCourseId(course.id)
      if (isNewPurchase) {
        const emailHash = web3.utils.sha3(order.email)
        const proof = web3.utils.soliditySha3(
          { type: "bytes32", value: emailHash },
          { type: "bytes32", value: orderHash },
        )
        
        withToast(_purchaseCourse({hexCourseId, proof, price}, course))
      } else {
        withToast(_repurchaseCourse({courseHash: orderHash, price}, course))
      }
    }

    const _purchaseCourse = async ({hexCourseId, proof, value}, course) => {
      try {
        const result = await contract.methods.purchaseCourse(
          hexCourseId,
          proof
        ).send({from: account.data, value})

        ownedCourses.mutate([
          ...ownedCourses.data, {
            ...course,
            proof,
            state: "purchased",
            owner: account.data,
            price: value
          }
        ])

        return result
      } catch(error) {
        throw new Error(error.message)
      } finally {
        setBusyCourseId(null)
      }
    }

    const _repurchaseCourse = async ({courseHash, value}, course) => {
      try {
        const result = await contract.methods.repurchaseCourse(
          courseHash
        ).send({from: account.data, value})

        
      const index = ownedCourses.data.findIndex(c => c.id === course.id)

      if (index >= 0) {
        ownedCourses.data[index].state = "purchased"
        ownedCourses.mutate(ownedCourses.data)
      } else {
        ownedCourses.mutate()
      }

        return result
      } catch(error) {
        throw new Error(error.message)
      } finally {
        setBusyCourseId(null)
      }
    }

    const cleanModal = () => {
      setSelectedCourse(null)
      setNewPurchase(true)
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
                            variant="white"
                            disabled={true}
                            size="sm">
                              { hasConnectedWallet ?
                                "Loading..." :
                                "Connect"  
                              }
                          </Button>
                        )
                      }

                      const isBusy = busyCourseId === course.id

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
                                  disabled={isBusy}
                                  variant="lightBlue"
                                  onClick={() => {
                                      setNewPurchase(false)
                                      setSelectedCourse(course)
                                    }}
                                  >
                                    { isBusy ?
                                      <div className="flex">
                                        <Loader size="sm" />
                                        <div className="ml-2">In Progress</div>
                                      </div> :
                                      <div>Fund to Activate</div>
                                    }
                                </Button>                              
                              }
                            </div>
                          </>
                        )
                      }

                      return(
                          <Button 
                            disabled={!hasConnectedWallet || isBusy}
                            variant="lightBlue"
                            onClick={() => setSelectedCourse(course)}
                            >
                            { isBusy ?
                              <div className="flex">
                                  <Loader size="sm" />
                                  <div className="ml-2">In Progress</div>
                              </div> :
                              <div>Purchase</div>
                            }
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
                onSubmit={(formData, course) => {
                  purchaseCourse(formData, course)
                  cleanupModal()
                }}
                onClose={cleanModal}
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