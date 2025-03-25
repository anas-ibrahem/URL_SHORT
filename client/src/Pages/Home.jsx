import React, { useState, useRef } from 'react';
import { Calendar, Bell, Lock, Copy, Check, Image, X } from 'lucide-react';
import fetchAPI from '../utils/fetchAPI';

function Home() {
  const [formData, setFormData] = useState({
    originalURL: '',
    ownerName: '',
    ownerEmail: '',
    expirationDate: '',
    requiresSignIn: false,
    sendNotification: true,
    embedImage: false,
    imageFile: null,
    allowedEmails: []
  });
  
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEmailAdd = (e) => {
    if (e.key === 'Enter' && emailInput.trim()) {
      setFormData(prev => ({
        ...prev,
        allowedEmails: [...prev.allowedEmails, emailInput.trim()]
      }));
      setEmailInput('');
      e.preventDefault();
    }
  };

  const handleEmailRemove = (emailToRemove) => {
    setFormData(prev => ({
      ...prev,
      allowedEmails: prev.allowedEmails.filter(email => email !== emailToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, imageFile: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null }));
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    console.log(formData);
    try {
      const apiData = {
        originalURL: formData.originalURL,
        emails: formData.allowedEmails,
        requireSign: formData.requiresSignIn,
      };

      if (formData.expirationDate) { // Add expiration date if set
        apiData.expDate = formData.expirationDate;
      }

      const response = await fetchAPI('/shorten', 'POST', apiData);
      if (response.error) {
        setError(response.error);
      }
      
      setShortUrl(response.shortURL);
      setIsLoading(false);
    } catch (err) {
      setError('An error occurred: ' + err.message);
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy');
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-6 bg-cafe">
      <div className="w-full max-w-4xl">
        {!shortUrl ? (
          <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-main">
            <h2 className="text-2xl font-semibold text-main mb-6">
              Create Secret URL 
              <span className="italic ml-2">Don't Spoil it! 🎊</span>
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">URL to Shorten *</label>
                  <input
                    type="url"
                    name="originalURL"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-main focus:border-main"
                    placeholder="https://example.com"
                    value={formData.originalURL}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Expiration Date (Optional)</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="expirationDate"
                      className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-main"
                      value={formData.expirationDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Your Name *</label>
                  <input
                    type="text"
                    name="ownerName"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-main"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Your Email *</label>
                  <input
                    type="email"
                    name="ownerEmail"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-main"
                    placeholder="you@example.com"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Allowed Emails</label>
                <input
                  type="email"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-main"
                  placeholder="Press Enter to add email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={handleEmailAdd}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.allowedEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center bg-main/10 text-main px-3 py-1 rounded-full text-sm"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => handleEmailRemove(email)}
                        className="ml-2 focus:outline-none"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 relative">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="requiresSignIn"
                      className="peer h-5 w-5 border-2 border-gray-300 rounded appearance-none checked:border-main checked:bg-main focus:outline-none focus:ring-2 focus:ring-main/50"
                      checked={formData.requiresSignIn}
                      onChange={handleChange}
                    />
                    <Check className="absolute h-4 w-4 text-white scale-0 left-0.5 top-0.5 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm text-gray-700">Require sign-in</span>
                  <Lock className="h-4 w-4 text-gray-500" />
                </label>

                <label className="flex items-center gap-2 relative">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="sendNotification"
                      className="peer h-5 w-5 border-2 border-gray-300 rounded appearance-none checked:border-main checked:bg-main focus:outline-none focus:ring-2 focus:ring-main/50"
                      checked={formData.sendNotification}
                      onChange={handleChange}
                    />
                    <Check className="absolute h-4 w-4 text-white scale-0 left-0.5 top-0.5 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm text-gray-700">Send access notifications</span>
                  <Bell className="h-4 w-4 text-gray-500" />
                </label>

                <label className="flex items-center gap-2 relative">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="embedImage"
                      className="peer h-5 w-5 border-2 border-gray-300 rounded appearance-none checked:border-main checked:bg-main focus:outline-none focus:ring-2 focus:ring-main/50"
                      checked={formData.embedImage}
                      onChange={handleChange}
                    />
                    <Check className="absolute h-4 w-4 text-white scale-0 left-0.5 top-0.5 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm text-gray-700">Embed image</span>
                  <Image className="h-4 w-4 text-gray-500" />
                </label>
              </div>

              {formData.embedImage && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                  {!previewUrl ? (
                    <label className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="text-center">
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm text-main">Upload an image</span>
                        <input
                          type="file"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </div>
                    </label>
                  ) : (
                    <div className="relative">
                      <img src={previewUrl} alt="Preview" className="rounded-lg max-h-64 w-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-main text-white rounded-lg hover:bgs-secondry transition-colors hover:cursor-pointer disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Secret URL'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-lg mx-auto border-t-4 border-main">
            <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold text-main mb-4">URL Created!</h3>
            
            <div className="flex items-center bg-gray-100 p-3 rounded-lg mb-6">
              <span className="flex-grow text-main break-all">{shortUrl}</span>
              <button onClick={copyToClipboard} className="ml-2 text-main hover:texts-secondry">
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.open(shortUrl, '_blank')}
                className="w-full py-3 bg-main text-white rounded-lg hover:bgs-secondry transition-colors"
              >
                Open URL
              </button>
              <button
                onClick={() => setShortUrl('')}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Create New URL
              </button>
            </div>

            {formData.allowedEmails.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                <p>Restricted to:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {formData.allowedEmails.map(email => (
                    <span key={email} className="bg-main/10 text-main px-2 py-1 rounded-full text-xs">
                      {email}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;