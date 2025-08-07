import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import './ContactUs.css';
import LocationSection from '../Map/Map';

const countryList = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic (Czechia)",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia (formerly Macedonia)",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
  // Add more countries as needed
];

const cache = new Map();

const fetchCitiesByCountry = async (country) => {
  if (cache.has(country)) {
    return cache.get(country);
  }

  // Predefined list of cities/ports for Bahrain
  const bahrainCities = [
    "Khalifa Bin Salman Port (KBSP) (Hidd)",
    "Mina Salman Port (Manama)",
    "Sitra Industrial Port (Sitra)",
    "Bahrain International Airport",
  ];

  // Predefined list of cities/ports for UAE
  const uaePorts = [
    "Jebel Ali Port (Dubai)",
    "Port Rashid (Dubai)",
    "Mina Zayed Port (Abu Dhabi)",
    "Khalifa Port (Abu Dhabi)",
    "Sharjah Port (Khalid Port) (Sharjah)",
    "Hamriyah Port (Sharjah)",
    "Fujairah Port (Fujairah)",
    "Port of Khor Fakkan (Sharjah)",
    "Ruwais Port (Abu Dhabi)",
    "Umm Al Quwain Port (Umm Al Quwain)",
    "Ajman Port (Ajman)",
    "Dubai International Airport (DXB)",
    "Al Maktoum International Airport (DWC)",
    "Abu Dhabi International Airport (AUH)",
    "Sharjah International Airport (SHJ)",
    "Ras Al Khaimah International Airport (RKT)",
  ];

  // Return predefined lists for Bahrain and UAE
  if (country === "Bahrain") {
    cache.set(country, bahrainCities);
    return bahrainCities;
  }

  if (country === "United Arab Emirates") {
    cache.set(country, uaePorts);
    return uaePorts;
  }

  // Fetch cities for other countries
  try {
    const response = await fetch(
      `https://countriesnow.space/api/v0.1/countries/cities`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      }
    );
    const data = await response.json();
    cache.set(country, data.data || []);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};


