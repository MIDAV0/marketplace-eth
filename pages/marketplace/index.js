
import { BaseLayout } from "@components/ui/layout"
import { CourseCard, List } from "@components/ui/course"
import { getAllCourses } from "@content/courses/fetcher"
import { WalletBar } from "@components/ui/web3"
import { useAccount } from "@components/hooks/web3/useAccount"
import { useNetwork } from "@components/hooks/web3/useNetwork"

export default function Marketplace({ courses }) {
    const { account } = useAccount()
    const { network } = useNetwork()
    console.log(network)
  
    return (
          <>
            <div className="py-4">
                <WalletBar 
                    address={account.data}
                    network={network.data}
                    /> 
            </div>

            <List 
              courses={courses}
            >
            {(course) => <CourseCard key={course.id} course={course}/>}
            </List>
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