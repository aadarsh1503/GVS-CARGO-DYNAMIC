const express = require('express');
const router = express.Router();
const {
    getAllRegions,
    getContentByRegionCode,
    createRegionWithContent,
    updateContentByRegionCode,
    deleteRegionByCode
} = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');

// --- Public Routes ---
// Get all available regions for the dropdown
router.get('/regions', getAllRegions);
// Get the content for a specific region
router.get('/content/:regionCode', getContentByRegionCode);

// --- Admin/Protected Routes ---
// Add a new region and its content
router.post('/regions', protect, createRegionWithContent);
// Update a region's content
router.put('/content/:regionCode', protect, updateContentByRegionCode);


router.delete('/regions/:regionCode', protect, deleteRegionByCode); 

module.exports = router;