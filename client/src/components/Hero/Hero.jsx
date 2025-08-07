import React from 'react';
import Cards from '../Cards/Cards';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
// Importing all necessary icons, including the new ones for animation
import { FaMapMarkedAlt, FaGlobeAfrica, FaBoxOpen, FaAnchor, FaShippingFast, FaPlane } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link for better routing

import "./Hero.css";
import OurServices from '../OurServices/OurServices';
import Weperate from '../Weperate/Weperate';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import i1 from "./i1.jpg";
import i2 from "./i2.jpg";
import i3 from "./i3.jpg";
import i4 from "./i4.png";
import i5 from "./i5.jpg";

const images = [i1, i2, i3, i4, i5];

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const sliderRef = useRef(null);

  const preloadImages = (images) => {
    let loadedImages = 0;
    const totalImages = images.length;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages += 1;
        if (loadedImages === totalImages) {
          setIsLoaded(true);
        }
      };
    });
  };

  useEffect(() => {
    preloadImages(images);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    beforeChange: (current, next) => {
      if (sliderRef.current) {
        sliderRef.current.slickGoTo(next);
      }
    },
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
      { breakpoint: 360, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div>
      <style>{`
        /* --- Styles for the NEW sexy info section --- */
        @keyframes float-animation {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .info-section-bg {
          background-color: #f9fafb; /* A soft, very light grey */
          background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .animated-logistics-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
        }

        .floating-icon {
          position: absolute;
          color: rgba(0, 0, 0, 0.121); /* Very subtle to not be distracting */
          animation: float-animation 10s infinite ease-in-out;
        }
        
        .info-image-container {
          animation: float-animation 8s infinite ease-in-out;
          /* Futuristic octagonal shape */
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
        }
        
        .info-contact-btn {
            background-color: #F59E0B; /* Your DarkYellow color */
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }
        .info-contact-btn:hover {
            background-color: #D97706; /* A darker shade for hover */
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }
      `}</style>
      
      {/* === THIS SLIDER SECTION IS UNCHANGED === */}
      <div className="mx-auto min-h-screen relative">
        {isLoaded ? (
          <Slider ref={sliderRef} {...settings} className="image-container1">
            {images.map((src, index) => (
              <div key={index} className="slide-item1">
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="slide-image fade-in"
                  style={{ height: '100vh', objectFit: 'cover' }}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div></div>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white font-roboto font-bold bg-black bg-opacity-40">
          <h1 className="lg:text-6xl text-5xl py-4">WE SEND FOR YOU!</h1>
          <h2 className="lg:text-2xl text-xl flex items-center mt-4">
            <FontAwesomeIcon icon={faAngleDoubleRight} className="text-lg text-DarkYellow mx-2" />
            Air <FontAwesomeIcon icon={faAngleDoubleRight} className="text-lg text-DarkYellow mx-2" />
            Road <FontAwesomeIcon icon={faAngleDoubleRight} className="text-lg text-DarkYellow mx-2" />
            Sea
          </h2>
        </div>
      </div>

      {/* === THIS IS THE NEW, SEXY, ANIMATED SECTION === */}
      <section className="info-section-bg relative flex items-center justify-center py-24 px-6 overflow-hidden">
        
        {/* Animated Background Icons */}
        <div className="animated-logistics-bg">
            <FaPlane className="floating-icon" style={{ fontSize: '6rem', top: '5%', left: '5%', animationDelay: '-2s', animationDuration: '12s' }} />
            <FaAnchor className="floating-icon" style={{ fontSize: '7rem', top: '50%', right: '5%', animationDelay: '-5s', animationDuration: '18s' }} />
            {/* <FaBoxOpen className="floating-icon" style={{ fontSize: '7rem', top: '50%', right: '5%', animationDelay: '-5s', animationDuration: '18s' }} /> */}
            <FaShippingFast className="floating-icon" style={{ fontSize: '4rem', top: '20%', right: '25%', animationDelay: '-8s', animationDuration: '10s' }} />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Left Column: Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-800">
              GVS Cargo, <br/> Perfected by <span className="text-amber-500">Experience</span>.
            </h2>
            <p className="text-gray-600 font-roboto leading-relaxed text-lg">
              Founded by professionals with extensive experience, GVS Cargo & Logistics operates in all segments of foreign trade, executing each stage of the logistics process with unparalleled professionalism and competence on all continents.
            </p>
            <Link to='/contactUs'>
              <button className="info-contact-btn text-white font-semibold px-8 py-3 rounded-full mt-4">
                Connect With Us
              </button>
            </Link>
          </div>
          
          {/* Right Column: Image */}
          <div className="flex justify-center">
            <div className="info-image-container relative w-80 h-80 md:w-96 md:h-96 shadow-2xl">
              <img src="https://avatars.mds.yandex.net/i?id=5dd83667a01e12c7c3b4639b0b93ad77_l-5869613-images-thumbs&ref=rim&n=13&w=1280&h=800" alt="Shipping Illustration" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Other components remain unchanged */}
      <Cards />
      <Weperate />
      <OurServices />
    </div>
  )
}

export default Hero;