import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-main text-white py-6">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://ccextractor.org/images/ccx.svg" 
                alt="CCextractor Logo" 
                className="w-8 h-8" 
              />
              <span className="font-medium">Prototype CCextractor Surprise URL</span>
            </Link>
            <p className="text-sm text-white/70 mt-2">
              Create secret URLs for your surprise content
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-2">
              <a 
                href="https://github.com/anas-ibrahem" 
                target="_blank" 
                className="text-white/80 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-white/70 flex items-center">
              Made with <Heart className="h-3 w-3 mx-1 text-red-400" /> by Anas Ibrahem
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;