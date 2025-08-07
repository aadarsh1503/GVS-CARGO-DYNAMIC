import React, { useState } from 'react';
import { FaLinkedin, FaInstagram, FaFacebook, FaChevronDown, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import g4 from './g4.png';
import white from './white.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

// Import the context hook
import { useRegion } from '../../context/RegionContext';

const Footer = () => {
  // Get content and the crucial isLoading state from the context
  const { content, isLoading } = useRegion();

  // State for the form (this is fine)
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  // handleSubscribe logic remains unchanged
  const handleSubscribe = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('list', 'I763763SovbXrHJQHGuQ9EYMDw'); 
      formData.append('subform', 'yes');
      formData.append('hp', '');

      await fetch('https://send.alzyara.com/subscribe', {
        method: 'POST', body: formData, mode: 'no-cors' });
      setMessage('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Subscription failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Guard clause to prevent rendering with incomplete data
  if (isLoading || !content) {
    return (
        <footer className="bg-DarkBlue text-gray-200 py-8">
            <div className="container mx-auto text-center">
                <p>© {new Date().getFullYear()} GVS Cargo & Logistics. All Rights Reserved.</p>
            </div>
        </footer>
    );
  }

  // It's now safe to render the full component.
  return (
    <footer className="bg-DarkBlue lg:h-[450px] text-gray-200 py-8">
      <div className="container mx-auto flex flex-col lg:flex-row max-w-7xl justify-between items-center px-4">

        {/* Left Section */}
        <div className="flex flex-col items-center lg:items-start mb-8 lg:mb-0">
          <img src={white} alt="GVS Cargo & Logistics" className="h-56 lg:-mb-8 mb-0 rounded-xl w-56" />
          <div className="flex space-x-6 mt-4">
            <a href={content.social_linkedin} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
              <FaLinkedin className="text-DarkBlue text-3xl" />
            </a>
            <a href={content.social_instagram} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
              <FaInstagram className="text-DarkBlue text-3xl" />
            </a>
            <a href={content.social_facebook} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
              <FaFacebook className="text-DarkBlue text-3xl" />
            </a>
            <a href={content.social_twitter} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
              <FontAwesomeIcon icon={faXTwitter} className="text-DarkBlue text-3xl" />
            </a>
          </div>
          <p className="mt-4 text-sm text-center lg:text-left">
            © {new Date().getFullYear()} GVS Cargo & Logistics. All Rights Reserved.
          </p>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col items-center lg:items-start space-y-4 mb-8 lg:mb-0">
          <div className="max-w-7xl mt-4 mx-auto">
            <h2 className="text-2xl font-semibold outline rounded-md outline-white text-center p-2">Get in Touch</h2>
            <div className="flex flex-col space-y-6 mt-6">
              <div className="flex items-start space-x-4">
                <FaMapMarkerAlt className="text-white mt-1" />
                <div>
                  {content.address && content.address.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}{index < content.address.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaPhoneAlt className="text-white mt-1" />
                <div>
                  <a href={`tel:${content.phone}`} className="hover:underline">{content.phone}</a>
                </div>
              </div>
              <div className="relative">
                <button onClick={toggleDropdown} className="flex items-center space-x-4 hover:underline focus:outline-none">
                  <FaEnvelope className="text-white" />
                  <span className='relative left-1'>Email</span>
                  <FaChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="absolute -right-6 top-0 mt-2 bg-white text-black p-3 font-sans rounded-lg shadow-lg z-10">
                    <ul className="space-y-2">
                        {/* --- DYNAMIC EMAIL CHANGES (FOOTER) --- */}
                        {content.email_customer_care && (
                            <li><a href={`mailto:${content.email_customer_care}`} className="hover:text-[#243670]">Customer Care</a></li>
                        )}
                        {content.email_sales && (
                            <li><a href={`mailto:${content.email_sales}`} className="hover:text-[#243670]">Sales Team</a></li>
                        )}
                        {content.email_business && (
                            <li><a href={`mailto:${content.email_business}`} className="hover:text-[#243670]">Business Enquiries</a></li>
                        )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - STATIC newsletter */}
        <div className="flex flex-col items-center lg:items-end">
          <div className="flex flex-col items-center lg:items-center mb-8">
            <p className="text-lg mb-8">Follow the news:</p>
            <form onSubmit={handleSubscribe} className="flex flex-col w-70 lg:w-96">
              <input type="email" placeholder="Enter your email" className="p-2 text-gray-800 w-full" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" className="bg-DarkYellow mt-2 hover:text-white text-gray-800 p-2 w-full rounded-full" disabled={loading}>
                {loading ? 'Submitting...' : 'Register'}
              </button>
              {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
            </form>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm mb-2 text-center">Developed and monitored by:</p>
            <a href="https://gvs-bh.com/" target="_blank" rel="noopener noreferrer">
              <img src={g4} alt="GVS IT Division" className="h-32 w-46 rounded-xl lg:w-38" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;