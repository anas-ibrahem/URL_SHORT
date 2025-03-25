import React from 'react';

function About() {
  return (
    <main className="flex-grow flex items-center justify-center p-6 bg-[#f8f4f4]">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-main">
          <h2 className="text-2xl font-semibold text-main mb-6">About CCextractor Surprise URL</h2>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              CCextractor Surprise URL is a service that allows you to create secret links to share content while 
              maintaining control over who can access it and for how long.
            </p>
            
            <h3 className="text-xl font-medium text-main mt-6 mb-3">Why use Surprise URL?</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Surprise Gifts:</strong> Share links to surprise gifts, event details, or special announcements 
                without spoiling the surprise.
              </li>
              <li>
                <strong>Restricted Access:</strong> Control who can access your content by specifying allowed email addresses.
              </li>
              <li>
                <strong>Link Expiration:</strong> Set an expiration date for your links to ensure temporary access.
              </li>
              <li>
                <strong>Access Notifications:</strong> Receive notifications when someone accesses your link.
              </li>
              <li>
                <strong>Image Embedding:</strong> Include a preview image with your link to make it more engaging.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default About;