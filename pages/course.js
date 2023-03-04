import { Hero, Keypoints, Cirriculum } from "@components/course"
import { Modal } from "@components/common"
import { BaseLayout } from "@components/layout"

export default function Course() {

    return (
        <>
            <div className="py-4">
                <Hero />
            </div>
            <Keypoints />
            <Cirriculum />
            <Modal />
        </>
    )
  }

Course.Layout = BaseLayout