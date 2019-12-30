pragma solidity ^0.5.11;

contract Files {
    uint public filesCount = 0;

    struct File {
        uint id;
        string base64content;
        bool isPrivate;
    }

    event FileCreated (
        uint id,
        string base64content,
        bool isPrivate
    );

    event privatePropertyChanged(
        uint id,
        string base64content,
        bool isPrivate
    );

    mapping (uint => File) public files;

    constructor() public {
        createFile("I'm the first sample file");
    }

    function createFile(string memory _content) public {
        filesCount ++;
        files[filesCount] = File(filesCount, _content, false);

        emit FileCreated(filesCount, _content, false);
    }

    function togglePrivateFile(uint _id) public {
        File memory _file = files[_id];
        _file.isPrivate = !_file.isPrivate;

        files[_id] = _file;

        emit privatePropertyChanged(_file.id, _file.base64content, _file.isPrivate);
    }
}