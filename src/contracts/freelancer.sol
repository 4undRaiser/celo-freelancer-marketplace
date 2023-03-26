// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(address, address, uint256) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract FreelancerMarketplace {
    uint private freelancerLength = 0;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Freelancer {
        address freelancerAddress;
        string image;
        string name;
        string title;
        string description;
        uint price;
        uint noOfJobs;
        bool available;
    }

    mapping(uint => Freelancer) internal freelancers;

    modifier onlyFreelancer(uint _index) {
        require(freelancers[_index].freelancerAddress == msg.sender);
        _;
    }

    function newFreelancer(
        string memory _image,
        string memory _name,
        string memory _title,
        string memory _description,
        uint _price
    ) public {
        freelancers[freelancerLength] = Freelancer(
            msg.sender,
            _image,
            _name,
            _title,
            _description,
            _price,
            0,
            true
        );
        freelancerLength++;
    }

    function getFreelancers(
        uint _index
    )
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            string memory,
            uint,
            uint,
            bool
        )
    {
        Freelancer memory freelancer = freelancers[_index];
        return (
            freelancer.freelancerAddress,
            freelancer.image,
            freelancer.name,
            freelancer.title,
            freelancer.description,
            freelancer.price,
            freelancer.noOfJobs,
            freelancer.available
        );
    }

    function changePrice(
        uint _index,
        uint _newPrice
    ) public onlyFreelancer(_index) {
        freelancers[_index].price = _newPrice;
    }

    function changeDescription(
        uint _index,
        string memory _newDescription
    ) public onlyFreelancer(_index) {
        freelancers[_index].description = _newDescription;
    }

    function toggleAvailable(uint _index) public onlyFreelancer(_index) {
        freelancers[_index].available = !freelancers[_index].available;
    }

    function hireFreelancerHourly(uint _index, uint _hours, uint _amount) public {
        require(_hours > 0, "Hours must be greater than 0");
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                freelancers[_index].freelancerAddress,
                _amount
            ),
            "Transfer failed."
        );
        freelancers[_index].available = false;
        freelancers[_index].noOfJobs++;
    }

    function getFreelancersLength() public view returns (uint) {
        return (freelancerLength);
    }
}
