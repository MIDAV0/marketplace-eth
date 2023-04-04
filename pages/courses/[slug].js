import { Hero, Keypoints, Cirriculum } from "@components/ui/course"
import { Modal } from "@components/ui/common"
import { BaseLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"
import { useAccount, useOwnedCourse } from "@components/hooks/web3"
import { Message } from "@components/ui/common"

export default function Course({course}) {
    const { account } = useAccount()
    const { ownedCourse } = useOwnedCourse(course, account.data)
    const courseState = ownedCourse.data?.state

    return (
        <>
            <div className="py-4">
                <Hero
                    hasOwner={ownedCourse.data}
                    title={course.title}
                    description={course.description}
                    image={course.coverImage}
                />
            </div>
            <Keypoints points={course.wsl}/>
            {
                courseState &&
                <div className="max-w-5xl mx-auto">
                    {
                        courseState === "purchased" &&
                        <Message type="danger">
                            Course is purchased and waiting for activation.
                        </Message>  
                    }
                    {
                        courseState === "activated" &&
                        <Message>
                            Course is activated and ready to watch.
                        </Message>  
                    }
                    {
                        courseState === "deactivated" &&
                        <Message type="danger">
                            Course has been deactivated.
                        </Message>  
                    }

                </div>
            }
            <Cirriculum locked={true}/>
            <Modal />
        </>
    )
  }

export function getStaticPaths() {
    const { data } = getAllCourses()

    return {
        paths: data.map(c => ({
            params: {
                slug: c.slug
            }
        })), fallback: false
    }
}

export function getStaticProps({ params }) {
    const { data } = getAllCourses()
    const course = data.filter(c => c.slug === params.slug)[0]
  
    return {
      props: {
        course
      }
    }
  }
  


Course.Layout = BaseLayout