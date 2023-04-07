import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { ManagedCourseCard} from "@components/ui/course";
import { CourseFilter } from "@components/ui/course";
import { Button } from "@components/ui/common";
import { useAccount, useManagedCourses } from "@components/hooks/web3";
import { useState } from "react";
import { useWeb3 } from "@components/providers/web3";
import { Message } from "@components/ui/common";

export default function ManageCourses(){
    const { web3 } = useWeb3()
    const [email, setEmail] = useState("")
    const [proofedOwner, setProofedOwner] = useState({})
    const { account } = useAccount()
    const { managedCourses } = useManagedCourses(account.data)

    const verifyCourse = (email, {hash, proof}) => {
        const emailHash = web3.utils.sha3(email)
        const proofToCheck = web3.utils.soliditySha3(
            {
                type: "bytes32",
                value: emailHash
            },
            {
                type: "bytes32",
                value: hash  
            }
        )
        proofToCheck === proof ?
            setProofedOwner({
                [hash]: true
            }) :
            setProofedOwner({
                [hash]: false
            })
    }

    return (
        <>
            <div className="py-4">
              <MarketHeader />
              <CourseFilter />
            </div>
            <section className="grid grid-cols-1">
                {
                    managedCourses.data?.map(course => 
                        <ManagedCourseCard
                            key={course.ownedCourseId}
                            course={course}>
                            <div className="flex mr-2 relative rounded-md">
                                <input 
                                    value={email}
                                    onChange={({target: {value}}) => setEmail(value)}   
                                    type="text"
                                    name="account"
                                    id="account"
                                    className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="0x2341ab..." />
                                <Button 
                                    onClick={()=>{
                                        verifyCourse(email, {hash: course.hash, proof: course.proof})
                                    }}
                                >
                                    Verify
                                </Button>
                            </div>
                            {
                                proofedOwner[course.hash] &&
                                <div className="mt-2">
                                    <Message>
                                        Verified!
                                    </Message>
                                </div>
                            }
                            {
                                proofedOwner[course.hash] === false &&
                                <div className="mt-2">
                                    <Message>
                                        Wrong proof!
                                    </Message>
                                </div>
                            }
                        </ManagedCourseCard>
                    )
                }
            </section>
        </>
    )
}


ManageCourses.Layout = BaseLayout