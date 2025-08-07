// src/services/gvsApiService.js

import axios from 'axios';

// The API endpoint for your public offers list
const API_URL = 'https://cargo-backend-s9eg.onrender.com/api/excels'; // Or your production URL

const api = axios.create({
    baseURL: API_URL,
});

/**
 * Fetches the list of all published offers from the backend.
 * This is the ONLY function needed for the public gvscargo.com page.
 * Assumes the endpoint /list is public and requires no authentication.
 */
export const getOffers = () => api.get('/list');