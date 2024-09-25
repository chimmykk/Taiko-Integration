"use client";
import { SetStateAction, useState } from 'react';
import ConnectWallet from '../../components/ ConnectWallet';
import axios from 'axios';

export default function Home() {
  const [userAddress, setUserAddress] = useState('');
  const [points, setPoints] = useState<number | null>(null);
  const [taikoPoints, setTaikoPoints] = useState<number | null>(null);
  const [integratedPoints, setIntegratedPoints] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleWalletConnected = (walletAddress: SetStateAction<string>) => {
    setUserAddress(walletAddress);
  };

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

  const fetchTaikoPoints = async () => {
    setError('');
    setTaikoPoints(null);

    if (!userAddress) {
      setError('Please enter a valid wallet address');
      return;
    }

    try {
      const response = await axios.get(
        'https://taiko-integration.vercel.app/api/getmintpadpoints'
      );

      const data = response.data;
      let foundScore = null;

      for (const item of data) {
        if (item.holder.toLowerCase() === userAddress.toLowerCase()) {
          foundScore = item.points;
          break;
        }
      }

      if (foundScore !== null) {
        setTaikoPoints(foundScore);
      } else {
        setError('Address not found in Taiko Trailblazers');
      }
    } catch (err) {
      console.error('Error fetching data from Taiko Trailblazers:', err);
      setError('Failed to fetch Taiko points');
    }
  };

  const integratePoints = () => {
    if (points !== null && taikoPoints !== null) {
      setIntegratedPoints(points + taikoPoints);
    } else {
      setError('Please fetch both points before integrating.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Taiko Points Aggregator</h1>
      <ConnectWallet onWalletConnected={handleWalletConnected} />
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter wallet address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchPoints} style={styles.button}>
          Fetch Points From TaikoTrailblazer Official
        </button>
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter wallet address to Fetch points "
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchTaikoPoints} style={styles.button}>
          Fetch Points From Taiko Trailblazers By Mintpad.co
        </button>
      </div>
      <div style={styles.inputContainer}>
        <button onClick={integratePoints} style={styles.button}>
          Integrate Points
        </button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {points !== null && (
        <p style={styles.points}>
          Total Points From TaikoTrailblazer Official: {points}
        </p>
      )}
      {taikoPoints !== null && (
        <p style={styles.points}>
          Total Points From Taiko Trailblazers by Mintpad: {taikoPoints}
        </p>
      )}
      {integratedPoints !== null && (
        <p style={styles.points}>
          Integrated Total Points: {integratedPoints}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: 'black',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  } as React.CSSProperties,
  button: {
    padding: '12px 24px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '220px', // Fixed width for better alignment
    marginLeft: '10px', // Add margin to separate from the input field
  } as React.CSSProperties,
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Full width of container
    maxWidth: '600px', // Set a max-width for better alignment
    marginTop: '20px',
  } as React.CSSProperties,
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #ccc',
    width: '70%', // Width adjusted for input
    fontSize: '16px',
    color: 'black',
  } as React.CSSProperties,
  error: {
    color: 'red',
    marginTop: '20px',
    fontSize: '18px',
    textAlign: 'center', // Center error message
  } as React.CSSProperties,
  points: {
    marginTop: '20px',
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white', // Updated to stand out on black background
    textAlign: 'center', // Center points text
  } as React.CSSProperties,
};
