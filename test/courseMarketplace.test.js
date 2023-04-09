

const CourseMarketplace = artifacts.require("CourseMarketplace")

contract("CourseMarketplace", accounts => {

    const courseId = "0x00000000000000000000000000003130";
    const proof = "0x0000000000000000000000000000313000000000000000000000000000003130";
    const value = "900000000";

    let _contract = null
    let contractOwner = null
    let buyer = null
    let courseHash = null

    before(async ()=> {
        _contract = await CourseMarketplace.deployed()
        contractOwner = accounts[0]
        buyer = accounts[1]
    })

    describe("Purchase Course", () => {
        before(async () => {
            await _contract.purchaseCourse(courseId, proof, {from: buyer, value: value})
        })

        it("should not be able to purchase the same course twice", async () => {
            try {
                await _contract.purchaseCourse(courseId, proof, {from: buyer, value: value})
            } catch (error) {
                assert(error, "Expected an error but did not get one")
            }
        })

        it("can get the purchased course hash by index", async () => {
            const index = 0
            courseHash = await _contract.getCourseHashAtIndex(index)

            const expectedHash = web3.utils.soliditySha3(
                {type: "bytes16", value: courseId},
                {type: "address", value: buyer}
            )
            assert.equal(courseHash, expectedHash, "The course hash is not correct")
        })

        it("should match data of the course purchased by buyer", async () => {
            const expectedIndex = 0
            const expectedState = 0
            const course = await _contract.getCourseByHash(courseHash)

            assert.equal(course.id, expectedIndex, "The index is not correct")
            assert.equal(course.state, expectedState, "The course state is not correct")
            assert.equal(course.price, value, `The course price is not correct. Should be ${value} wei`)
            assert.equal(course.proof, proof, "The proof is not correct")
            assert.equal(course.owner, buyer, "The buyer is not correct")
        })
    })

    describe("Activate the purchased course", () => {

        it("not contract owner should not be able to activate contract", async() => {
            try {
                await _contract.activateCourse(courseHash, { from: buyer })
            } catch (error) {
                assert(error, "Expected an error but did not get one")
            }
        })

        it("should have ACTIVATED state", async() => {
            await _contract.activateCourse(courseHash, { from: contractOwner })
            const course = await _contract.getCourseByHash(courseHash)
            const expectedState = 1
            assert.equal(course.state, expectedState, "The course state is not correct")
        })
    })


    describe("Transfer contract ownership", () => {
        
        it("should have the new owner", async() => {
            await _contract.transferOwnership(buyer, { from: contractOwner })
            const newOwner = await _contract.getContractOwner()
            assert.equal(newOwner, buyer, "The new owner is not correct")
        })

        it("not contract owner should not be able to transfer contract ownership", async() => {
            try {
                await _contract.transferOwnership(contractOwner, { from: buyer })
            } catch (error) {
                assert(error, "Expected an error but did not get one")
            }
        })

    })
})