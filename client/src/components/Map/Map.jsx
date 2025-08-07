import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:5000/api';

// A reusable card component for each location
const LocationCard = ({ location }) => {
    // Default to an empty array if address is not present
    const addressLines = location.address && Array.isArray(location.address) ? location.address : [];

    return (
        <div className="bg-white top-0 w-full max-w-[300px] shadow-custom rounded-lg overflow-hidden">
            <div className="relative z-10 bg-white p-6 rounded-t-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{location.name} Office</h2>
                <p className="text-gray-600 text-sm mb-4 h-16"> {/* Fixed height for alignment */}
                    <strong>Address:</strong> {addressLines.join(', ')}
                </p>
                <div className="flex flex-wrap gap-2">
                    <a href={`tel:${location.phone}`} className="bg-white p-2 rounded-full" title={`Call ${location.name} Office`}>
                        <FontAwesomeIcon icon={faPhone} className="text-DarkBlue text-3xl" />
                    </a>
                    <a href={location.social_linkedin} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
                        <FaLinkedin className="text-DarkBlue text-3xl" />
                    </a>
                    <a href={location.social_instagram} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
                        <FaInstagram className="text-DarkBlue text-3xl" />
                    </a>
                    <a href={location.social_facebook} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
                        <FaFacebook className="text-DarkBlue text-3xl" />
                    </a>
                    <a href={location.social_twitter} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
                        <FontAwesomeIcon icon={faXTwitter} className="text-DarkBlue text-3xl" />
                    </a>
                </div>
            </div>
            <div className="-mt-16">
                <a href={`https://www.google.com/maps?q=${addressLines.join(', ')}`} target="_blank" rel="noopener noreferrer" title="Open in Google Maps">
                    <iframe
                        className="w-full rounded-b-lg pointer-events-none"
                        src={location.local_modal_map_src}
                        width="100%" height="270" style={{ border: 0 }}
                        allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                        title={`Location Map ${location.name}`}
                    ></iframe>
                </a>
            </div>
        </div>
    );
};

function LocationSection() {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllLocations = async () => {
            try {
                // We'll fetch the content for each available region
                const regionsResponse = await fetch(`${API_URL}/regions`);
                const regionsData = await regionsResponse.json();

                // Promise.all allows us to fetch all content in parallel
                const locationPromises = regionsData.map(region =>
                    fetch(`${API_URL}/content/${region.code}`).then(res => res.json())
                );
                
                const locationsContent = await Promise.all(locationPromises);
                setLocations(locationsContent);

            } catch (error) {
                console.error("Failed to fetch locations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllLocations();
    }, []);

    if (isLoading) {
        return <div className="text-center p-10">Loading Locations...</div>;
    }

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center mt-10 mb-10 gap-8 p-4">
            {locations.map(loc => (
                <LocationCard key={loc.code} location={loc} />
            ))}
        </div>
    );
}

export default LocationSection;