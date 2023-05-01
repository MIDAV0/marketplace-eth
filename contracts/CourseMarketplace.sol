// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {

    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    struct Course {
        uint id;
        uint price;
        bytes32 proof;
        address owner;
        State state;
    }

    mapping(bytes32 => Course) private ownedCourses;

    mapping(uint => bytes32) private ownedCourseHash;

    uint private totalOwnedCourses;

    address payable private owner;

    bool isStopped;

    constructor() {
        setContractOwner(msg.sender);
        isStopped = false;
    }

    /// Course already has an owner!
    error CourseHasOwner();

    modifier onlyOwner() {
        require(msg.sender == getContractOwner(), "Only owner of the contract");
        _;
    }

    modifier isActive() {
        require(!isStopped, "Contract is stopped at the moment");
        _;
    }

    modifier isNotActive(){
        require(isStopped, "Contract is not stopped");
        _;
    }

    receive() external payable {}

    function withdraw(uint amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function emergencyWithdraw() external onlyOwner isNotActive {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }


    function stopContract() external onlyOwner {
        isStopped = true;
    }

    function resumeContract() external onlyOwner {
        isStopped = false;
    }

    function purchaseCourse(
        bytes16 courseId,
        bytes32 proof
    ) external payable isActive
    {
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));
        if (hasCourseOwnership(courseHash)) {
            revert CourseHasOwner();
        }
        uint id = totalOwnedCourses++;
        ownedCourseHash[id] = courseHash;
        ownedCourses[courseHash] = Course({
            id: id,
            price: msg.value,
            proof: proof,
            owner: msg.sender,
            state: State.Purchased
        });
    }

    function repurchaseCourse(bytes32 courseHash) external payable isActive {
        require(isCourseCreated(courseHash), "Course is not created");
        require(hasCourseOwnership(courseHash), "You are not a course owner");
        Course storage course = ownedCourses[courseHash];
        require(course.state == State.Deactivated, "Invalid state");

        course.state = State.Purchased;
        course.price = msg.value;
    }

    function activateCourse(bytes32 courseHash) external onlyOwner isActive {
        require(isCourseCreated(courseHash), "Course is not created");
        Course storage course = ownedCourses[courseHash];
        require(course.state == State.Purchased, "Invalid state");
        course.state = State.Activated;
    }

    function deactivateCourse(bytes32 courseHash) external onlyOwner isActive {
        require(isCourseCreated(courseHash), "Course is not created");
        Course storage course = ownedCourses[courseHash];
        require(course.state == State.Purchased, "Invalid state");

        (bool success, ) = course.owner.call{value: course.price}("");
        require(success, "Transfer failed!");

        course.state = State.Deactivated;
        course.price = 0;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        setContractOwner(newOwner);
    }

    function getCourseCount() external view returns(uint) {
        return totalOwnedCourses;
    }

    function getCourseHashAtIndex(uint index) external view returns(bytes32) {
        return ownedCourseHash[index];
    }

    function getCourseByHash(bytes32 courseHash) external view returns(Course memory){
        return ownedCourses[courseHash];
    } 

    function getContractOwner() public view returns(address) {
        return owner;
    }

    function setContractOwner(address newOwner) private {
        owner = payable(newOwner);
    }

    function isCourseCreated(bytes32 courseHash) private view returns(bool){
        return ownedCourses[courseHash].owner != 0x0000000000000000000000000000000000000000;
    }

    function hasCourseOwnership(bytes32 courseHash) private view returns(bool) {
        return ownedCourses[courseHash].owner == msg.sender;
    }
}