import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  saveUserProfile,
  db
} from '../services/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { REGIONAL_THEMES, getTranslation } from '../config/regionalThemes';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Regional & Patient Onboarding State
  const [userState, setUserState] = useState('Assam');
  const [userLanguage, setUserLanguage] = useState('English');
  const [patientName, setPatientName] = useState('Grandma Kangkan');
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const [reminders, setReminders] = useState([
    { id: '1', title: 'Morning Heart Medicine', time: '08:00 AM', category: 'Medicine', taken: false, icon: 'Pill' },
    { id: '2', title: 'Drink Warm Water / Tea', time: '10:30 AM', category: 'Hydration', taken: true, icon: 'Droplets' },
    { id: '3', title: 'Afternoon Memory Walk in Garden', time: '04:00 PM', category: 'Activity', taken: false, icon: 'Footprints' },
    { id: '4', title: 'Evening BP Checkup with Doctor', time: '06:30 PM', category: 'Appointment', taken: false, icon: 'Stethoscope' }
  ]);

  const [familyContacts, setFamilyContacts] = useState([
    { id: '1', name: 'Aniket Sharma (Son)', relation: 'Primary Caregiver', phone: '+91 98765 43210', location: 'Guwahati', avatar: '👨‍💼' },
    { id: '2', name: 'Dr. R. K. Baruah', relation: 'Family Physician', phone: '+91 98123 45678', location: 'Shillong Hospital', avatar: '👨‍⚕️' },
    { id: '3', name: 'Priya Sharma (Granddaughter)', relation: 'Family Contact', phone: '+91 94321 87654', location: 'Imphal', avatar: '👩‍🎓' }
  ]);

  // Derived current regional theme & state-tailored text translations
  const currentTheme = REGIONAL_THEMES[userState] || REGIONAL_THEMES['Assam'];
  const t = getTranslation(userLanguage, userState);

  // Sync profile, reminders, family contacts from Firestore upon auth change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.userState) setUserState(data.userState);
            if (data.userLanguage) setUserLanguage(data.userLanguage);
            if (data.patientName) setPatientName(data.patientName);
            if (data.caregiverName) setCaregiverName(data.caregiverName);
            if (data.caregiverPhone) setCaregiverPhone(data.caregiverPhone);
            if (typeof data.onboardingCompleted === 'boolean') setOnboardingCompleted(data.onboardingCompleted);
            if (data.reminders && Array.isArray(data.reminders)) setReminders(data.reminders);
            if (data.familyContacts && Array.isArray(data.familyContacts)) setFamilyContacts(data.familyContacts);
          } else {
            // New User Registration in Firestore
            const initialProfile = {
              uid: user.uid,
              displayName: user.displayName || 'Elderly User',
              email: user.email || '',
              userState: 'Assam',
              userLanguage: 'English',
              patientName: user.displayName || 'Elderly User',
              caregiverName: '',
              caregiverPhone: '',
              onboardingCompleted: false,
              reminders,
              familyContacts,
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, initialProfile);
            setPatientName(user.displayName || 'Elderly User');
            setOnboardingCompleted(false);
          }
        } catch (err) {
          console.error("Firestore sync error:", err);
        }
      } else {
        setCurrentUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Update profile details (State, Language, Patient Name, Caregiver) in Firestore
  const saveUserOnboardingDetails = async (details) => {
    const updatedState = details.state || userState;
    const updatedLang = details.language || userLanguage;
    const updatedName = details.name || patientName;
    const updatedCaregiver = details.caregiverName || caregiverName;
    const updatedPhone = details.caregiverPhone || caregiverPhone;

    setUserState(updatedState);
    setUserLanguage(updatedLang);
    setPatientName(updatedName);
    setCaregiverName(updatedCaregiver);
    setCaregiverPhone(updatedPhone);
    setOnboardingCompleted(true);

    if (currentUser && !currentUser.isGuest) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {
          userState: updatedState,
          userLanguage: updatedLang,
          patientName: updatedName,
          caregiverName: updatedCaregiver,
          caregiverPhone: updatedPhone,
          onboardingCompleted: true
        }, { merge: true });
      } catch (err) {
        console.error("Error saving onboarding details to Firestore:", err);
      }
    }
  };

  // Add / Edit / Delete Reminders with Firestore Cloud Persistence
  const addReminder = async (newReminder) => {
    const updated = [...reminders, { ...newReminder, id: Date.now().toString(), taken: false }];
    setReminders(updated);
    await syncUserCustomData({ reminders: updated });
  };

  const updateReminder = async (id, updatedFields) => {
    const updated = reminders.map(r => r.id === id ? { ...r, ...updatedFields } : r);
    setReminders(updated);
    await syncUserCustomData({ reminders: updated });
  };

  const deleteReminder = async (id) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    await syncUserCustomData({ reminders: updated });
  };

  const toggleReminder = async (id) => {
    const updated = reminders.map(r => r.id === id ? { ...r, taken: !r.taken } : r);
    setReminders(updated);
    await syncUserCustomData({ reminders: updated });
  };

  // Add / Edit / Delete Family Contacts with Firestore Cloud Persistence
  const addFamilyContact = async (newContact) => {
    const updated = [...familyContacts, { ...newContact, id: Date.now().toString() }];
    setFamilyContacts(updated);
    await syncUserCustomData({ familyContacts: updated });
  };

  const updateFamilyContact = async (id, updatedFields) => {
    const updated = familyContacts.map(c => c.id === id ? { ...c, ...updatedFields } : c);
    setFamilyContacts(updated);
    await syncUserCustomData({ familyContacts: updated });
  };

  const deleteFamilyContact = async (id) => {
    const updated = familyContacts.filter(c => c.id !== id);
    setFamilyContacts(updated);
    await syncUserCustomData({ familyContacts: updated });
  };

  const syncUserCustomData = async (fields) => {
    if (currentUser && !currentUser.isGuest) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, fields, { merge: true });
      } catch (err) {
        console.error("Error syncing to Firestore:", err);
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserProfile(result.user);
      return result.user;
    } catch (error) {
      console.error('Google Sign-in failed', error);
      throw error;
    }
  };

  const loginAsGuest = async (guestName = 'Grandma Kangkan', region = 'Assam') => {
    const fakeUser = {
      uid: 'guest_' + Date.now(),
      displayName: guestName,
      isGuest: true
    };
    setCurrentUser(fakeUser);
    setPatientName(guestName);
    setUserState(region);
    setOnboardingCompleted(true);
  };

  const logout = async () => {
    try {
      if (currentUser?.isGuest) {
        setCurrentUser(null);
      } else {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      loadingAuth,
      loginWithGoogle,
      loginAsGuest,
      logout,
      userState,
      setUserState,
      userLanguage,
      setUserLanguage,
      patientName,
      setPatientName,
      caregiverName,
      caregiverPhone,
      onboardingCompleted,
      saveUserOnboardingDetails,
      currentTheme,
      t,
      reminders,
      setReminders,
      toggleReminder,
      addReminder,
      updateReminder,
      deleteReminder,
      familyContacts,
      addFamilyContact,
      updateFamilyContact,
      deleteFamilyContact
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
