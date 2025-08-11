import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaSpinner } from 'react-icons/fa';

import Select from 'react-select';
import countryList from 'react-select-country-list';
import countryFlagEmoji from 'country-flag-emoji';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const API_URL = 'https://gvs-cargo-dynamic.onrender.com/api';

const CreateRegionPage = () => {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [social_linkedin, setLinkedin] = useState('');
    const [social_instagram, setInstagram] = useState('');
    const [social_facebook, setFacebook] = useState('');
    const [social_twitter, setTwitter] = useState('');
    const [local_modal_map_src, setMapSrc] = useState('');

    // --- (1) NEW STATE for email fields ---
    const [email_customer_care, setEmailCustomerCare] = useState('');
    const [email_sales, setEmailSales] = useState('');
    const [email_business, setEmailBusiness] = useState('');


    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const countryOptions = useMemo(() => countryList().getData(), []);

    const handleCountryChange = (country) => {
        setSelectedCountry(country);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- MODIFICATION: VALIDATION - Only selectedCountry, address, phone, and whatsapp are mandatory now ---
        if (
            !selectedCountry ||
            !address.trim() ||
            !phone.trim() ||
            !whatsapp.trim()
        ) {
            setMessage('Error: Country, Address, Phone, and WhatsApp are mandatory. Please fill out these fields.');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        const token = localStorage.getItem('adminToken');
        
        // --- (2) ADD new email fields to the payload ---
        const payload = {
            name: selectedCountry.label,
            code: selectedCountry.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            country_flag: countryFlagEmoji.get(selectedCountry.value).emoji,
            address: address.split('\n').filter(line => line.trim() !== ''),
            phone, 
            whatsapp, 
            social_linkedin, 
            social_instagram,
            social_facebook, 
            social_twitter, 
            local_modal_map_src,
            email_customer_care, 
            email_sales,         
            email_business       
        };

        try {
            const response = await fetch(`${API_URL}/regions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create region.');
            
            navigate('/admin/dashboard');

        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-slate-50 border-2 border-transparent rounded-lg outline-none transition-all duration-300 placeholder-slate-400 text-[#243670] focus:bg-white focus:border-[#F59E0B] p-3";
    
    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl shadow-blue-900/10">
                <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-[#243670]">Create New Region</h1>
                        <p className="text-slate-500 mt-2 text-lg">Add a new data stream and its content.</p>
                    </div>

                    <div className="space-y-6">
                        <fieldset className="border border-slate-300 rounded-lg p-6">
                            <legend className="px-2 text-lg font-semibold text-[#243670]">Region Details</legend>
                            <div>
                                {/* Input Heading: Select Country/Region */}
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Select Country/Region</label>
                                <Select
                                    options={countryOptions}
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                    className="text-lg"
                                    placeholder="Search and select a country..."
                                    // This field is mandatory via JS validation in handleSubmit
                                />
                            </div>
                        </fieldset>

                        <fieldset className="border border-slate-300 rounded-lg p-6">
                            <legend className="px-2 text-lg font-semibold text-[#243670]">Contact & Content</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    {/* Input Heading: Address */}
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Address</label>
                                    <textarea placeholder="Enter full address, one line per line" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} rows="3" required></textarea>
                                </div>
                                
                                <div>
                                    {/* Input Heading: Phone */}
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Phone</label>
                                    <PhoneInput
                                        country={selectedCountry ? selectedCountry.value.toLowerCase() : 'us'}
                                        value={phone}
                                        onChange={setPhone}
                                        placeholder="Enter phone number..."
                                        inputClass={inputClass}
                                        // This field is mandatory via JS validation in handleSubmit
                                    />
                                </div>
                                
                                <div>
                                    {/* Input Heading: WhatsApp */}
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">WhatsApp</label>
                                    <PhoneInput
                                        country={selectedCountry ? selectedCountry.value.toLowerCase() : 'us'}
                                        value={whatsapp}
                                        onChange={setWhatsapp}
                                        placeholder="Enter WhatsApp number..."
                                        inputClass={inputClass}
                                        // This field is mandatory via JS validation in handleSubmit
                                    />
                                </div>

                                {/* --- (3) MODIFICATION: NEW JSX for email inputs (removed 'required') --- */}
                                <div>
                                    {/* Input Heading: Customer Care Email */}
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Customer Care Email</label>
                                    <input type="email" placeholder="care@example.com" value={email_customer_care} onChange={(e) => setEmailCustomerCare(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    {/* Input Heading: Sales Email */}
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Sales Email</label>
                                    <input type="email" placeholder="sales@example.com" value={email_sales} onChange={(e) => setEmailSales(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    {/* Input Heading: Business Email */}
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Business Email</label>
                                    <input type="email" placeholder="info@example.com" value={email_business} onChange={(e) => setEmailBusiness(e.target.value)} className={inputClass} />
                                </div>
                                
                                <div className='md:col-span-2 border-t pt-6 mt-2'>
                                    <h3 className='text-md font-semibold text-gray-500 mb-4 text-center'>Social Media Links</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            {/* Input Heading: LinkedIn URL */}
                                            <label className="block text-sm font-semibold text-gray-600 mb-2">LinkedIn URL</label>
                                            <input type="url" placeholder="https://linkedin.com/..." value={social_linkedin} onChange={(e) => setLinkedin(e.target.value)} className={inputClass} />
                                        </div>
                                        <div>
                                            {/* Input Heading: Instagram URL */}
                                            <label className="block text-sm font-semibold text-gray-600 mb-2">Instagram URL</label>
                                            <input type="url" placeholder="https://instagram.com/..." value={social_instagram} onChange={(e) => setInstagram(e.target.value)} className={inputClass} />
                                        </div>
                                        <div>
                                            {/* Input Heading: Facebook URL */}
                                            <label className="block text-sm font-semibold text-gray-600 mb-2">Facebook URL</label>
                                            <input type="url" placeholder="https://facebook.com/..." value={social_facebook} onChange={(e) => setFacebook(e.target.value)} className={inputClass} />
                                        </div>
                                        <div>
                                            {/* Input Heading: Twitter URL */}
                                            <label className="block text-sm font-semibold text-gray-600 mb-2">Twitter URL</label>
                                            <input type="url" placeholder="https://twitter.com/..." value={social_twitter} onChange={(e) => setTwitter(e.target.value)} className={inputClass} />
                                        </div>
                                        <div className="md:col-span-2">
                                            {/* Input Heading: Local Map Embed Source (URL) */}
                                            <label className="block text-sm font-semibold text-gray-600 mb-2">Local Map Embed Source (URL)</label>
                                            <input type="url" placeholder="Google Maps embed URL..." value={local_modal_map_src} onChange={(e) => setMapSrc(e.target.value)} className={inputClass} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    {message && <p className={`mt-4 font-mono text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4 border-t border-slate-200">
                        <button type="button" onClick={() => navigate('/admin/dashboard')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-slate-300 text-slate-600 rounded-lg font-semibold hover:border-[#243670] hover:text-[#243670] transition-all duration-300">
                            <FaArrowLeft />
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-[#243670] text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100">
                            {isSubmitting ? (
                                <><FaSpinner className="animate-spin" /><span>Creating...</span></>
                            ) : (
                                <><FaSave /><span>Create Region</span></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRegionPage;