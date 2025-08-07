import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaGlobe, FaMapMarkerAlt, FaPhone, FaWhatsapp, FaLinkedin, FaInstagram, FaFacebook, FaTwitter,
    FaSave, FaArrowLeft, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaEnvelope // Import FaEnvelope
} from 'react-icons/fa';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const API_URL = 'http://localhost:5000/api';

// --- (1) ADD icons for the new email fields ---
const fieldIcons = {
    address: <FaMapMarkerAlt className="h-5 w-5" />,
    phone: <FaPhone className="h-5 w-5" />,
    whatsapp: <FaWhatsapp className="h-5 w-5" />,
    email_customer_care: <FaEnvelope className="h-5 w-5" />, // New
    email_sales: <FaEnvelope className="h-5 w-5" />,         // New
    email_business: <FaEnvelope className="h-5 w-5" />,      // New
    social_linkedin: <FaLinkedin className="h-5 w-5" />,
    social_instagram: <FaInstagram className="h-5 w-5" />,
    social_facebook: <FaFacebook className="h-5 w-5" />,
    social_twitter: <FaTwitter className="h-5 w-5" />,
    local_modal_map_src: <FaGlobe className="h-5 w-5" />,
};

const FuturisticLoader = ({ regionCode }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="relative">
            <div className="w-24 h-24 border-4 border-[#243670]/20 rounded-full"></div>
            <div className="w-24 h-24 border-t-4 border-b-4 border-[#F59E0B] rounded-full absolute top-0 animate-spin"></div>
        </div>
        <p className="mt-6 text-xl text-[#243670] tracking-widest font-light">LOADING {regionCode.toUpperCase()}...</p>
    </div>
);

const RegionEditForm = () => {
    const { regionCode } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [regionName, setRegionName] = useState('');

    const fetchContent = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/content/${regionCode}`);
            if (!response.ok) throw new Error('Failed to fetch content');
            const data = await response.json();
            setRegionName(data.name);
            if (data.address && Array.isArray(data.address)) {
                data.address = data.address.join('\n');
            }
            setContent(data);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [regionCode]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value, name) => {
        setContent(prevContent => ({ ...prevContent, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        
        const token = localStorage.getItem('adminToken');
        const submissionData = { ...content };
        if (submissionData.address) {
            submissionData.address = submissionData.address.split('\n').filter(line => line.trim() !== '');
        }
        
        const fieldsToDelete = ['id', 'region_id', 'name', 'code', 'country_flag', 'updated_at', 'welcome_message', 'operate_heading', 'local_button_text', 'global_button_text', 'local_modal_title', 'local_modal_description', 'global_modal_title', 'global_modal_description', 'close_button_text', 'operate_in_country_title', 'operate_in_country_desc'];
        fieldsToDelete.forEach(field => delete submissionData[field]);

        try {
            const response = await fetch(`${API_URL}/content/${regionCode}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to update content');
            }
            const result = await response.json();
            setMessage(result.message);
            setTimeout(() => setMessage(''), 4000);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- (2) ADD new email fields to the array of editable fields ---
    const editableFields = [
        'address', 'phone', 'whatsapp', 
        'email_customer_care', 'email_sales', 'email_business', // New
        'social_linkedin', 'social_instagram',
        'social_facebook', 'social_twitter', 'local_modal_map_src'
    ];
    
    const baseInputClass = "w-full bg-slate-50 border-2 border-transparent rounded-lg outline-none transition-all duration-300 placeholder-slate-400 text-[#243670] focus:bg-white focus:border-[#F59E0B]";

    if (isLoading) return <FuturisticLoader regionCode={regionCode} />;
    if (!content) return (
        <div className="flex items-center justify-center h-screen bg-slate-50 text-[#243670]">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <FaExclamationTriangle className="inline-block mr-4 text-red-500 h-8 w-8" />
                <h2 className="text-2xl font-bold">Data Stream Not Found</h2>
                <p className="text-slate-500 mt-2">Could not retrieve data for region code: {regionCode.toUpperCase()}</p>
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl shadow-blue-900/10">
                <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-[#243670]">Edit Region</h1>
                        <p className="text-slate-500 mt-2 text-lg">Modifying data stream for <span className="font-semibold text-[#243670]">{regionName}</span></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                        {editableFields.map(key => {
                            const isTextArea = key === 'address';
                            const isPhoneField = key === 'phone' || key === 'whatsapp';
                            const isEmailField = key.startsWith('email_');

                            if (isPhoneField) {
                                return (
                                    <div className='relative z-10' key={key}>
                                        <label className="absolute -top-2.5 left-3 text-xs bg-white/70 px-1 text-slate-500">{key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
                                        <PhoneInput
                                            country={'us'} 
                                            value={content[key] || ''}
                                            onChange={(value) => handlePhoneChange(value, key)}
                                            inputClass={`${baseInputClass} h-14 pr-4`} 
                                        />
                                    </div>
                                );
                            }
                            
                            return (
                                <div key={key} className={`relative ${isTextArea ? 'md:col-span-2' : ''}`}>
                                    <div className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 pointer-events-none z-10">
                                        {fieldIcons[key] || <FaGlobe />}
                                    </div>
                                    {isTextArea ? (
                                        <textarea
                                            name={key}
                                            value={content[key] || ''}
                                            onChange={handleChange}
                                            placeholder={`Enter ${key.replace(/_/g, ' ')}...`}
                                            rows="5"
                                            className={`${baseInputClass} pl-12 pr-4 py-3`}
                                        />
                                    ) : (
                                        <input
                                            type={isEmailField ? 'email' : 'text'}
                                            name={key}
                                            value={content[key] || ''}
                                            onChange={handleChange}
                                            placeholder={`Enter ${key.replace(/_/g, ' ')}...`}
                                            className={`${baseInputClass} h-14 pl-12 pr-4`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4 border-t border-slate-200">
                        <button type="button" onClick={() => navigate('/admin/dashboard')} 
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-slate-300 text-slate-600 rounded-lg font-semibold hover:border-[#243670] hover:text-[#243670] transition-all duration-300">
                            <FaArrowLeft />
                            Back to Dashboard
                        </button>
                         <button type="submit" disabled={isSaving} 
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-[#243670] text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100">
                            {isSaving ? (
                                <><FaSpinner className="animate-spin" /><span>Saving...</span></>
                            ) : (
                                <><FaSave /><span>Save Changes</span></>
                            )}
                        </button>
                    </div>

                    {message && (
                        <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 text-sm font-medium transition-opacity duration-300
                            ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800'}`}>
                            {message.startsWith('Error') ? <FaExclamationTriangle /> : <FaCheckCircle />}
                            <span>{message}</span>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegionEditForm;