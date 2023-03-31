
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
    const { web3 } = useWeb3()
    const [selectedCourse, setSelectedCourse] = useState(null)
    const {canPurchaseCourse, account} = useWalletInfo()

    const purchaseCourse = order => {
      
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