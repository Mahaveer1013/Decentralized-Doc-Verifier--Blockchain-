import { ethers } from 'ethers';
import { deployedContract, privateKey } from '../utils/constants.js';


const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');

const wallet = new ethers.Wallet(privateKey, provider);

const contractABI = [
    "event NumberChanged(uint256 newNumber)",
    "function setNumber(uint256 _number) public",
    "function getNumber() public view returns (uint256)",
    "function increment() public",
    "function decrement() public"
];

const contractAddress = deployedContract; // Replace with your deployed contract address

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

export async function setNumber(number) {
    try {
        // Example: Call a function from your smart contract
        const tx = await contract.setNumber(number);
        console.log("Transaction hash:", tx.hash);
        
        // Wait for the transaction to be mined
        await tx.wait();
        console.log("Transaction confirmed!");

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getNumber() {
    try {
        const result = await contract.getNumber();
        console.log("Verification result:", result.toString());
    } catch (error) {
        console.error("Error calling getNumber:", error);
    }
}

export async function inc() {
    try {
        const tx = await contract.increment();
        console.log("Transaction hash:", tx.hash);

        await tx.wait();
        console.log("Transaction confirmed!");

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function dec() {
    try {
        const tx = await contract.decrement();
        console.log("Transaction hash:", tx.hash);

        await tx.wait();
        console.log("Transaction confirmed!");

    } catch (error) {
        console.error("Error:", error);
    }
}

