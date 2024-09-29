import { ethers } from 'ethers';
import { deployedContract, privateKey } from '../utils/constants.js';


const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');

const wallet = new ethers.Wallet(privateKey, provider);

const contractABI = [
    "event DocumentAdded(string userPublicKey, address issuer, string documentHash)",
    "event UserAdded(string publicKey)",
    "function registerUser(string _publicKey) public",
    "function addDocument(string _userPublicKey, address _issuer, string _documentHash, string _encryptedDocument) public",
    "function getDocuments(string _userPublicKey) public view returns (tuple(address issuer, string documentHash, string encryptedDocument, uint256 createdAt)[])",
    "function getDocumentCount(string _userPublicKey) public view returns (uint256)"
];

const contractAddress = deployedContract; // Replace with your deployed contract address

const contract = new ethers.Contract(contractAddress, contractABI, wallet);


export async function registerUser(userPublicKey) {
    try {
        const receipt = await contract.registerUser(userPublicKey).send({ from: contractAddress });
        await receipt.wait();
        console.log('User registered:');
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

export async function addDocument(userPublicKey, issuer, documentHash, encryptedDocument) {
    try {
        const receipt = await contract.addDocument(userPublicKey, issuer, documentHash, encryptedDocument)
        console.log('Document added:', receipt.hash);
        await receipt.wait();
    } catch (error) {
        console.error('Error adding document:', error);
    }
}

export async function getDocuments(userPublicKey) {
    try {
        const documents = await contract.getDocuments(userPublicKey);
        console.log('Documents for user:', documents);
    } catch (error) {
        console.error('Error retrieving documents:', error);
    }
}

export async function getDocumentCount(userPublicKey) {
    try {
        const count = await contract.getDocumentCount(userPublicKey).call();
        await receipt.wait();
        console.log(`Document count for ${userPublicKey}:`, count);
    } catch (error) {
        console.error('Error getting document count:', error);
    }
}


// export async function setNumber(number) {
//     try {
//         // Example: Call a function from your smart contract
//         const tx = await contract.setNumber(number);
//         console.log("Transaction hash:", tx.hash);
        
//         // Wait for the transaction to be mined
//         await tx.wait();
//         console.log("Transaction confirmed!");

//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

// export async function getNumber() {
//     try {
//         const result = await contract.getNumber();
//         console.log("Verification result:", result.toString());
//     } catch (error) {
//         console.error("Error calling getNumber:", error);
//     }
// }

// export async function inc() {
//     try {
//         const tx = await contract.increment();
//         console.log("Transaction hash:", tx.hash);

//         await tx.wait();
//         console.log("Transaction confirmed!");

//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

// export async function dec() {
//     try {
//         const tx = await contract.decrement();
//         console.log("Transaction hash:", tx.hash);

//         await tx.wait();
//         console.log("Transaction confirmed!");

//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

