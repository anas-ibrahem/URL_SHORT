import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './Pages/Home';
import About from './Pages/About';
import Auth from './Pages/Auth';
import HowToUse from './Pages/HowToUse';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-[#f8f4f4] flex flex-col font-roboto">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/:id" element={<Auth />} />
          <Route path="/how-to-use" element={<HowToUse />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;