import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Bell, Image, Clock, Mail, ExternalLink } from 'lucide-react';

function HowToUse() {
  return (
    <main className="flex-grow flex items-center justify-center p-6 bg-[#f8f4f4]">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-main">
          <h2 className="text-2xl font-semibold text-main mb-6">How to Use Surprise URL</h2>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-medium text-main mb-4 flex items-center">
                <span className="bg-main/10 p-2 rounded-full mr-2">1</span>
                Create Your Secret URL
              </h3>
              <div className="pl-10">
                <p className="mb-4">
                  Start by filling out the form on the home page with the following information:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>URL to Shorten:</strong> The destination link you want to share.</li>
                  <li><strong>Your Name:</strong> Who the link is from.</li>
                  <li><strong>Your Email:</strong> Where notifications will be sent.</li>
                  <li>
                    <strong>Expiration Date:</strong> <Clock className="inline h-4 w-4" /> 
                    When the link will expire (optional).
                  </li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-medium text-main mb-4 flex items-center">
                <span className="bg-main/10 p-2 rounded-full mr-2">2</span>
                Configure Access Controls
              </h3>
              <div className="pl-10">
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>Allowed Emails:</strong> <Mail className="inline h-4 w-4" /> 
                    Restrict access to specific email addresses.
                  </li>
                  <li>
                    <strong>Require Sign-in:</strong> <Lock className="inline h-4 w-4" /> 
                    Users must verify their identity before accessing.
                  </li>
                  <li>
                    <strong>Send Notifications:</strong> <Bell className="inline h-4 w-4" /> 
                    Get notified when someone accesses your link.
                  </li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-medium text-main mb-4 flex items-center">
                <span className="bg-main/10 p-2 rounded-full mr-2">3</span>
                Add Optional Image
              </h3>
              <div className="pl-10">
                <p className="mb-4">
                  <Image className="inline h-4 w-4 mr-1" /> 
                  Enable the "Embed Image" option to upload an image that will be displayed with your link.
                </p>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-medium text-main mb-4 flex items-center">
                <span className="bg-main/10 p-2 rounded-full mr-2">4</span>
                Share Your Secret URL
              </h3>
              <div className="pl-10">
                <p className="mb-4">
                  <ExternalLink className="inline h-4 w-4 mr-1" /> 
                  After creating your URL, you can copy it or click "Open URL" to test it before sharing.
                </p>
              </div>
            </section>
            
            <div className="bg-main/5 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-main mb-3">Ready to create your first Secret URL?</h3>
              <Link 
                to="/" 
                className="inline-block py-2 px-4 bg-main text-white rounded-lg hover:bg-[#702020] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HowToUse;