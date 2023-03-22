
import { Hero } from "@components/ui/common"
import { BaseLayout } from "@components/ui/layout"
import { List } from "@components/ui/course"
import { getAllCourses } from "@content/courses/fetcher"
import { CourseCard } from "@components/ui/course"

export default function Home({ courses }) {
  
  return (
        <>
          <Hero />
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

Home.Layout = BaseLayout