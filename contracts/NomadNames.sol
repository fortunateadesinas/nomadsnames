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
    }

    mapping(uint256 => Domain) public domains;
    mapping(string => bool) private domainExists; // 🔹 Track listed domain names

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(string memory _name, uint256 _cost) public {
        require(!domainExists[_name], "Domain already listed"); // 🔹 Prevent duplicate listing

        maxSupply++;
        domains[maxSupply] = Domain(_name, _cost, false);
        domainExists[_name] = true; // 🔹 Mark domain as listed
    }

    function mint(uint256 _id) public payable {
        require(_id != 0 && _id <= maxSupply, "Invalid ID");
        require(!domains[_id].isOwned, "Already owned");
        require(msg.value >= domains[_id].cost, "Not enough funds");

        domains[_id].isOwned = true;
        totalSupply++;
        _safeMint(msg.sender, _id);
    }

    function getDomain(uint256 _id) public view returns (Domain memory) {
        return domains[_id];
    }

    function withdraw() public {
        require(msg.sender == owner, "Not contract owner");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}
