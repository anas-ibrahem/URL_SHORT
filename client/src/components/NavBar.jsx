import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.pathname);

    useEffect(() => {
        setActiveTab(location.pathname);
    }, [location.pathname]);

    const tabs = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'How to Use', path: '/how-to-use' }
    ];

    return (
        <header className="bg-gradient-to-r from-main to-[#702020] text-white p-6 shadow-lg">
            <div className="max-w-6xl mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="w-12 h-12">
                            <img src="https://ccextractor.org/images/ccx.svg" alt="CCextractor Logo" className="w-full h-full" />
                        </Link>
                        <h1 className="text-3xl font-bold font-roboto">CCextractor Surprise URL</h1>
                    </div>
                    
                    <nav className="flex space-x-4">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.path}
                                to={tab.path}
                                className={`px-5 py-3 rounded-lg transition-all duration-300 ${
                                    activeTab === tab.path 
                                        ? 'bg-white text-[#702020] font-semibold shadow-md' 
                                        : 'bg-white/20 text-white hover:bg-white/50 hover:text-[#702020]'
                                }`}
                                onClick={() => setActiveTab(tab.path)}
                            >
                                {tab.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default NavBar;