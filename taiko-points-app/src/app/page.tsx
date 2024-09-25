"use client"
import { SetStateAction, useState } from 'react';
import ConnectWallet from '../../components/ ConnectWallet';
import axios from 'axios';

export default function Home() {
  const [userAddress, setUserAddress] = useState('');
  const [points, setPoints] = useState(null);
  const [error, setError] = useState('');

  // Handle wallet connection from ConnectWallet component
  const handleWalletConnected = (walletAddress: SetStateAction<string>) => {
    setUserAddress(walletAddress);
  };

  // Fetch points from GitHub JSON
  const fetchPoints = async () => {
    setError('');
    setPoints(null);

    if (!userAddress) {
      setError('Please enter a valid wallet address');
      return;
    }

    try {
      const response = await axios.get(
        'https://raw.githubusercontent.com/chimmykk/Taiko-Integration/refs/heads/main/data/points.json'
      );

      const data = response.data;
      let foundScore = null;

      // Search through the items array for matching address
      for (const entry of data) {
        for (const item of entry.items) {
          if (item.address.toLowerCase() === userAddress.toLowerCase()) {
            foundScore = item.totalScore;
            break;
          }
        }
        if (foundScore !== null) break;
      }

      if (foundScore !== null) {
        setPoints(foundScore);
      } else {
        setError('Address not found');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch points');
    }
  };

  return (
    <div styles={styles.container}>
      
      <h1>Taiko Points Fetcher</h1>
      
      {/* MetaMask Connect */}
      <ConnectWallet onWalletConnected={handleWalletConnected} />
      
      {/* Wallet Address Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter wallet address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchPoints} style={styles.button}>
          Fetch Points
        </button>
      </div>
      
      {/* Display Points or Error */}
      {error && <p style={styles.error}>{error}</p>}
      {points !== null && (
        <p style={styles.points}>
          Total Points: {points}
        </p>
      )}
    </div>
  );
}

// Styling for UI components
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#ffffff', // Background white for contrast
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '16px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '20px',
    alignItems: 'center',
  },
  input: {
    padding: '12px',
    marginRight: '10px',
    borderRadius: '8px',
    border: '2px solid #ccc',
    width: '320px',
    fontSize: '16px',
    color: 'black', // Ensure input text is visible
  },
  error: {
    color: 'red',
    marginTop: '20px',
    fontSize: '18px',
  },
  points: {
    marginTop: '20px',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333', // Dark color for points visibility
  },
};
