// components/ConnectWallet.js
import { useState } from 'react';
import { ethers } from 'ethers';

export default function ConnectWallet({ onWalletConnected }) {
  const [walletAddress, setWalletAddress] = useState('');

  // MetaMask Wallet Connect Handler
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setWalletAddress(accounts[0]);
        if (onWalletConnected) {
          onWalletConnected(accounts[0]);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('MetaMask is not installed!');
    }
  };

  return (
    <button onClick={connectWallet} style={styles.button}>
      {walletAddress ? `Connected: ${walletAddress}` : 'Connect MetaMask'}
    </button>
  );
}

const styles = {
  button: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};
