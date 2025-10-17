import CityConfig from '../models/CityConfig.js';

// @desc    Get all city configurations
// @route   GET /api/config
// @access  Private/Admin
export const getAllConfigs = async (req, res) => {
    try {
        const configs = await CityConfig.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(configs);
    } catch (error) {
        console.error('Get Configs Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active city configuration
// @route   GET /api/config/:cityId
// @access  Private/Admin
export const getActiveConfig = async (req, res) => {
    try {
        const config = await CityConfig.findOne({ 
            cityId: req.params.cityId,
            isActive: true 
        }).populate('createdBy', 'name email');

        if (!config) {
            return res.status(404).json({ message: 'No active configuration found' });
        }

        res.json(config);
    } catch (error) {
        console.error('Get Active Config Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new city configuration
// @route   POST /api/config
// @access  Private/Admin
export const createConfig = async (req, res) => {
    try {
        // Validate configuration
        const validationResult = validateConfig(req.body);
        if (!validationResult.isValid) {
            return res.status(400).json({ 
                message: 'Invalid configuration',
                errors: validationResult.errors 
            });
        }

        // Check if cityId exists
        const existingConfig = await CityConfig.findOne({ 
            cityId: req.body.cityId,
            isActive: true 
        });

        if (existingConfig) {
            // Deactivate old config
            existingConfig.isActive = false;
            await existingConfig.save();
        }

        // Create new config
        const config = new CityConfig({
            ...req.body,
            createdBy: req.user._id,
            version: existingConfig ? existingConfig.version + 1 : 1
        });

        await config.save();

        res.status(201).json(config);
    } catch (error) {
        console.error('Create Config Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update city configuration
// @route   PUT /api/config/:cityId
// @access  Private/Admin
export const updateConfig = async (req, res) => {
    try {
        const config = await CityConfig.findOne({ 
            cityId: req.params.cityId,
            isActive: true 
        });

        if (!config) {
            return res.status(404).json({ message: 'Configuration not found' });
        }

        // Validate new configuration
        const validationResult = validateConfig(req.body);
        if (!validationResult.isValid) {
            return res.status(400).json({ 
                message: 'Invalid configuration',
                errors: validationResult.errors 
            });
        }

        // Create new version
        const newConfig = new CityConfig({
            ...req.body,
            cityId: config.cityId,
            createdBy: req.user._id,
            version: config.version + 1
        });

        // Deactivate old config
        config.isActive = false;
        await config.save();

        // Save new config
        await newConfig.save();

        res.json(newConfig);
    } catch (error) {
        console.error('Update Config Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get configuration version history
// @route   GET /api/config/city/:cityId/versions
// @access  Private/Admin
export const getConfigVersions = async (req, res) => {
    try {
        const versions = await CityConfig.find({ cityId: req.params.cityId })
            .populate('createdBy', 'name email')
            .sort({ version: -1 });

        res.json(versions);
    } catch (error) {
        console.error('Get Versions Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete city configuration
// @route   DELETE /api/config/:id
// @access  Private/Admin
export const deleteConfig = async (req, res) => {
    try {
        const config = await CityConfig.findById(req.params.id);

        if (!config) {
            return res.status(404).json({ message: 'Configuration not found' });
        }

        await CityConfig.findByIdAndDelete(req.params.id);

        res.json({ message: 'Configuration deleted successfully' });
    } catch (error) {
        console.error('Delete Config Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle configuration active status
// @route   PATCH /api/config/:id
// @access  Private/Admin
export const toggleConfigActive = async (req, res) => {
    try {
        const config = await CityConfig.findById(req.params.id);

        if (!config) {
            return res.status(404).json({ message: 'Configuration not found' });
        }

        config.isActive = req.body.isActive;
        await config.save();

        res.json(config);
    } catch (error) {
        console.error('Toggle Config Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Validation helper
const validateConfig = (config) => {
    const errors = [];
    
    // Required fields
    if (!config.cityName || config.cityName.trim() === '') {
        errors.push('City name is required');
    }

    if (!config.wasteTypes || config.wasteTypes.length === 0) {
        errors.push('At least one waste type is required');
    }

    // Numeric validations
    if (config.baseRate < 0) {
        errors.push('Base rate cannot be negative');
    }

    if (config.recyclingCredit < 0) {
        errors.push('Recycling credit cannot be negative');
    }

    // Pickup frequency validation
    if (!config.pickupFrequency || Object.keys(config.pickupFrequency).length === 0) {
        errors.push('At least one zone pickup frequency is required');
    }

    // Valid pricing model
    if (!['flat', 'weight-based'].includes(config.pricingModel)) {
        errors.push('Invalid pricing model');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export default {
    getAllConfigs,
    getActiveConfig,
    createConfig,
    updateConfig,
    getConfigVersions,
    deleteConfig,
    toggleConfigActive
};