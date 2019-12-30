pragma solidity ^0.5.11;

contract Files {
    uint public filesCount = 0;

    struct File {
        uint id;
        string base64content;
        bool isPrivate;
    }

    mapping (uint => File) public files;

    constructor() public {
        createFile("I'm the first sample file");
    }

    function createFile(string memory _content) public {
        filesCount ++;
        files[filesCount] = File(filesCount, _content, false);
    }
}