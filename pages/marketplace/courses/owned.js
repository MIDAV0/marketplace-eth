import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { OwnedCourseCard } from "@components/ui/course";
import { Button, Message } from "@components/ui/common";
import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { getAllCourses } from "@content/courses/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";
import { useWeb3 } from "@components/providers/web3";

export default function OwnedCourses({courses}){
    const { requireInstall } = useWeb3()
    const router = useRouter()
    const { account, network } = useWalletInfo()
    const { ownedCourses } = useOwnedCourses(courses, account.data, network.data)
    return (
        <>
            <div className="py-4">
              <MarketHeader />
            </div>
            <section className="grid grid-cols-1">
                {
                    ownedCourses.isEmpty
                    && (
                        !ownedCourses.data || ownedCourses?.data.length === 0
                    ) &&
                    <div>
                        <Message type="danger">
                            <div>You don't have any courses yet.</div>
                            <Link href="/marketplace">
                                <span className="font-normal hover:underline">
                                    <i>Purchase course</i>
                                </span>
                            </Link>
                        </Message>
                    </div>
                }                
                {
                    account.isEmpty &&
                    <div>
                        <Message type="danger">
                            <div>Connect to Metamask</div>
                        </Message>
                    </div>
                }
                {
                    requireInstall &&
                    <div>
                        <Message type="danger">
                            <div>Please install metamask</div>
                        </Message>
                    </div>
                }
                {  ownedCourses.data?.map(course =>
                    <OwnedCourseCard
                        key={course.id}
                        course={course}
                    >
                        <Button onClick={()=>router.push(`/courses/${course.slug}`)}>
                            Watch the course
                        </Button>
                    </OwnedCourseCard>
                )}
            </section>
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


OwnedCourses.Layout = BaseLayout