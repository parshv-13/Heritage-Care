/**
 * Qurevia — Analytics, Progress & Voice Services
 */

// ─── Local Storage / Analytics ───────────────────────────────────────────────

/**
 * Saves game completion metrics silently to LocalStorage.
 * NO timers are ever displayed to the user; metrics are for caregiver/sync only.
 */
export const recordGameSession = (gameId, stats) => {
  const sessionData = {
    id: `${gameId}_${Date.now()}`,
    gameId,
    timestamp: new Date().toISOString(),
    attempts: stats.attempts || 0,
    timeTakenSeconds: stats.timeTakenSeconds || 0,
    accuracy: stats.accuracy || 100,
    difficulty: stats.difficulty || 'standard',
    synced: false,
  };

  try {
    const existing = JSON.parse(localStorage.getItem('heritage_care_game_history') || '[]');
    existing.unshift(sessionData);
    localStorage.setItem('heritage_care_game_history', JSON.stringify(existing.slice(0, 50)));
    console.log('[Analytics] Game session saved locally:', sessionData);
  } catch (err) {
    console.error('Failed to store game session', err);
  }

  return sessionData;
};

/**
 * Sync game session to Firebase Firestore for a logged-in user.
 * Imported lazily to avoid circular deps.
 */
export const syncToBackend = async (userId, sessionData) => {
  if (!userId) {
    console.log('[STUB] syncToBackend: no userId, skipping cloud sync.');
    return;
  }
  try {
    // Dynamic import to avoid bundle-time circular issues
    const { saveGameSessionToFirebase } = await import('./firebase.js');
    await saveGameSessionToFirebase(userId, sessionData);
  } catch (err) {
    console.error('[syncToBackend] Firebase sync failed:', err);
  }
};

/**
 * Full record + optional Firebase sync helper.
 * Call this from game pages instead of bare recordGameSession when you have a userId.
 */
export const recordAndSync = async (userId, gameId, stats) => {
  const session = recordGameSession(gameId, stats);
  await syncToBackend(userId, session);
  return session;
};

// ─── Adaptive Difficulty ──────────────────────────────────────────────────────

/**
 * Simple rule-based adaptive difficulty.
 * Returns 'harder' | 'easier' | 'standard'
 *
 * Rules (clearly commented — NOT an ML model):
 *   avgAccuracy >= 85 over last 3 sessions → harder
 *   avgAccuracy <  55 over last 3 sessions → easier
 *   otherwise                              → standard
 */
export const getNextDifficulty = (gameId) => {
  try {
    const history = JSON.parse(localStorage.getItem('heritage_care_game_history') || '[]');
    const recent = history.filter((s) => s.gameId === gameId).slice(0, 3);

    if (recent.length < 2) return 'standard';

    const avg = recent.reduce((acc, cur) => acc + cur.accuracy, 0) / recent.length;

    if (avg >= 85) return 'harder';
    if (avg < 55)  return 'easier';
    return 'standard';
  } catch {
    return 'standard';
  }
};

// ─── Voice / Speech ───────────────────────────────────────────────────────────

/**
 * Read text aloud via browser Web Speech API.
 * Rate is slowed to 0.85 for elderly clarity.
 */
export const speakText = (text) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate  = 0.85;
  utt.pitch = 1.0;
  utt.lang  = 'en-IN';
  window.speechSynthesis.speak(utt);
};

/**
 * STUB: Voice command listener.
 * Uses browser SpeechRecognition as working baseline.
 *
 * TODO: Replace with Bhashini API for Assamese / Manipuri / Khasi voice input
 *       once API keys and regional language models are available.
 */
export const handleVoiceCommand = (onResultCallback, onStopCallback) => {
  speakText('Listening… How can I help you today?');

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert('Voice input is ready. (Browser Speech API supported)');
    if (onResultCallback) onResultCallback('Voice recognition ready');
    return null;
  }

  const recognition = new SR();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript;
    console.log('[Voice Command]:', command);
    speakText(`You said: ${command}`);
    if (onResultCallback) onResultCallback(command);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (onStopCallback) onStopCallback();
  };

  recognition.onend = () => {
    if (onStopCallback) onStopCallback();
  };

  try {
    recognition.start();
  } catch (err) {
    console.warn('Recognition start caught:', err);
  }

  return recognition;
};
