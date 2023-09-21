import express from 'express';
import user from './auth';

const router = express.Router();

router.route('/').get((req, res) => res.send('Welcome to Kickstart API.'));
router.get('/health', (req, res) => res.send('I am healthy'));

// Routes
router.use('/auth', user);

export default router;
