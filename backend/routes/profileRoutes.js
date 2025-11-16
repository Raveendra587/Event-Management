import express from 'express';
import { createProfile, getProfiles } from '../controllers/profileController.js';
const router = express.Router();

router.route('/').post(createProfile).get(getProfiles);

export default router;