import Profile from '../models/Profile.js';

export const createProfile = async (req, res) => {
  const { name } = req.body;
  try {
    const profileExists = await Profile.findOne({ name });
    if (profileExists) {
      return res.status(400).json({ message: 'Profile already exists' });
    }
    const profile = await Profile.create({ name });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ name: 1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};