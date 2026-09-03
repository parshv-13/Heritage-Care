import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { auth, saveUserProfile } from '../services/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { LogIn, Phone, UserCheck, Sparkles, Volume2, Shield } from 'lucide-react';
import { speakText } from '../services/gameStorage';

export const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginAsGuest } = useApp();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('inputPhone'); // 'inputPhone' | 'verifyOtp'
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize invisible Recaptcha for Phone Auth
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log('[Firebase Phone Auth] Recaptcha verified automatically');
        },
        'expired-callback': () => {
          setErrorMsg('Recaptcha expired. Please try sending OTP again.');
        }
      });
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      speakText("Logging in with Google account");
      await loginWithGoogle();
      // ProtectedRoute will automatically redirect new users to /onboarding,
      // and returning users (onboardingCompleted=true) go straight to /home
      navigate('/home');
    } catch (err) {
      console.error(err);
      setErrorMsg("Google Sign-In failed. Please try Phone Number login.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = (name) => {
    speakText(`Welcome ${name}!`);
    loginAsGuest(name);
    navigate('/home');
  };

  const handleSendPhoneOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Standardize to E.164 (+91 for India if no country code provided)
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone}`;
    }

    setLoading(true);
    setErrorMsg('');
    speakText("Sending OTP code to your mobile number.");

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep('verifyOtp');
      setErrorMsg('');
      speakText("OTP sent successfully to your mobile number.");
    } catch (err) {
      console.error('[Firebase Phone Auth Error]', err);
      setErrorMsg(`Phone Sign-In Error (${err.code}): ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setErrorMsg("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (!confirmationResult) {
        throw new Error("No active OTP request found. Please request OTP again.");
      }
      const result = await confirmationResult.confirm(otp);
      await saveUserProfile(result.user, { phone: phoneNumber });
      speakText("OTP verified successfully. Welcome to Heritage Care.");
      navigate('/home');
    } catch (err) {
      console.error('[OTP Verify Error]', err);
      setErrorMsg(`Invalid OTP Code (${err.code || 'error'}): ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-8 px-4 flex flex-col justify-center items-center max-w-md mx-auto space-y-6">

      {/* Invisible Recaptcha Container required by Firebase Phone Auth */}
      <div id="recaptcha-container"></div>

      {/* Heritage Header Banner */}
      <div className="w-full text-center space-y-2">
        <div className="w-20 h-20 bg-[#BA7517] text-white rounded-full mx-auto flex items-center justify-center text-4xl shadow-lg border-2 border-[#673D00] animate-bounce">
          🌺
        </div>
        <h1 className="text-3xl font-bold text-[#1B1C19]">Heritage Care</h1>
        <p className="text-lg font-semibold text-[#855000]">
          North-East Dementia Assist & Memory Gaming
        </p>
      </div>

      {/* Main Login Card - Elderly Friendly Large Touch Buttons */}
      <div className="w-full bg-white border-3 border-[#BA7517] rounded-3xl p-6 shadow-xl space-y-6 gamosa-pattern-bg">
        <div className="flex items-center justify-between border-b-2 border-[#E4E2DD] pb-3">
          <h2 className="text-2xl font-bold text-[#1B1C19]">Easy Sign-In</h2>
          <button
            type="button"
            onClick={() => speakText("Select Google Login, Phone Number login, or Quick Elder Access to start playing.")}
            className="p-2 bg-[#FFDCBB] border border-[#BA7517] text-[#855000] rounded-xl touch-target"
            aria-label="Read Login Options"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-[#FFDBD0] border-2 border-[#9C3E1F] text-[#802A0B] font-bold p-3 rounded-2xl text-center text-sm">
            {errorMsg}
          </div>
        )}

        {/* 1. Google Sign In Option */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full touch-target bg-white hover:bg-[#F0EEE9] text-[#1B1C19] border-3 border-[#857464] font-bold text-xl py-4 rounded-2xl shadow-md flex items-center justify-center gap-3 transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-7 h-7" />
          <span>{loading ? 'Connecting...' : 'Sign In with Google'}</span>
        </button>

        {/* 2. Real Phone Number OTP Login (with Recaptcha) */}
        <div className="border-2 border-[#BA7517] bg-[#FFF8F0] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-[#855000] font-bold text-lg">
            <Phone className="w-5 h-5" /> Phone Number Login
          </div>

          {step === 'inputPhone' ? (
            <form onSubmit={handleSendPhoneOtp} className="space-y-3">
              <input
                type="tel"
                placeholder="Enter 10-digit number (e.g. 9876543210)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-[#BA7517] text-lg font-bold text-[#1B1C19] focus:bg-white bg-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full touch-target bg-[#BA7517] hover:bg-[#855000] text-white font-bold text-lg py-3 rounded-xl border-2 border-[#673D00] shadow-sm transition"
              >
                {loading ? 'Sending OTP SMS...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <p className="text-xs font-bold text-[#386A0E]">
                OTP sent to {phoneNumber.startsWith('+') ? phoneNumber : `+91 ${phoneNumber}`}
              </p>
              <input
                type="number"
                placeholder="Enter 6-digit OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-[#386A0E] text-lg font-bold text-[#1B1C19] bg-white"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 touch-target bg-[#386A0E] hover:bg-[#265100] text-white font-bold text-lg py-3 rounded-xl border-2 border-[#0C2000] shadow-sm"
                >
                  {loading ? 'Verifying...' : 'Verify & Enter'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('inputPhone')}
                  className="px-3 bg-gray-200 text-gray-700 font-bold rounded-xl text-sm"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 3. Direct Fast Access for Elderly Dementia Patients */}
        <div className="space-y-3 pt-2">
          <div className="text-center font-bold text-sm text-[#855000] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#BA7517]" /> Quick Elder Access (No Password Needed)
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleGuestSignIn('Grandma Kangkan')}
              className="touch-target bg-[#FFDCBB] hover:bg-[#BA7517] hover:text-white text-[#855000] font-bold text-base py-3 px-2 rounded-2xl border-2 border-[#BA7517] shadow-sm text-center"
            >
              👵 Grandma Kangkan
            </button>
            <button
              type="button"
              onClick={() => handleGuestSignIn('Grandpa Baruah')}
              className="touch-target bg-[#B5F086] hover:bg-[#386A0E] hover:text-white text-[#265100] font-bold text-base py-3 px-2 rounded-2xl border-2 border-[#386A0E] shadow-sm text-center"
            >
              👴 Grandpa Baruah
            </button>
          </div>
        </div>
      </div>

      {/* Safety Reassurance Footer */}
      <div className="flex items-center gap-2 text-sm text-[#524436] font-semibold text-center">
        <Shield className="w-5 h-5 text-[#386A0E]" /> Safe, private & offline ready for North East India
      </div>
    </div>
  );
};
