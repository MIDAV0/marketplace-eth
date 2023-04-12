const { catchRevert } = require("./utils/exceptions");


const CourseMarketplace = artifacts.require("CourseMarketplace")

const getBalance = async address => web3.eth.getBalance(address)

const toBN = value => web3.utils.toBN(value)

const getGas = async result => {
    const tx = await web3.eth.getTransaction(result.tx)
    const gasUsed = toBN(result.receipt.gasUsed)
    const gasPrice = toBN(tx.gasPrice)
    const gas = gasUsed.mul(gasPrice)

    return gas
}

contract("CourseMarketplace", accounts => {

    const courseId = "0x00000000000000000000000000003130";
    const proof = "0x0000000000000000000000000000313000000000000000000000000000003130";
    const value = "900000000";

    const courseId2 = "0x00000000000000000000000000002130";
    const proof2 = "0x0000000000000000000000000000213000000000000000000000000000002130";


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
            await catchRevert(_contract.purchaseCourse(courseId, proof, {
                from: buyer,
                value
              }))
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

    describe("Deactivate course", () => {
        let courseHash2 = null

        before(async () => {
          await _contract.purchaseCourse(courseId2, proof2, {from: buyer, value})
          courseHash2 = await _contract.getCourseHashAtIndex(1)
        })
    
        it("should NOT be able to deactivate the course by NOT contract owner", async () => {
          await catchRevert(_contract.deactivateCourse(courseHash2, {from: buyer}))
        })
    
        it("should have status of deactivated and price 0", async () => {
          await _contract.deactivateCourse(courseHash2, {from: contractOwner})
          const course = await _contract.getCourseByHash(courseHash2)
          const exptectedState = 2
          const exptectedPrice = 0
    
          assert.equal(course.state, exptectedState, "Course is NOT deactivated!")
          assert.equal(course.price, exptectedPrice, "Course price is not 0!")
        })
    
        it("should NOT be able activate deactivated course", async () => {
          await catchRevert(_contract.activateCourse(courseHash2, {from: contractOwner}))
        })
    })

    describe("Repurchase course", () => {
        let courseHash2 = null


        before(async () => {
            courseHash2 = await _contract.getCourseHashAtIndex(1)
        })

        it("should not be able to repurchase the course", async () => {
            const notExistingHash = "0x5ceb3f8075c3dbb5d490c8d1e6c950302ed065e1a9031750ad2c6513069e3fc3"
            await catchRevert(_contract.repurchaseCourse(notExistingHash, { from: buyer, value }))
        })

        it("should not be able to repurchase f no course owner", async () => {
            const notOwnerAddress = accounts[2]
            await catchRevert(_contract.repurchaseCourse(courseHash2, { from: notOwnerAddress, value }))
        })

        it("should be able to repurchase with original buyer", async () => {
            const beforeTxBuyerBalance = await getBalance(buyer)
            
            await _contract.repurchaseCourse(courseHash2, { from: buyer, value })

            const afterTxBuyerBalance = await await getBalance(buyer)

            const course = await _contract.getCourseByHash(courseHash2)
            const expectedState = 0
            assert.equal(course.state, expectedState, "The course state is not correct")
            assert.equal(course.price, value, `The course price is not correct. Should be ${value} wei`)
            assert(afterTxBuyerBalance < beforeTxBuyerBalance, "The buyer balance is not correct")
        })

        it("should not be able to repurchase with new buyer", async () => {
            await catchRevert(_contract.repurchaseCourse(courseHash2, { from: buyer }))
        })
    })
})