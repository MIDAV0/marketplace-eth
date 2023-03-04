import { Hero, Keypoints, Cirriculum } from "@components/course"
import { Modal } from "@components/common"
import { BaseLayout } from "@components/layout"
import { getAllCourses } from "@content/courses/fetcher"

export default function Course({course}) {

    return (
        <>
            <div className="py-4">
                <Hero
                    title={course.title}
                    description={course.description}
                    image={course.coverImage}
                />
            </div>
            <Keypoints points={course.wsl}/>
            <Cirriculum locked={true}/>
            <Modal />
        </>
    )
  }

export function getStaticPaths() {
    const { data } = getAllCourses()

    return {
        paths: data.map(course => ({
            params: {
                slug: course.slug
            }
        })), fallback: false
    }
}

export function getStaticProps({ params }) {
    const { data } = getAllCourses()
    const course = data.filter(course => course.slug === params.slug)[0]
  
    return {
      props: {
        course
      }
    }
  }
  


Course.Layout = BaseLayout