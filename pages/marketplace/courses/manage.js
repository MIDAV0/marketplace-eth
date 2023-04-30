import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { ManagedCourseCard} from "@components/ui/course";
import { CourseFilter } from "@components/ui/course";
import { Button } from "@components/ui/common";
import { useAdmin, useManagedCourses } from "@components/hooks/web3";
import { useState } from "react";
import { useWeb3 } from "@components/providers/web3";
import { Message } from "@components/ui/common";
import { normalizedOwnedCourse } from "@utils/normalize";
import { useEffect } from "react";

const VerificationInput = ({onVerify}) => {
    const [email, setEmail] = useState("")

    return (
        <div className="flex mr-2 relative rounded-md">
            <input 
                value={email}
                onChange={({target: {value}}) => setEmail(value)}   
                type="text"
                name="account"
                id="account"
                className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                placeholder="0x2341ab..." />
            
            <div className="ml-3">
                <Button 
                    onClick={()=>{
                    onVerify(email)
                    }}
                >
                    Verify
                </Button>
            </div>    
        </div>
    )
}


export default function ManageCourses(){
    const { web3, contract} = useWeb3()
    const [proofedOwner, setProofedOwner] = useState({})
    const [searchedCourse, setSearchedCourse] = useState(null)
    const [filters, setFilters] = useState({state: ""})
    const { account } = useAdmin({redirectTo: "/marketplace"})
    const { managedCourses } = useManagedCourses(account)

    const verifyCourse = (email, {hash, proof}) => {
        const emailHash = web3.utils.sha3(email)
        const proofToCheck = web3.utils?.soliditySha3(
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

    const changeCourseState = async (courseHash, method) => {
        try {
            await contract.methods[method](courseHash).send({from: account.data})
        } catch (error) {
            console.error(error.message)
        }
    }

    const activateCourse = async (courseHash) => {
        changeCourseState(courseHash, "activateCourse")
    }

    const deactivateCourse = async (courseHash) => {
        changeCourseState(courseHash, "deactivateCourse")
    }

    const searchCourse = async (courseHash) => {
        var re = /[0-9A-Fa-f]{6}/g;

        if(courseHash && courseHash.length === 66 && re.test(courseHash)) {
            const course = await contract.methods.getCourseByHash(courseHash).call()
            
            if (course.owner !== "0x0000000000000000000000000000000000000000") {
                const normilized = normalizedOwnedCourse(web3)({courseHash}, course)
                setSearchedCourse(normilized)
                return 
            }
        }

        setSearchedCourse(null)
    }

    const renderCard = course => {
        return (
                <ManagedCourseCard
                key={course.ownedCourseId}
                course={course}>
                <VerificationInput
                    onVerify={email => verifyCourse(email, {hash: course.hash, proof: course.proof})}
                />
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
                {
                    course.state === "purchased" &&
                        <div className="mt-3">
                            <Button
                                onClick={() => activateCourse(course.hash)}
                            >
                                Activate
                            </Button>
                            <Button
                                onClick={() => deactivateCourse(course.hash)}
                                variant="red"
                            >
                                Deactivate
                            </Button>
                        </div>                                
                }
            </ManagedCourseCard>
        )
    }

    if (!account.isAdmin) return null

    const filteredCourses = managedCourses.data
        ?.filter((course) => {
            if (filters.state === "all") {
                return true
            }
            return course.state === filters.state 
        })
        .map(course => renderCard(course)) 


    return (
        <>
            <div className="py-4">
              <MarketHeader />
              <CourseFilter
                onSearchSubmit={searchCourse}
                onFilterSelect={(value) => setFilters({state: value})}
              />
            </div>
            <section className="grid grid-cols-1">
                { searchedCourse && 
                    <div>
                        <h1 className="text-2xl font-bold">Search</h1>
                        { renderCard(searchedCourse) }
                    </div>
                }
                <h1 className="text-2xl font-bold">All Courses</h1>
                { 
                    filteredCourses?.length > 0 ?
                    filteredCourses :
                    <Message>
                        No courses found
                    </Message>
                }
            </section>
        </>
    )
}


ManageCourses.Layout = BaseLayout