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
          const response = await fetch('https://gvs-cargo-dynamic.onrender.com/api/detect-region');
          const data = await response.json();
          const detectedCountryCode = data.countryCode; 

         
          const countryToRegionCodeMap = {
              'BH': 'bahrain',
              'AE': 'uae',
              'SA': 'ksa',
              'IN': 'india', 
              'SG': 'singapore',
          };
          
          const potentialRegionCode = countryToRegionCodeMap[detectedCountryCode];

          
          const isValidRegion = regionsData.find(r => r.code === potentialRegionCode);
          
          let finalRegion = 'bahrain'; 
          if (isValidRegion) {
            finalRegion = potentialRegionCode; 
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

  
  const handleSetRegion = async (newRegion) => {
    setIsLoading(true);
    sessionStorage.setItem('userSelectedRegion', newRegion);
    await fetchContentForRegion(newRegion);
  
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