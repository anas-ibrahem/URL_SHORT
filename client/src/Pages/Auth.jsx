import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff, Loader } from 'lucide-react';
import fetchAPI from '../utils/fetchAPI';
import { useParams, useLocation } from 'react-router-dom';

function Auth() {
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [shortId, setShortId] = useState('');
  const [urlDetails, setUrlDetails] = useState(null);
  
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  useEffect(() => {
    const id = queryParams.get('shortId');
    if (id) setShortId(id);
    console.log('Short ID:', id);
  }, [params, queryParams]);

    // Countdown timer for code expiration
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);


  const handleEmailSubmit = async (e) => {
    if (e){
      e.preventDefault();
    }

    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetchAPI('/auth/verify-email', 'POST', {
        email,
        shortId
      });
      
      if (response.error) {
        setError(response.error);
        setIsLoading(false);
        return;
      }
      
      if (response.success) {
        setShowCodeInput(true);
        setCountdown(response.exptime || 60)
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('An error occurred: ' + err.message);
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetchAPI('/auth/verify-code', 'POST', {
        email,
        shortId,
        code: authCode
      });
      
      if (response.error) {
        setError(response.error);
        setIsLoading(false);
        return;
      }
      
      if (response.success && response.redirectUrl) {
        window.location.href = response.redirectUrl;
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('An error occurred: ' + err.message);
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;
    
    await handleEmailSubmit();
  };

  if (isLoading && !urlDetails) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-cafe">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-lg mx-auto border-t-4 border-main">
          <Loader className="animate-spin h-12 w-12 mx-auto text-main mb-4" />
          <p className="text-gray-600">Checking URL...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow flex items-center justify-center p-6 bg-cafe">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-main">
          <h2 className="text-2xl font-semibold text-main mb-6 flex items-center">
            <Lock className="mr-2 h-6 w-6" />
            {showCodeInput ? 'Enter Verification Code' : 'Access Protected URL'}
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
          )}

          {!showCodeInput ? (
            // Email form
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Your Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-main focus:border-main"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Enter your email to receive a verification code
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-main text-white rounded-lg hover:bgs-secondry transition-colors hover:cursor-pointer disabled:opacity-50 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <ArrowRight className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            // Verification code form
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-main focus:border-main text-center tracking-widest font-mono text-lg"
                  placeholder="123456"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  We've sent a verification code to {email} please check your inbox and spam
                </p>
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in {countdown} seconds
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={resendCode}
                    className="text-sm text-main hover:underline focus:outline-none hover:cursor-pointer"
                  >
                    Resend code
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-main text-white rounded-lg hover:bgs-secondry transition-colors hover:cursor-pointer disabled:opacity-50 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <ArrowRight className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <button
                type="button"
                onClick={() => setShowCodeInput(false)}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back to Email
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default Auth;