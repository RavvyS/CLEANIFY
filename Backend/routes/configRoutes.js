import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
    getAllConfigs,
    getActiveConfig,
    createConfig,
    updateConfig,
    getConfigVersions
} from '../controllers/configController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

router.route('/')
    .get(getAllConfigs)
    .post(createConfig);

router.route('/:cityId')
    .get(getActiveConfig)
    .put(updateConfig);

router.get('/:cityId/versions', getConfigVersions);

export default router;