// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentStorage {
    struct User {
        address publicKey;
    }

    struct Document {
        address issuer;        
        string documentHash;      
        string encryptedDocument;
        uint256 createdAt;         
    }

    mapping(string => User) private users;

    mapping(string => Document[]) private userDocuments;

    event DocumentAdded(string userPublicKey, address issuer, string documentHash);
    
    event UserAdded(string publicKey);

    function registerUser(string memory _publicKey) public {
        users[_publicKey] = User({
            publicKey: msg.sender 
        });

        emit UserAdded(_publicKey);
    }

    // Function to add a new document
    function addDocument(string memory _userPublicKey, address _issuer, string memory _documentHash, string memory _encryptedDocument) public {
        Document memory newDoc = Document({
            issuer: _issuer,
            documentHash: _documentHash,
            encryptedDocument: _encryptedDocument,
            createdAt: block.timestamp
        });

        userDocuments[_userPublicKey].push(newDoc);

        emit DocumentAdded(_userPublicKey, _issuer, _documentHash);
    }

    // Function to retrieve all documents for a user
    function getDocuments(string memory _userPublicKey) public view returns (Document[] memory) {
        return userDocuments[_userPublicKey];
    }

    // Function to get the count of documents for a user
    function getDocumentCount(string memory _userPublicKey) public view returns (uint256) {
        return userDocuments[_userPublicKey].length;
    }
}
