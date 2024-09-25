import axios from 'axios';

export default async function handler(req, res) {
  try {

    const response = await axios.get('https://taiko-trailblazers.vercel.app/api/collector');
    
    const mintpadPoints = response.data;
    res.status(200).json(mintpadPoints);
  } catch (error) {
    console.error('Error fetching Mintpad points:', error);
    res.status(500).json({ message: 'Failed to fetch Mintpad points' });
  }
}

