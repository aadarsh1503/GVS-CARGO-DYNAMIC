import React, { useState, useEffect } from 'react';
import { FaMapMarkedAlt, FaGlobeAfrica, FaPlane } from 'react-icons/fa';
import newimage from "./newimage.png"; 

// Import the context hook
import { useRegion } from '../../context/RegionContext';

const Weperate = () => {
  // Get the content and loading state from the context
  const { content, isLoading } = useRegion();

  const [modalContentKey, setModalContentKey] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = (key) => {
    setModalContentKey(key);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setModalContentKey(null), 300); 
  };

  useEffect(() => {
    const bodyClass = 'overflow-hidden';
    if (isModalVisible) {
      document.body.classList.add(bodyClass);
    } else {
      document.body.classList.remove(bodyClass);
    }
    return () => document.body.classList.remove(bodyClass);
  }, [isModalVisible]);

  // Show a loading state until the content is fetched
  if (isLoading || !content) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* 
        The <style> block remains unchanged as it controls the design.
      */}
      <style>{`
        :root {
          --accent-color: #F59E0B;
          --accent-dark: #D97706;
          --text-dark: #1F2937;
        }
        @keyframes fly-straight { from { transform: translateX(-150px); } to { transform: translateX(120vw); } }
        @keyframes float-animation { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes gradient-pan { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .background-animation-container { position: absolute; inset: 0; overflow: hidden; z-index: 1; }
        .flying-plane { position: absolute; color: rgba(0, 0, 0, 0.08); animation-timing-function: linear; animation-iteration-count: infinite; animation-name: fly-straight; }
        .flying-plane.plane-1 { top: 10%; font-size: 5rem; animation-duration: 16s; animation-delay: -2s; }
        .flying-plane.plane-2 { top: 40%; font-size: 2rem; animation-duration: 25s; animation-delay: -10s; }
        .animated-heading { background: linear-gradient(90deg, var(--accent-dark), var(--text-dark), var(--accent-dark)); background-size: 200% auto; color: transparent; background-clip: text; -webkit-background-clip: text; animation: gradient-pan 5s linear infinite; }
        .floating-image-container { animation: float-animation 6s ease-in-out infinite; }
        .futuristic-operate-btn { background-color: transparent; color: var(--accent-dark); border: 2px solid var(--accent-color); font-weight: 600; transition: all 0.4s ease; position: relative; overflow: hidden; z-index: 1; }
        .futuristic-operate-btn::before { content: ''; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: var(--accent-color); transform: translateX(-100%); transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1); z-index: -1; }
        .futuristic-operate-btn:hover { color: white; border-color: var(--accent-dark); }
        .futuristic-operate-btn:hover::before { transform: translateX(0); }
        @keyframes modal-fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes modal-fade-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }
        .modal-animate-in { animation: modal-fade-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .modal-animate-out { animation: modal-fade-out 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .futuristic-light-panel { background: white; border: 1px solid #E5E7EB; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); clip-path: polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%); }
        .futuristic-close-btn { background-color: var(--text-dark); color: var(--accent-color); clip-path: polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 15px); transition: all 0.2s ease-in-out; }
        .futuristic-close-btn:hover { background-color: #000; color: white; }
      `}</style>
      
      {/* Main Component JSX */}
      <div className=" font-roboto text-gray-800 flex flex-col justify-center items-center py-16 px-5 min-h-[500px] relative overflow-hidden">
        <div className="background-animation-container">
            <FaPlane className="flying-plane plane-1" />
            <FaPlane className="flying-plane plane-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto items-center relative z-10">
          <div className="flex flex-col items-center lg:items-start space-y-6">
            
            {/* DYNAMIC CONTENT */}
            <h2 className="animated-heading text-3xl lg:text-4xl font-bold">
              {content.operate_heading}
            </h2>
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <button className="futuristic-operate-btn flex items-center justify-center py-3 px-8 text-base rounded-md" onClick={() => handleOpenModal('local')}>
                <FaMapMarkedAlt className="mr-3" />
                <span>{content.local_button_text}</span>
              </button>
              <button className="futuristic-operate-btn flex items-center justify-center py-3 px-8 text-base rounded-md" onClick={() => handleOpenModal('global')}>
                <FaGlobeAfrica className="mr-3" />
                <span>{content.global_button_text}</span>
              </button>
            </div>
          </div>
          <div className="w-full flex justify-center floating-image-container">
            <div className=" rounded-lg shadow-custom overflow-hidden">
              <img src={newimage} alt="Map or relevant image" className="w-full h-auto max-w-sm lg:max-w-md object-cover" />
            </div>
          </div>
        </div>

        {/* Modal Section with Dynamic Content */}
        {modalContentKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className={`futuristic-light-panel w-full max-w-3xl rounded-lg ${isModalVisible ? 'modal-animate-in' : 'modal-animate-out'}`}>
              <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl z-20">×</button>
              
              {modalContentKey === 'local' && (
                <div className="p-6 md:p-8 relative">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">{content.local_modal_title}</h3>
                  <p className="mb-6 text-gray-600">{content.local_modal_description}</p>
                  <div className="w-full h-80 mb-6 rounded-md overflow-hidden border">
                    <iframe title={`${content.local_button_text} Map`} src={content.local_modal_map_src} width="100%" height="100%" style={{ border: "none" }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                  </div>
                </div>
              )}

              {modalContentKey === 'global' && (
                <div className="p-6 md:p-8 relative">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">{content.global_modal_title}</h3>
                  <p className="text-gray-600">{content.global_modal_description}</p>
                </div>
              )}

              <div className="px-8 pb-6 flex justify-end">
                <button onClick={handleCloseModal} className="futuristic-close-btn py-2 px-6 font-semibold">{content.close_button_text}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Weperate;