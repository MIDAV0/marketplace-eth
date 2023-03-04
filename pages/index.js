
import { Hero } from "@components/common"
import { BaseLayout } from "@components/layout"
import { Card } from "@components/order"
import { getAllCourses } from "@content/courses/fetcher"

export default function Home({ courses }) {
  return (
        <>
          <Hero />
          <Card courses={courses}/>
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