import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
    getAllConfigs,
    getActiveConfig,
    createConfig,
    updateConfig,
    updateConfigById,
    getConfigVersions,
    deleteConfig,
    toggleConfigActive
} from '../controllers/configController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Test route to verify the router is working
router.get('/test', (req, res) => {
    res.json({ message: 'Config routes are working!' });
});

// More specific routes first
router.get('/city/:cityId/versions', getConfigVersions);
router.route('/city/:cityId')
    .get(getActiveConfig)
    .put(updateConfig);

// General routes
router.route('/')
    .get(getAllConfigs)
    .post(createConfig);

// ID-based routes last
router.route('/:id')
    .delete(deleteConfig)
    .patch(toggleConfigActive)
    .put(updateConfigById);

export default router;