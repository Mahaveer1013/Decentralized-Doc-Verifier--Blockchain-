import { ethers } from 'ethers';
import SimpleStorage from '../abi/SimpleStorage.json'
import { getUser } from '../controllers/user';
import { decryptPrivateKey } from '../controllers/functions';
import { deployedContract } from '../constants';

const user = getUser()

const privateKey = decryptPrivateKey(user.encrypted_private_key)

const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');

const wallet = new ethers.Wallet(privateKey, provider);

const contractABI = [
    SimpleStorage.abi
];
const contractAddress = deployedContract; // Replace with your deployed contract address

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function main() {
    try {
        // // Example: Call a function from your smart contract
        // const tx = await contract.issueCertificate("doc_12345", "encrypted_value", "0xRecipientAddress");
        // console.log("Transaction hash:", tx.hash);
        
        // // Wait for the transaction to be mined
        // await tx.wait();
        // console.log("Transaction confirmed!");
        
        // // You can also read from your contract
        // const result = await contract.verifyCertificate("doc_12345", "encrypted_value");
        // console.log("Verification result:", result);
        
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
