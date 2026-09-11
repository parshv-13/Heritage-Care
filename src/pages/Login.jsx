import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { auth, saveUserProfile } from '../services/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { Phone, Volume2, Shield } from 'lucide-react';
import { speakText } from '../services/gameStorage';

export const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginAsGuest } = useApp();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('inputPhone');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('[Firebase Phone Auth] Recaptcha verified');
        },
        'expired-callback': () => {
          setErrorMsg('Recaptcha verification expired. Please try sending OTP again.');
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
      navigate('/home');
    } catch (err) {
      console.error(err);
      setErrorMsg("Google Sign-In failed. Please try Phone Number login.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = (name) => {
    speakText(`Welcome ${name}`);
    loginAsGuest(name);
    navigate('/home');
  };

  const handleSendPhoneOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

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
      setErrorMsg(`Phone Sign-In Error: ${err.message}`);
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
      speakText("OTP verified successfully. Welcome to Qurevia.");
      navigate('/home');
    } catch (err) {
      console.error('[OTP Verify Error]', err);
      setErrorMsg(`Invalid OTP Code: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] dark:bg-[#121214] transition-colors flex flex-col justify-center items-center py-8 px-4">
      <div className="w-full max-w-xl space-y-6 text-left">
        <div id="recaptcha-container"></div>

        {/* Top Banner */}
        <div className="w-full space-y-2 border-b-2 border-[#1A1A1A] dark:border-[#3F3F46] pb-4">
          <h1 className="text-3xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">Qurevia</h1>
          <p className="text-base font-semibold text-[#333333] dark:text-[#A1A1AA]">
            North-East Cognitive Memory Gaming &amp; Assistive Health Platform
          </p>
        </div>

        {/* Main Login Box */}
        <div className="w-full bg-[#FFFFFF] dark:bg-[#18181B] border-2 border-[#1A1A1A] dark:border-[#3F3F46] rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] dark:border-[#3F3F46] pb-3">
            <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">Sign In</h2>
            <button
              type="button"
              onClick={() => speakText("Select Quick Elder Access, Google Login, or Phone Number login to enter.")}
              className="h-16 px-4 bg-[#FFFFFF] dark:bg-[#27272A] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46] border-2 border-[#1A1A1A] dark:border-[#52525B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-lg font-bold flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-6 h-6" />
              <span className="text-sm">Read Options</span>
            </button>
          </div>

          {errorMsg && (
            <div className="bg-[#F9F9F9] dark:bg-[#27272A] border-2 border-[#802A0B] text-[#802A0B] dark:text-[#F87171] font-bold p-4 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}

          {/* 1. Quick Elder Direct Access */}
          <div className="space-y-3">
            <label className="block text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
              Quick One-Touch Access (No Password Required):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleGuestSignIn('Grandma Kangkan')}
                className="h-16 bg-[#0B3C5D] hover:bg-[#08283E] dark:bg-[#0284C7] dark:hover:bg-[#0369A1] text-white font-bold text-base rounded-lg border-2 border-[#0B3C5D] dark:border-[#0284C7] flex items-center justify-center cursor-pointer"
              >
                Grandma Kangkan (Assam)
              </button>
              <button
                type="button"
                onClick={() => handleGuestSignIn('Grandpa Baruah')}
                className="h-16 bg-[#0B3C5D] hover:bg-[#08283E] dark:bg-[#0284C7] dark:hover:bg-[#0369A1] text-white font-bold text-base rounded-lg border-2 border-[#0B3C5D] dark:border-[#0284C7] flex items-center justify-center cursor-pointer"
              >
                Grandpa Baruah (Meghalaya)
              </button>
            </div>
          </div>

          {/* 2. Google Sign In Option */}
          <div className="space-y-2 pt-2 border-t-2 border-[#1A1A1A] dark:border-[#3F3F46]">
            <label className="block text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">Alternative Login Methods:</label>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-16 bg-[#FFFFFF] dark:bg-[#27272A] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] border-2 border-[#1A1A1A] dark:border-[#52525B] font-bold text-base rounded-lg flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>{loading ? 'Connecting...' : 'Sign In with Google Account'}</span>
            </button>
          </div>

          {/* 3. Phone Number OTP Login */}
          <div className="bg-[#F9F9F9] dark:bg-[#27272A] border-2 border-[#1A1A1A] dark:border-[#3F3F46] rounded-lg p-4 space-y-4">
            <h3 className="text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#0B3C5D] dark:text-[#38BDF8]" />
              <span>Mobile Phone OTP Login</span>
            </h3>

            {step === 'inputPhone' ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number (e.g. 9876543210)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-4 rounded-lg border-2 border-[#1A1A1A] dark:border-[#52525B] text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5] bg-[#FFFFFF] dark:bg-[#18181B]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-[#0B3C5D] hover:bg-[#08283E] dark:bg-[#0284C7] dark:hover:bg-[#0369A1] text-white font-bold text-base rounded-lg border-2 border-[#0B3C5D] dark:border-[#0284C7] cursor-pointer"
                >
                  {loading ? 'Sending OTP SMS...' : 'Send SMS Verification Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <p className="text-xs font-bold text-[#1D6F42] dark:text-[#4ADE80]">
                  Code sent to {phoneNumber.startsWith('+') ? phoneNumber : `+91 ${phoneNumber}`}
                </p>
                <input
                  type="number"
                  placeholder="Enter 6-digit OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-4 rounded-lg border-2 border-[#1A1A1A] dark:border-[#52525B] text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5] bg-[#FFFFFF] dark:bg-[#18181B]"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-16 bg-[#1D6F42] hover:bg-[#155431] dark:bg-[#15803D] text-white font-bold text-base rounded-lg border-2 border-[#1D6F42] dark:border-[#15803D] cursor-pointer"
                  >
                    {loading ? 'Verifying...' : 'Verify Code & Sign In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('inputPhone')}
                    className="h-16 px-6 bg-[#FFFFFF] dark:bg-[#27272A] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] font-bold rounded-lg border-2 border-[#1A1A1A] dark:border-[#52525B] cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Safety Reassurance */}
        <div className="w-full flex items-center gap-2 text-sm text-[#333333] dark:text-[#A1A1AA] font-semibold">
          <Shield className="w-5 h-5 text-[#0B3C5D] dark:text-[#38BDF8]" />
          <span>Secure, private &amp; accessible platform for North East senior healthcare.</span>
        </div>
      </div>
    </div>
  );
};
