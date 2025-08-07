import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ========= YOUR EXISTING COMPONENT IMPORTS =========
import GlobalLoader from "./components/GlobalLoader/GlobalLoader";
import Navbar from "./components/Navbar/Navbar";
import ChatWidget from "./components/ChatWidget/ChatWidget";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import AboutSection from "./components/WhoWeAre/WhoWeAre";
import WhereBrazil from "./components/WhereBrazil/WhereBrazil";
import OperateWorld from "./components/OperateWorld/OperateWorld";
import MissionVissionAndValues from "./components/MissionVissionAndValues/MissionVissionAndValues";
import AirFreightSection from "./components/AirFreightSection/AirFreightSection";
import SeaFreight from "./components/SeaFrieght/SeaFrieght";
import RoadFreight from "./components/RoadFreight/RoadFreight";
import StuffingUnloading from "./components/StuffingUnloading/StuffingUnloading";
import LCL from "./components/LCL/LCL";
import FCL from "./components/FCL/FCL";
import CustomClearance from "./components/CustomClearance/CustomClearance";
import DGR from "./components/DGR/DGR";
import Inspection from "./components/Inspection/Inspection";
import Packaging from "./components/Packaging/Packaging";
import Storages from "./components/Storages/Storages";
import Commercial from "./components/Commercial/Commercial";
import Insurance from "./components/Insurance/Insurance";
import Containers from "./components/Container/Container";
import Incoterms from "./components/Incoterms/Incoterms";
import ContactUs from "./components/ContactUs/ContactUs";
import Offers from "./components/Offers/Offers";
import Testimonials from "./components/Testimonials/Testimonials";
// ... any other public components

// ========= NEW ADMIN PANEL IMPORTS =========
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RegionEditForm from './pages/Admin/RegionEditForm';
import ProtectedRoute from './components/Auth/ProtectedRoute'; 

// ========= CONTEXT PROVIDER =========
import { RegionProvider } from "./context/RegionContext";
import AdminSignUp from './pages/Admin/AdminSignUp';
import CreateRegionPage from './pages/Admin/CreateRegionPage';


const MainLayout = () => {
  return (
    <>
      <GlobalLoader />
      <Navbar />
      <ChatWidget />
      {/* This is where all your public pages will be rendered */}
      <main>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/whoWeAre" element={<AboutSection />} />
            <Route path="/whereServe" element={<WhereBrazil />} />
            <Route path="/OperateWorld" element={<OperateWorld />} />
            <Route path="/missionvisionandvalues" element={<MissionVissionAndValues />} />
            <Route path="/airFreight" element={<AirFreightSection />} />
            <Route path="/seaFreight" element={<SeaFreight />} />
            <Route path="/roadFreight" element={<RoadFreight />} />
            <Route path="/stuffingUnloading" element={<StuffingUnloading />} />
            <Route path ="/lcl" element={<LCL/>}/>
            <Route path ="/fcl" element={<FCL/>}/>
            <Route path="/customClearance" element={<CustomClearance />} />
            <Route path="/dgr" element={<DGR />} />
            <Route path="/inspection" element={<Inspection />} />
            <Route path="/packaging" element={<Packaging />} />
            <Route path="/storage" element={<Storages />} />
            <Route path="/commercial" element={<Commercial />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/container" element={<Containers />} />
            <Route path="/incoTerms" element={<Incoterms />} />
            <Route path="/contactUs" element={<ContactUs />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/testimonials" element={<Testimonials />} />
            
            {/* You can add a 404 Not Found route here for the public site */}
            <Route path="*" element={<div><h2>404 Page Not Found</h2></div>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};



function App() {
  return (
    <Router>
      <RegionProvider>
        <Routes>
      
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/create-super-user-access-a9b3c7d1" element={<AdminSignUp />} />
          <Route element={<ProtectedRoute />}>
           
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-region" element={<CreateRegionPage />} />
            <Route path="/admin/edit/:regionCode" element={<RegionEditForm />} />
          </Route>
          
       
          <Route path="/*" element={<MainLayout />} />

        </Routes>
      </RegionProvider>
    </Router>
  );
}

export default App;