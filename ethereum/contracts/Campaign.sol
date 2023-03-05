// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    event CampaignCreated(
        address indexed campaignAddress,
        address indexed manager
    );

    function createCampaign(uint256 minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
        emit CampaignCreated(address(newCampaign), msg.sender);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        uint256[] approvalIndexes;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    mapping(uint256 => mapping(address => bool)) public approvals;

    uint256 public approversCount;

    event CampaignContributed(address indexed contributor, uint256 value);

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;

        emit CampaignContributed(msg.sender, msg.value);
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0,
            approvalIndexes: new uint256[](0)
        });
        requests.push(newRequest);

        emit RequestCreated(description, value, recipient);
    }

    event RequestCreated(
        string description,
        uint256 value,
        address indexed recipient
    );

    function approveRequest(uint256 index) public {
        require(approvers[msg.sender]);
        require(!approvals[index][msg.sender]);

        approvals[index][msg.sender] = true;
        requests[index].approvalIndexes.push(approversCount);
        requests[index].approvalCount++;

        emit RequestApproved(index);
    }

    event RequestApproved(uint256 index);

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);
        request.recipient.transfer(request.value);
        request.complete = true;

        emit RequestFinalized(index);
    }

    event RequestFinalized(uint256 index);
}
