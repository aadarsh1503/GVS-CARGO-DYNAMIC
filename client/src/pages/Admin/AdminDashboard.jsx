import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const [regions, setRegions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Modal state is no longer needed
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchRegions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/regions`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setRegions(data);
        } catch (error) {
            console.error('Failed to fetch regions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect now re-fetches data whenever the component is shown.
    // This ensures that after creating a new region and navigating back,
    // the new data is displayed.
    useEffect(() => {
        fetchRegions();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    // handleRegionAdded is no longer needed as the page reloads its own data.

    const handleDeleteRegion = async (regionCode, regionName) => {
        if (!window.confirm(`Are you sure you want to delete "${regionName}"? This action cannot be undone.`)) {
            return;
        }
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`${API_URL}/regions/${regionCode}`, {
                method: 'DELETE',
                headers: { 'Authorization': token },
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete region.');
            }
            setRegions(prevRegions => prevRegions.filter(region => region.code !== regionCode));
        } catch (error) {
            console.error('Deletion failed:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        // The AddRegionModal component is removed from here
        <div className="min-h-screen bg-[#F0F4F8] text-[#243670] p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-50" style={{
                backgroundImage: 'radial-gradient(#243670 0.5px, transparent 0.5px), radial-gradient(#243670 0.5px, #F0F4F8 0.5px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px'
            }}></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-16">
                    <div>
                        <h1 className="text-5xl font-light text-[#243670] tracking-widest uppercase">Dashboard</h1>
                        <p className="text-gray-500 mt-2">Holographic Content Management Interface v2.1</p>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="font-semibold text-amber-600 border-2 border-amber-500/50 px-5 py-2 rounded-lg hover:bg-amber-500 hover:text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
                    >
                        Logout
                    </button>
                </header>

                {isLoading ? (
                    <div className="text-center py-10">
                        <p className="text-lg text-gray-500">Loading data nodes...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {regions.map(region => (
                            <Link
                                key={region.code}
                                to={`/admin/edit/${region.code}`}
                                className="group relative block p-6 bg-white/60 backdrop-blur-xl border border-slate-300 rounded-xl shadow-lg shadow-blue-900/5 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 transform hover:-translate-y-2 transition-all duration-300 ease-in-out"
                            >
                                {/* --- Delete button --- */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteRegion(region.code, region.name);
                                    }}
                                    className="absolute top-3 right-3 z-10 p-1 rounded-full bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all duration-200"
                                    aria-label={`Delete ${region.name}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                
                                {/* Card Content */}
                                <div>
                                    <h2 className="text-2xl font-bold text-[#243670] truncate">
                                        <span className="text-3xl mr-3">{region.country_flag}</span>
                                        {region.name}
                                    </h2>
                                    <p className="text-gray-400 group-hover:text-amber-600 mt-2 font-mono text-sm transition-colors duration-300">
                                        code: {region.code}
                                    </p>
                                </div>
                            </Link>
                        ))}
                        
                        {/* --- MODIFIED: This is now a Link to the new page --- */}
                        <Link 
                            to="/admin/add-region"
                            className="group p-6 flex items-center justify-center bg-transparent border-2 border-dashed border-slate-400/70 rounded-xl hover:border-amber-500 hover:bg-white/40 cursor-pointer transform hover:-translate-y-2 backdrop-blur-sm transition-all duration-300 ease-in-out"
                        >
                            <span className="text-lg font-semibold text-slate-500 group-hover:text-amber-500 transition-colors duration-300">
                                + Add New Region
                            </span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;