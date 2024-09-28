import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import SimpleStorage from '../../build/contracts/SimpleStorage.json';

const ContractInteraction = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const init = async () => {
      const web3 = new Web3('http://127.0.0.1:7545');
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorage.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorage.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(instance);
    };

    init();
  }, []);

  const getData = async () => {
    if (contract) {
        const result = await contract.methods.getNumber().call();
        console.log(result);
        
      setData(result);
    }
  };

  const sendData = async () => {
    if (contract) {
      await contract.methods.setNumber(1).send({ from: account });
      getData()
    }
  };

  const incrementdata = async () => {
    if (contract) {
      await contract.methods.increment().send({ from: account });
      getData()
    }
  };

  const decrementdata = async () => {
    if (contract) {
      await contract.methods.decrement().send({ from: account });
      getData()
    }
  };

  return (
    <div>
      <h1>Your Smart Contract Interaction</h1>
      <button onClick={getData}>Get Data</button>
      <button onClick={sendData}>Send Data</button>
      <button onClick={incrementdata}>Increment</button>
      <button onClick={decrementdata}>Decrement</button>
      {data && <p>Data: {data}</p>}
    </div>
  );
};

export default ContractInteraction;
