import React, { createContext, useState, useContext, useEffect } from 'react';

const RegionContext = createContext();

// The base URL for your backend API
const API_URL = 'https://gvs-cargo-dynamic.onrender.com/api';

export const RegionProvider = ({ children }) => {
  const [region, setRegion] = useState('bahrain'); // Default region code
  const [content, setContent] = useState(null); // Will hold all dynamic content from API
  const [isLoading, setIsLoading] = useState(true);
  const [availableRegions, setAvailableRegions] = useState([]); // For the dropdown

  // Function to fetch content for a given region code
  const fetchContentForRegion = async (regionCode) => {
    try {
      const response = await fetch(`${API_URL}/content/${regionCode}`);
      if (!response.ok) {
        console.warn(`Content for '${regionCode}' not found. Falling back to Bahrain.`);
        if (regionCode !== 'bahrain') {
          return fetchContentForRegion('bahrain');
        }
        throw new Error('Fallback content (Bahrain) also not found.');
      }
      const data = await response.json();
      setContent(data);
      setRegion(data.code); // Ensure the state reflects the successfully fetched region
    } catch (error) {
      console.error("Failed to fetch content:", error);
      setContent(null); // Set content to null on failure
    }
  };

  // Effect to detect region on initial load
  useEffect(() => {
    const initializeRegion = async () => {
      setIsLoading(true);

      // --- KEY CHANGE 1: Fetch available regions FIRST ---
      let regionsData = [];
      try {
        const regionsResponse = await fetch(`${API_URL}/regions`);
        regionsData = await regionsResponse.json();
        setAvailableRegions(regionsData);
      } catch (error) {
        console.error("Could not fetch available regions:", error);
        // We can continue, but IP detection might fail to match.
      }

      // --- Check for a user's manual selection first ---
      const sessionRegion = sessionStorage.getItem('userSelectedRegion');
      if (sessionRegion) {
        setRegion(sessionRegion);
        await fetchContentForRegion(sessionRegion);
      } else {
        // --- KEY CHANGE 2: Improved IP Detection Logic ---
        try {
          const response = await fetch('http://ip-api.com/json');
          const data = await response.json();
          const detectedCountryCode = data.countryCode; // e.g., 'IN', 'SG', 'AE'

          // Convert country code to your app's region code format (e.g., 'IN' -> 'india')
          // Assuming your region codes are lowercase versions of country codes.
          // IMPORTANT: Adjust this map if your codes don't match country codes directly.
          const countryToRegionCodeMap = {
              'BH': 'bahrain',
              'AE': 'uae',
              'SA': 'ksa',
              'IN': 'india', // Add mappings for all your regions
              'SG': 'singapore',
          };
          
          const potentialRegionCode = countryToRegionCodeMap[detectedCountryCode];

          // Check if the detected region is one of your active regions
          const isValidRegion = regionsData.find(r => r.code === potentialRegionCode);
          
          let finalRegion = 'bahrain'; // Default fallback
          if (isValidRegion) {
            finalRegion = potentialRegionCode; // Use the valid detected region
            console.log(`IP detected region '${finalRegion}' which is valid.`);
          } else {
            console.log(`IP detected country '${detectedCountryCode}', but no matching region found. Defaulting to Bahrain.`);
          }

          setRegion(finalRegion);
          await fetchContentForRegion(finalRegion);

        } catch (error) {
          console.error("Could not detect region via IP, defaulting to Bahrain.", error);
          setRegion('bahrain');
          await fetchContentForRegion('bahrain');
        }
      }
      setIsLoading(false);
    };

    initializeRegion();
  }, []); // Empty dependency array, runs once on mount

  // This function is called when the user manually changes the region
  const handleSetRegion = async (newRegion) => {
    setIsLoading(true);
    sessionStorage.setItem('userSelectedRegion', newRegion);
    await fetchContentForRegion(newRegion);
    // The `setRegion` state update will be handled inside `fetchContentForRegion` on success
    setIsLoading(false);
  };

  return (
    <RegionContext.Provider value={{ region, setRegion: handleSetRegion, isLoading, content, availableRegions }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  return useContext(RegionContext);
};