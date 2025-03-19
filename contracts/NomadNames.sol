// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NomadNames is ERC721 {
    uint256 public totalSupply;
    uint256 public maxSupply;
    address public owner;

    struct Domain {
        string name;
        uint256 cost;
        bool isOwned;
        address lister;  // Added to track who listed the domain
    }

    mapping(uint256 => Domain) public domains;
    mapping(string => bool) private domainExists; // Track listed domain names

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(string memory _name, uint256 _cost) public {
        require(!domainExists[_name], "Domain already listed");

        maxSupply++;
        domains[maxSupply] = Domain(_name, _cost, false, msg.sender); // Store the lister's address
        domainExists[_name] = true;
    }

    function domainExistsByName(string memory _name) public view returns (bool) {
        return domainExists[_name];
    }

    function mint(uint256 _id) public payable {
        require(_id != 0 && _id <= maxSupply, "Invalid ID");
        require(!domains[_id].isOwned, "Already owned");
        require(msg.value >= domains[_id].cost, "Not enough funds");

        domains[_id].isOwned = true;
        totalSupply++;
        _safeMint(msg.sender, _id);

        // Calculate payment distribution
        uint256 totalCost = msg.value;
        uint256 listerShare = (totalCost * 80) / 100; // 80% to lister
        uint256 ownerShare = totalCost - listerShare; // 20% to owner

        // Send 80% to the lister
        address lister = domains[_id].lister;
        (bool sentToLister, ) = lister.call{value: listerShare}("");
        require(sentToLister, "Failed to send to lister");

        // Send 20% to the owner
        (bool sentToOwner, ) = owner.call{value: ownerShare}("");
        require(sentToOwner, "Failed to send to owner");
    }

    function getDomain(uint256 _id) public view returns (Domain memory) {
        return domains[_id];
    }

    function withdraw() public {
        require(msg.sender == owner, "Not contract owner");
        uint256 balance = address(this).balance;
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdraw failed");
    }
}