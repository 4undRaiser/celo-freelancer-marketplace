import "./App.css";
import Home from "./components/home";
import { Freelancers } from "./components/Freelancers";
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import freelancer from "./contracts/freelancer.abi.json";
import IERC from "./contracts/IERC.abi.json";

import BigNumber from "bignumber.js";

const ERC20_DECIMALS = 18;
const contractAddress = "0xA371b0718b07026D87F2606295562e86Fa3Dd364";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [freelancers, setFreelancers] = useState([]);

  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(freelancer, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);

  const getFreelancers = useCallback(async () => {
    const freelancerLength = await contract.methods.getFreelancersLength().call();
    const freelancers = [];
    for (let index = 0; index < freelancerLength; index++) {
      let _freelancers = new Promise(async (resolve, reject) => {
        let freelancer = await contract.methods.getFreelancers(index).call();

        resolve({
          index: index,
          freelancerAddress: freelancer[0],
          image: freelancer[1],
          name: freelancer[2],
          title: freelancer[3],
          description: freelancer[4],
          price: freelancer[5],
          noOfJobs: freelancer[6],
          available: freelancer[7],
        });
      });
      freelancers.push(_freelancers);
    }

    const _freelancers = await Promise.all(freelancers);
    setFreelancers(_freelancers);
  }, [contract]);

  const addFreelancer = async (_image, _name, _title, _description, _price) => {
    try {
      await contract.methods
        .newFreelancer(_image, _name, _title, _description, _price)
        .send({ from: address });
      getFreelancers();
    } catch (error) {
      alert(error);
    }
  };

  const changeDescription = async (_index, _description) => {
    try {
      await contract.methods
        .changeDescription(_index, _description)
        .send({ from: address });
      getFreelancers();
    } catch (error) {
      alert(error);
    }
  };

  const changePrice = async (_index, _newprice) => {
    try {
      await contract.methods
        .changePrice(_index, _newprice)
        .send({ from: address });
      getFreelancers();
    } catch (error) {
      alert(error);
    }
  };

  const toggleAvailable = async (_index) => {
    try {
      await contract.methods
        .toggleAvailable(_index)
        .send({ from: address });
      getFreelancers();
    } catch (error) {
      alert(error);
    }
  };

  const hireFreelancer = async (_index, _hours) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
      const totalPayment = _hours * freelancers[_index].price;
      const cost = new BigNumber(totalPayment)
              .shiftedBy(ERC20_DECIMALS)
              .toString();
      console.log(totalPayment);
      await cUSDContract.methods
        .approve(contractAddress, cost)
        .send({ from: address });
      await contract.methods
        .hireFreelancerHourly(_index, _hours, cost)
        .send({ from: address });
      getFreelancers();
      getBalance();
      alert("you have successfully sent cusd to this user");
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getFreelancers();
    }
  }, [contract, getFreelancers]);

  return (
    <div className="App">
      <Home cUSDBalance={cUSDBalance} addFreelancer={addFreelancer} />
      <Freelancers
        freelancers={freelancers}
        hireFreelancer={hireFreelancer}
        changeDescription={changeDescription}
        changePrice={changePrice}
        walletAddress={address}
        toggleAvailable={toggleAvailable}
      />
    </div>
  );
}

export default App;
