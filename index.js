import { ethers } from './ethers-5.1.esm.min.js';
import { abi, contractAddress } from './constants.js';

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fund');
const getBalanceButton = document.getElementById('getBalance');
const withdrawButton = document.getElementById('withdrawBtn');
connectButton.onclick = connect;
fundButton.onclick = fund;
getBalanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

console.log(ethers);

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.request({ method: 'eth_requestAccounts' });
    document.getElementById('connectButton').innerHTML = 'Connected!';
  } else {
    document.getElementById('connectButton').innerHTML =
      'Please install metamask!';
  }
}

async function getBalance() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function fund() {
  if (typeof window.ethereum !== 'undefined') {
    // provider // connection to the blockchain
    // signer / wallet / someone with some gas
    // contract that we are interacting with ABI & Address
    const ethAmount = document.getElementById('ethAmount').value;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const fundValue = ethers.utils.parseEther(ethAmount);
    try {
      const transactionRes = await contract.fund({ value: fundValue });
      // listen for the tx to be mined
      // listen for an event
      await listenForTransactionMine(transactionRes, provider);
      console.log('Done!');
    } catch (err) {
      console.log(err);
    }
  }
}

async function withdraw() {
  if (typeof window.ethereum !== 'undefined') {
    // provider // connection to the blockchain
    // signer / wallet / someone with some gas
    // contract that we are interacting with ABI & Address
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionRes = await contract.withdraw();
      // listen for the tx to be mined
      // listen for an event
      await listenForTransactionMine(transactionRes, provider);
      console.log('Done!');
    } catch (err) {
      console.log(err);
    }
  }
}

async function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations.`
      );
      resolve();
    });
  });
}