const ContactUs = () => {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    telephone: '',
    email: '',
    message: '',
    portOfLoading: '',
    portOfLoadingCity: '',
    portOfDischarge: '',
    portOfDischargeCity: '',
    commodity: '',
    grossWeight: '',
    weightUnit: 'kg', // Added field for weight unit
    dimensions: '',
    dimensionUnit: 'inch', // Existing dimension unit
    boxesPallets: '',
    boxPalletSize: '',
    boxPalletUnit: 'cm', // Added field for box/pallet size unit
    modeOfShipment: '',
    length: '',
    width: '',
    height: '',
  });

  const [countryCode, setCountryCode] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [uniqueId, setUniqueId] = useState('');
  const [loadingCities, setLoadingCities] = useState([]);
  const [dischargeCities, setDischargeCities] = useState([]);
  const [showLoaderForLoading, setShowLoaderForLoading] = useState(false);
  const [showSuccessForLoading, setShowSuccessForLoading] = useState(false);
  
  const [showLoaderForDischarge, setShowLoaderForDischarge] = useState(false);
  const [showSuccessForDischarge, setShowSuccessForDischarge] = useState(false);
  const [showLoaderForCity, setShowLoaderForCity] = useState(false);
  const [showSuccessForCity, setShowSuccessForCity] = useState(false);
  const [showLoaderForDischargeCity, setShowLoaderForDischargeCity] = useState(false);
  const [showSuccessForDischargeCity, setShowSuccessForDischargeCity] = useState(false);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await fetch('https://ipinfo.io/json?token=6b3f765fe8dfe5');
        const data = await response.json();
        const countryDialCode = getDialCodeByCountry(data.country);
        if (countryDialCode) setCountryCode(countryDialCode);
      } catch (error) {
        console.error('Error fetching geolocation:', error);
      }
    };

    fetchCountryCode();
  }, []);

  const getDialCodeByCountry = (countryCode) => {
    const dialCodeMap = {
      AD: '+376',
      AE: '+971',
      AF: '+93',  // Afghanistan
        AG: '+1-268', // Antigua and Barbuda
        AI: '+1-264', // Anguilla
        AL: '+355', // Albania
        AM: '+374', // Armenia
        AO: '+244', // Angola
        AQ: '+672', // Antarctica
        AR: '+54', // Argentina
        AS: '+1-684', // American Samoa
        AT: '+43', // Austria
        AU: '+61', // Australia
        AW: '+297', // Aruba
        AX: '+358-18', // Åland Islands
        AZ: '+994', // Azerbaijan
        BA: '+387', // Bosnia and Herzegovina
        BB: '+1-246', // Barbados
        BD: '+880', // Bangladesh
        BE: '+32', // Belgium
        BF: '+226', // Burkina Faso
        BG: '+359', // Bulgaria
        BH: '+973', // Bahrain
        BI: '+257', // Burundi
        BJ: '+229', // Benin
        BL: '+590', // Saint Barthélemy
        BM: '+1-441', // Bermuda
        BN: '+673', // Brunei
        BO: '+591', // Bolivia
        BQ: '+599', // Caribbean Netherlands
        BR: '+55', // Brazil
        BS: '+1-242', // Bahamas
        BT: '+975', // Bhutan
        BW: '+267', // Botswana
        BY: '+375', // Belarus
        BZ: '+501', // Belize
        CA: '+1',   // Canada
        CC: '+61',  // Cocos (Keeling) Islands
        CD: '+243', // DR Congo
        CF: '+236', // Central African Republic
        CG: '+242', // Republic of the Congo
        CH: '+41',  // Switzerland
        CI: '+225', // Côte d'Ivoire
        CK: '+682', // Cook Islands
        CL: '+56',  // Chile
        CM: '+237', // Cameroon
        CN: '+86',  // China
        CO: '+57',  // Colombia
        CR: '+506', // Costa Rica
        CU: '+53',  // Cuba
        CV: '+238', // Cape Verde
        CW: '+599', // Curaçao
        CX: '+61',  // Christmas Island
        CY: '+357', // Cyprus
        CZ: '+420', // Czech Republic
        DE: '+49',  // Germany
        DJ: '+253', // Djibouti
        DK: '+45',  // Denmark
        DM: '+1-767', // Dominica
        DO: '+1-809', // Dominican Republic
        DZ: '+213', // Algeria
        EC: '+593', // Ecuador
        EE: '+372', // Estonia
        EG: '+20',  // Egypt
        EH: '+212', // Western Sahara
        ER: '+291', // Eritrea
        ES: '+34',  // Spain
        ET: '+251', // Ethiopia
        FI: '+358', // Finland
        FJ: '+679', // Fiji
        FK: '+500', // Falkland Islands
        FM: '+691', // Micronesia
        FO: '+298', // Faroe Islands
        FR: '+33',  // France
        GA: '+241', // Gabon
        GB: '+44',  // United Kingdom
        GD: '+1-473', // Grenada
        GE: '+995', // Georgia
        GF: '+594', // French Guiana
        GG: '+44-1481', // Guernsey
        GH: '+233', // Ghana
        GI: '+350', // Gibraltar
        GL: '+299', // Greenland
        GM: '+220', // Gambia
        GN: '+224', // Guinea
        GP: '+590', // Guadeloupe
        GQ: '+240', // Equatorial Guinea
        GR: '+30',  // Greece
        GT: '+502', // Guatemala
        GU: '+1-671', // Guam
        GW: '+245', // Guinea-Bissau
        GY: '+592', // Guyana
        HK: '+852', // Hong Kong
        HN: '+504', // Honduras
        HR: '+385', // Croatia
        HT: '+509', // Haiti
        HU: '+36',  // Hungary
        ID: '+62',  // Indonesia
        IE: '+353', // Ireland
        IL: '+972', // Israel
        IM: '+44-1624', // Isle of Man
        IN: '+91',  // India
        IO: '+246', // British Indian Ocean Territory
        IQ: '+964', // Iraq
        IR: '+98',  // Iran
        IS: '+354', // Iceland
        IT: '+39',  // Italy
        JE: '+44-1534', // Jersey
        JM: '+1-876', // Jamaica
        JO: '+962', // Jordan
        JP: '+81',  // Japan
        KE: '+254', // Kenya
        KG: '+996', // Kyrgyzstan
        KH: '+855', // Cambodia
        KI: '+686', // Kiribati
        KM: '+269', // Comoros
        KN: '+1-869', // Saint Kitts and Nevis
        KP: '+850', // North Korea
        KR: '+82',  // South Korea
        KW: '+965', // Kuwait
        KY: '+1-345', // Cayman Islands
        KZ: '+7',   // Kazakhstan
        LA: '+856', // Laos
        LB: '+961', // Lebanon
        LC: '+1-758', // Saint Lucia
        LI: '+423', // Liechtenstein
        LK: '+94',  // Sri Lanka
        LR: '+231', // Liberia
        LS: '+266', // Lesotho
        LT: '+370', // Lithuania
        LU: '+352', // Luxembourg
        LV: '+371', // Latvia
        LY: '+218', // Libya
        MA: '+212', // Morocco
        MC: '+377', // Monaco
        MD: '+373', // Moldova
        ME: '+382', // Montenegro
        MF: '+590', // Saint Martin
        MG: '+261', // Madagascar
        MH: '+692', // Marshall Islands
        MK: '+389', // North Macedonia
        ML: '+223', // Mali
        MM: '+95',  // Myanmar
        MN: '+976', // Mongolia
        MO: '+853', // Macau
        MP: '+1-670', // Northern Mariana Islands
        MQ: '+596', // Martinique
        MR: '+222', // Mauritania
        MS: '+1-664', // Montserrat
        MT: '+356', // Malta
        MU: '+230', // Mauritius
        MV: '+960', // Maldives
        MW: '+265', // Malawi
        MX: '+52',  // Mexico
        MY: '+60',  // Malaysia
        MZ: '+258', // Mozambique
        NA: '+264', // Namibia
        NC: '+687', // New Caledonia
        NE: '+227', // Niger
        NF: '+672', // Norfolk Island
        NG: '+234', // Nigeria
        NI: '+505', // Nicaragua
        NL: '+31',  // Netherlands
        NO: '+47',  // Norway
        NP: '+977', // Nepal
        NR: '+674', // Nauru
        NU: '+683', // Niue
        NZ: '+64',  // New Zealand
        OM: '+968', // Oman
        PA: '+507', // Panama
        PE: '+51',  // Peru
        PF: '+689', // French Polynesia
        PG: '+675', // Papua New Guinea
        PH: '+63',  // Philippines
        PK: '+92',  // Pakistan
        PL: '+48',  // Poland
        PM: '+508', // Saint Pierre and Miquelon
        PN: '+870', // Pitcairn Islands
        PR: '+1-787', // Puerto Rico
        PT: '+351', // Portugal
        PW: '+680', // Palau
        PY: '+595', // Paraguay
        QA: '+974', // Qatar
        RE: '+262', // Réunion
        RO: '+40',  // Romania
        RS: '+381', // Serbia
        RU: '+7',   // Russia
        RW: '+250', // Rwanda
        SA: '+966', // Saudi Arabia
        SB: '+677', // Solomon Islands
        SC: '+248', // Seychelles
        SD: '+249', // Sudan
        SE: '+46',  // Sweden
        SG: '+65',  // Singapore
        SH: '+290', // Saint Helena
        SI: '+386', // Slovenia
        SJ: '+47',  // Svalbard and Jan Mayen
        SK: '+421', // Slovakia


      // Add more country codes as needed
    };
    return dialCodeMap[countryCode] || '+973';
  };

  const handleCountryChange = async (e, portType) => {
    const selectedCountry = e.target.value;
    setFormData((prev) => ({ ...prev, [portType]: selectedCountry }));
  
    if (selectedCountry) {
      if (portType === 'portOfLoading') {
        setShowLoaderForLoading(true);
        setShowSuccessForLoading(false); // Reset success message for portOfLoading
      }
  
      if (portType === 'portOfDischarge') {
        setShowLoaderForDischarge(true);
        setShowSuccessForDischarge(false); // Reset success message for portOfDischarge
      }
  
      // Fetch cities based on selected country
      const cities = await fetchCitiesByCountry(selectedCountry);
      
      // Set cities for corresponding port type
      if (portType === 'portOfLoading') setLoadingCities(cities);
      if (portType === 'portOfDischarge') setDischargeCities(cities);
      
      // Hide loader and show success message after 2 seconds for the corresponding port type
      setTimeout(() => {
        if (portType === 'portOfLoading') {
          setShowLoaderForLoading(false);
          setShowSuccessForLoading(true);
        }
  
        if (portType === 'portOfDischarge') {
          setShowLoaderForDischarge(false);
          setShowSuccessForDischarge(true);
        }
      }, 1000); // 2 seconds delay for animation
    }
  };
  const handleDischargeCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormData((prev) => ({ ...prev, portOfDischargeCity: selectedCity }));
  
    setShowLoaderForDischargeCity(true);
    setShowSuccessForDischargeCity(false);
  
    // Simulating API call
    setTimeout(() => {
      setShowLoaderForDischargeCity(false);
      setShowSuccessForDischargeCity(true);
    }, 1000); // Adjust the delay as needed
  };
  const handleCityChange = (e) => {
    const value = e.target.value;

    // Update form data
    setFormData((prevData) => ({ ...prevData, portOfLoadingCity: value }));

    // Show loader for city selection
    setShowLoaderForCity(true);
    setShowSuccessForCity(false);

    // Simulate API call
    setTimeout(() => {
      setShowLoaderForCity(false);
      setShowSuccessForCity(true);
    }, 2000); // Simulated delay of 2 seconds
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaValue) {
        alert("Please verify you're not a robot.");
        return;
    }

    if (!countryCode || !formData.telephone.trim()) {
        alert('Please make sure the country code and phone number are filled in.');
        return;
    }

    const shortId = uuidv4().split('-')[0];
    setUniqueId(shortId);

    setSuccessMessage(true);

    // Dynamically include form data in the email message
    const emailData = {
        to: "customercare@gvscargo.com",
        from: "customercare@gvscargo.com",
      
        subject: `Form Submission with ${formData.email}`,

        message: `
               Unique ID: ${shortId}
                Name: ${formData.name}
                Company: ${formData.company}
                Telephone: ${countryCode} ${formData.telephone}
                Email: ${formData.email}
                Port of Loading: ${formData.portOfLoading}, ${formData.portOfLoadingCity}
                Port of Discharge: ${formData.portOfDischarge}, ${formData.portOfDischargeCity}
                Commodity: ${formData.commodity}
                Weight: ${formData.grossWeight} ${formData.weightUnit}
                Dimensions: ${formData.length} ${formData.dimensionUnit} × ${formData.width} ${formData.dimensionUnit} × ${formData.height} ${formData.dimensionUnit}
                Box/Pallet Size: ${formData.boxPalletSize} ${formData.boxPalletUnit}
                Mode Of Shipment: ${formData.modeOfShipment}
                Message: ${formData.message}
          
        `, // Dynamically formatted HTML message
    };

    try {
        // Send email data (including form data in the message)
        const emailResponse = await fetch('https://gvscargo.com/send_to_a_mail.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData), // Send email data only
        });

        if (!emailResponse.ok) {
            throw new Error('Failed to send email');
        }

        // Reset all form-related states after submission
        setTimeout(() => {
            setSuccessMessage(false);

            // Reset form data
            setFormData({
                company: '',
                name: '',
                telephone: '',
                email: '',
                message: '',
                portOfLoading: '',
                portOfLoadingCity: '',
                portOfDischarge: '',
                portOfDischargeCity: '',
                commodity: '',
                grossWeight: '',
                weightUnit: 'kg',
                dimensions: '',
                dimensionUnit: 'inch',
                boxesPallets: '',
                boxPalletSize: '',
                boxPalletUnit: 'cm',
                modeOfShipment: '',
                length: '',
                width: '',
                height: '',
            });

            // Reset other states
            setRecaptchaValue(null);
            setUniqueId('');
            setLoadingCities([]);
            setDischargeCities([]);
            setShowLoaderForLoading(false);
            setShowSuccessForLoading(false);
            setShowLoaderForDischarge(false);
            setShowSuccessForDischarge(false);
            setShowLoaderForCity(false);
            setShowSuccessForCity(false);
            setShowLoaderForDischargeCity(false);
            setShowSuccessForDischargeCity(false);

            // Reset form inputs
            e.target.reset();
        }, 3000); // 3 seconds delay for success message
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting form');
        setSuccessMessage(false);
    }
};


  
  

  return (
    <div >
    <div className="lg:max-w-2xl max-w-md shadow-custom font-roboto mx-auto mt-12">
    {successMessage ? (
      <div className="success-message flex items-center bg-DarkBlue text-white p-4 rounded-lg shadow-lg">
        <AiOutlineCheckCircle className="checkmark text-5xl mr-4 animate-pulse" />
        <span className="text-lg font-semibold">
          Form submitted successfully! We'll get in touch with you shortly. Your reference ID is: {uniqueId}
        </span>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded space-y-4">
        <h2 className="text-2xl font-semibold text-left">Fill in the required fields*</h2>

        {/* Company Name */}
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company *"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none"
          required
        />

        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name *"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none"
          required
        />

        {/* Phone and Country Code */}
        <div className="flex mb-4 space-x-2">
          <div className="w-1/3">
            <PhoneInput
              country={'bh'}
              value={countryCode}
              onChange={(value) => setCountryCode(value || '+973')}
              placeholder="Select Country Code"
              inputStyle={{ width: '100%', height: '40px', border: '1px solid #D1D5DB', color: '#4B5563' }}
              required
            />
          </div>
          <div className="w-2/3">
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Phone Number *"
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
        </div>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="Email *" 
          className="w-full p-2 border border-gray-300 rounded focus:outline-none" 
          required 
        />

        {/* Port of Loading */}
        <div className="space-y-4">
      {/* Port of Loading Dropdown */}
      <div className="relative">
        <select
          name="portOfLoading"
          value={formData.portOfLoading}
          onChange={(e) => handleCountryChange(e, "portOfLoading")}
          className="w-full p-2 border font-roboto border-gray-300 rounded focus:outline-none"
          required
        >
          <option value="" disabled>
            Select Country For Port of Loading *
          </option>
          {countryList.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>

        {showLoaderForLoading ? (
          <div className="absolute top-3 right-4">
            <div className="animate-spin border-2 border-t-transparent border-green-500 rounded-full w-5 h-5"></div>
          </div>
        ) : showSuccessForLoading && (
          <div className="absolute top-3 right-4 text-green-500 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm">Looks good</span>
          </div>
        )}
      </div>

      {/* Port of Loading City Dropdown */}
      <div className="relative">
        <select
          name="portOfLoadingCity"
          value={formData.portOfLoadingCity}
          onChange={handleCityChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none"
          required
        >
          <option value="" disabled>
            Select City for Port of Loading *
          </option>
          {loadingCities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        {showLoaderForCity ? (
          <div className="absolute top-3 right-4">
            <div className="animate-spin border-2 border-t-transparent border-green-500 rounded-full w-5 h-5"></div>
          </div>
        ) : showSuccessForCity && (
          <div className="absolute top-3 right-4 text-green-500 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm">Looks good</span>
          </div>
        )}
      </div>
    </div>

      {/* Port of Discharge */}
      <div className="space-y-4">
  {/* Port of Discharge Country Dropdown */}
  <div className="relative">
    <select
      name="portOfDischarge"
      value={formData.portOfDischarge}
      onChange={(e) => handleCountryChange(e, 'portOfDischarge')}
      className="w-full p-2 border font-roboto border-gray-300 rounded focus:outline-none"
      required
    >
      <option value="" disabled>
        Select Country For Port of Discharge *
      </option>
      {countryList.map((country, index) => (
        <option key={index} value={country}>
          {country}
        </option>
      ))}
    </select>

    {showLoaderForDischarge ? (
      <div className="absolute top-3 right-4">
        <div className="animate-spin border-2 border-t-transparent border-green-500 rounded-full w-5 h-5"></div>
      </div>
    ) : showSuccessForDischarge && (
      <div className="absolute top-3 right-4 text-green-500 flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span className="text-sm">Looks good</span>
      </div>
    )}
  </div>

  {/* Port of Discharge City Dropdown */}
  <div className="relative">
    <select
      name="portOfDischargeCity"
      value={formData.portOfDischargeCity}
      onChange={handleDischargeCityChange}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none"
      required
    >
      <option value="" disabled>
        Select City for Port of Discharge *
      </option>
      {dischargeCities.map((city, index) => (
        <option key={index} value={city}>
          {city}
        </option>
      ))}
    </select>

    {showLoaderForDischargeCity ? (
      <div className="absolute top-3 right-4">
        <div className="animate-spin border-2 border-t-transparent border-green-500 rounded-full w-5 h-5"></div>
      </div>
    ) : showSuccessForDischargeCity && (
      <div className="absolute top-3 right-4 text-green-500 flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span className="text-sm">Looks good</span>
      </div>
    )}
  </div>
</div>
   
  
        <input 
          type="text" 
          name="commodity" 
          value={formData.commodity} 
          onChange={handleChange} 
          placeholder="Commodity" 
          className="w-full p-2 border border-gray-300 rounded focus:outline-none" 
          required 
        />
  
  <div className="space-y-2">
  <div className="flex space-x-4">
    <input
      type="text"
      name="grossWeight"
      value={formData.grossWeight}
      onChange={handleChange}
      placeholder="Gross Weight"
      className="w-2/3 p-2 border border-gray-300 rounded focus:outline-none"
      required
    />
    <select
      name="weightUnit"
      value={formData.weightUnit}
      onChange={handleChange}
      className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none"
      required
    >
      <option value="kg">Kilograms (kg)</option>
      <option value="tonnes">Tonnes (metric tons)</option>
      <option value="tons">Tons (US tons)</option>
      <option value="lbs">Pounds (lbs)</option>
    </select>
  </div>
</div>
  
        {/* Dimensions in One Row */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Dimensions</h3>
          <div className="flex items-center space-x-4">
            {/* Length Input */}
            <input
              type="text"
              name="length"
              value={formData.length}
              onChange={handleChange}
              placeholder="Length"
              className="w-20 p-2 border border-gray-300 rounded focus:outline-none"
              required
            />
            {/* Width Input */}
            <input
              type="text"
              name="width"
              value={formData.width}
              onChange={handleChange}
              placeholder="Width"
              className="w-20 p-2 border border-gray-300 rounded focus:outline-none"
              required
            />
            {/* Height Input */}
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Height"
              className="w-20 p-2 border border-gray-300 rounded focus:outline-none"
              required
            />
            {/* Unit Dropdown */}
            <select
              name="dimensionUnit"
              value={formData.dimensionUnit}
              onChange={handleChange}
              className="p-2 border hidden lg:block border-gray-300 rounded focus:outline-none text-gray-700"
              required
            >
              <option value="inch">Inch</option>
              <option value="cm">Centimeter</option>
            </select>
          </div>
        </div>
        <select
              name="dimensionUnit"
              value={formData.dimensionUnit}
              onChange={handleChange}
              className="p-1 border lg:hidden sm:block border-gray-300 rounded focus:outline-none text-gray-700"
              required
            >
              <option value="inch">Inch</option>
              <option value="cm">Centimeter</option>
            </select>
  
        <input 
          type="text" 
          name="boxesPallets" 
          value={formData.boxesPallets} 
          onChange={handleChange} 
          placeholder="Number of Boxes/Pallets" 
          className="w-full p-2 border border-gray-300 rounded focus:outline-none" 
          required 
        />
  
  <div className="space-y-2">
  <div className="flex space-x-4">
    <input
      type="text"
      name="boxPalletSize"
      value={formData.boxPalletSize}
      onChange={handleChange}
      placeholder="Size of Each Box/Pallet"
      className="w-2/3 p-2 border border-gray-300 rounded focus:outline-none"
      required
    />
    <select
      name="boxPalletUnit"
      value={formData.boxPalletUnit}
      onChange={handleChange}
      className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none"
      required
    >
      <option value="cm">Centimeters </option>
      <option value="inch">Inches</option>
      <option value="m">Meters </option>
      <option value="ft">Feet</option>
    </select>
  </div>
</div>
  
        {/* Mode of Shipment: Dropdown */}
        <select
          name="modeOfShipment"
          value={formData.modeOfShipment}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none text-gray-700"
          required
        >
          <option value="" disabled>
            Mode of Shipment (Select One) *
          </option>
          <option value="Commercial">Commercial</option>
          <option value="Personal">Personal</option>
        </select>
  
        <textarea 
          name="message" 
          value={formData.message} 
          onChange={handleChange} 
          placeholder="Message *" 
          className="w-full p-2 border border-gray-300 rounded focus:outline-none" 
          rows="4" 
          required 
        />
  
        <ReCAPTCHA sitekey="6LeqpnkqAAAAAHNUm3Ey9nv2T0hmhl0Ym4L_yaTS" onChange={(value) => setRecaptchaValue(value)} required />
  
        <button 
          type="submit" 
          className="w-full py-2 text-white bg-yellow-500 rounded font-semibold hover:bg-yellow-600"
        >
          Send
        </button>
      </form>
    )}
  

      

  </div>

  <LocationSection />

  </div>

  );
};

export default ContactUs;