const storageKeys = {
  user: 'activetrack-web-user',
  sessions: 'activetrack-web-sessions',
  customActivities: 'activetrack-web-custom-activities',
  activeSession: 'activetrack-web-session-active',
  language: 'activetrack-web-language',
};
const passwordIterations = 210000;

const defaultActivities = [
  'Football',
  'Gym',
  'Run',
  'Padel',
  'Tennis',
  'Golf',
  'Horse Riding',
  'Cycling',
  'Walking',
  'Swimming',
  'Studying',
  'Baloot',
  'Vehicle Maintenance',
];

const activitySections = [
  {
    key: 'sports',
    activities: ['Football', 'Padel', 'Tennis', 'Golf', 'Horse Riding', 'Baloot'],
  },
  {
    key: 'fitness',
    activities: ['Gym', 'Run', 'Cycling', 'Walking', 'Swimming'],
  },
  {
    key: 'life',
    activities: ['Studying', 'Vehicle Maintenance'],
  },
];

const translations = {
  en: {
    languageButton: 'العربية',
    back: 'Back',
    logout: 'Logout',
    authEyebrow: 'Personal activity tracking',
    heroTitle: 'Track your sessions, matches, rides, study, and maintenance.',
    heroCopy:
      'ActiveTrack Web is a local-first tracker. Your account and saved sessions stay in this browser, with tools to review, filter, and export your history.',
    signIn: 'Sign in',
    signUp: 'Sign up',
    welcomeBack: 'Welcome back',
    createAccount: 'Create your account',
    recoverAccount: 'Recover account',
    createProfile: 'Create an ActiveTrack profile for this browser.',
    signInDescription: 'Sign in to continue tracking on this device.',
    resetDescription: 'Use your recovery code to set a new password.',
    name: 'Name',
    identifier: 'Email or phone',
    password: 'Password',
    repeatPassword: 'Repeat password',
    passwordMinimum: 'Password must be at least 8 characters.',
    recoveryCode: 'Recovery code',
    newPassword: 'New password',
    resetPassword: 'Reset password',
    passkey: 'Use Face ID / Passkey',
    forgot: 'Forgot username or password?',
    signupLegal:
      'By creating an ActiveTrack account, you agree to save your data on this device. We never share your data.',
    or: 'Or',
    appleSignup: 'Sign up with Apple',
    facebookSignup: 'Sign up with Facebook',
    backToSignin: 'Back to sign in',
    saveRecoveryCode: 'Save this recovery code',
    recoveryHelp: 'You need it if you forget your password.',
    securityTitle: 'Security on this device',
    securityText:
      'Password hashes, recovery code login reset, Face ID / passkey support, and history saved until you delete it.',
    home: 'Home',
    homeTitle: 'What do you want to track?',
    welcome: 'Choose an activity and save it to History.',
    welcomeUser: (name) => `Welcome, ${name}. Choose an activity and save it to History.`,
    history: 'History',
    totalSessions: 'Total sessions',
    lastActivity: 'Last activity',
    none: 'None',
    customActivities: 'Custom activities',
    addCustomActivity: 'Add custom activity',
    add: 'Add',
    activity: 'Activity',
    trackerHelper: 'Fill the details, then save the session.',
    trackerTimed: 'Start the timer, fill the details, then save the session.',
    trackerVehicle: 'Vehicle Maintenance saves without a timer.',
    timer: 'Timer',
    start: 'Start',
    end: 'End',
    saveToHistory: 'Save to History',
    timerNote: 'Start and end time will be saved.',
    historyTitle: 'Saved sessions',
    historyCopy: 'Filter, review, export, and delete saved activity sessions.',
    export: 'Export',
    clearAll: 'Clear all',
    filterActivity: 'Filter activity',
    all: 'All',
    delete: 'Delete',
    noSessions: 'No saved sessions yet.',
    maintenanceRecord: 'Maintenance record. No timer used.',
    details: 'Details',
    noDetails: 'No details saved',
    sections: {
      sports: 'Sports and games',
      fitness: 'Fitness and movement',
      life: 'Life tracking',
      custom: 'Custom activities',
    },
    helpers: {
      'Vehicle Maintenance': 'Service, mileage, cost, notes',
      Gym: 'Workout day, exercises, timer',
      Football: 'Teams, score, timer',
      Padel: 'Teams, rounds, winner',
      Tennis: 'Teams, rounds, winner',
      Run: 'Laps, distance, timer',
      Walking: 'Laps, distance, timer',
      Cycling: 'Laps, distance, timer',
      Swimming: 'Laps, distance, timer',
      Baloot: 'Scores, dealer, winner',
      'Horse Riding': 'Horse, training, care notes',
      Golf: 'Balls, club, range notes',
      Studying: 'Subject, study type, notes',
      default: 'Timed session and notes',
    },
    activities: {},
  },
  ar: {
    languageButton: 'English',
    back: 'رجوع',
    logout: 'تسجيل الخروج',
    authEyebrow: 'تتبع النشاطات الشخصية',
    heroTitle: 'تتبع تمارينك ومبارياتك وركوب الخيل والدراسة وصيانة السيارة.',
    heroCopy:
      'ActiveTrack Web تطبيق يعمل على هذا الجهاز. حسابك وسجلاتك تبقى محفوظة في هذا المتصفح، مع أدوات للمراجعة والتصفية والتصدير.',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    welcomeBack: 'مرحباً بعودتك',
    createAccount: 'إنشاء حساب',
    recoverAccount: 'استرجاع الحساب',
    createProfile: 'أنشئ ملف ActiveTrack لهذا المتصفح.',
    signInDescription: 'سجل الدخول لمتابعة التتبع على هذا الجهاز.',
    resetDescription: 'استخدم رمز الاسترجاع لتعيين كلمة مرور جديدة.',
    name: 'الاسم',
    identifier: 'البريد أو رقم الجوال',
    password: 'كلمة المرور',
    repeatPassword: 'تأكيد كلمة المرور',
    passwordMinimum: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.',
    recoveryCode: 'رمز الاسترجاع',
    newPassword: 'كلمة مرور جديدة',
    resetPassword: 'إعادة تعيين كلمة المرور',
    passkey: 'استخدام Face ID / مفتاح المرور',
    forgot: 'نسيت اسم المستخدم أو كلمة المرور؟',
    signupLegal:
      'بإنشاء حساب ActiveTrack، أنت توافق على حفظ بياناتك على هذا الجهاز. لا نشارك بياناتك.',
    or: 'أو',
    appleSignup: 'إنشاء حساب باستخدام Apple',
    facebookSignup: 'إنشاء حساب باستخدام Facebook',
    backToSignin: 'العودة لتسجيل الدخول',
    saveRecoveryCode: 'احفظ رمز الاسترجاع',
    recoveryHelp: 'ستحتاجه إذا نسيت كلمة المرور.',
    securityTitle: 'الأمان على هذا الجهاز',
    securityText:
      'تجزئة كلمة المرور، استرجاع الحساب برمز خاص، دعم Face ID / مفاتيح المرور، وحفظ السجل حتى تحذفه.',
    home: 'الرئيسية',
    homeTitle: 'ماذا تريد أن تتتبع؟',
    welcome: 'اختر نشاطاً واحفظه في السجل.',
    welcomeUser: (name) => `مرحباً ${name}. اختر نشاطاً واحفظه في السجل.`,
    history: 'السجل',
    totalSessions: 'عدد الجلسات',
    lastActivity: 'آخر نشاط',
    none: 'لا يوجد',
    customActivities: 'النشاطات المخصصة',
    addCustomActivity: 'إضافة نشاط مخصص',
    add: 'إضافة',
    activity: 'النشاط',
    trackerHelper: 'املأ التفاصيل ثم احفظ الجلسة.',
    trackerTimed: 'ابدأ المؤقت، املأ التفاصيل، ثم احفظ الجلسة.',
    trackerVehicle: 'صيانة السيارة تحفظ بدون مؤقت.',
    timer: 'المؤقت',
    start: 'بدء',
    end: 'إنهاء',
    saveToHistory: 'حفظ في السجل',
    timerNote: 'سيتم حفظ وقت البداية والنهاية.',
    historyTitle: 'الجلسات المحفوظة',
    historyCopy: 'صفّ، راجع، صدّر، واحذف جلساتك المحفوظة.',
    export: 'تصدير',
    clearAll: 'مسح الكل',
    filterActivity: 'تصفية النشاط',
    all: 'الكل',
    delete: 'حذف',
    noSessions: 'لا توجد جلسات محفوظة حتى الآن.',
    maintenanceRecord: 'سجل صيانة. لا يوجد مؤقت.',
    details: 'التفاصيل',
    noDetails: 'لا توجد تفاصيل محفوظة',
    sections: {
      sports: 'الرياضات والألعاب',
      fitness: 'اللياقة والحركة',
      life: 'تتبع الحياة اليومية',
      custom: 'نشاطات مخصصة',
    },
    helpers: {
      'Vehicle Maintenance': 'الخدمة، العداد، التكلفة، الملاحظات',
      Gym: 'يوم التمرين، التمارين، المؤقت',
      Football: 'الفرق، النتيجة، المؤقت',
      Padel: 'الفرق، الجولات، الفائز',
      Tennis: 'الفرق، الجولات، الفائز',
      Run: 'اللفات، المسافة، المؤقت',
      Walking: 'اللفات، المسافة، المؤقت',
      Cycling: 'اللفات، المسافة، المؤقت',
      Swimming: 'اللفات، المسافة، المؤقت',
      Baloot: 'النقاط، الموزع، الفائز',
      'Horse Riding': 'الخيل، التدريب، ملاحظات العناية',
      Golf: 'عدد الكرات، العصا، ملاحظات الملعب',
      Studying: 'المادة، نوع الدراسة، الملاحظات',
      default: 'جلسة بوقت وملاحظات',
    },
    activities: {
      Football: 'كرة القدم',
      Gym: 'النادي',
      Run: 'الجري',
      Padel: 'بادل',
      Tennis: 'تنس',
      Golf: 'جولف',
      'Horse Riding': 'ركوب الخيل',
      Cycling: 'الدراجات',
      Walking: 'المشي',
      Swimming: 'السباحة',
      Studying: 'الدراسة',
      Baloot: 'بلوت',
      'Vehicle Maintenance': 'صيانة السيارة',
    },
  },
};

const lapActivities = ['Run', 'Walking', 'Cycling', 'Swimming'];
const matchActivities = ['Padel', 'Tennis'];
const views = {
  auth: document.querySelector('#auth-view'),
  home: document.querySelector('#home-view'),
  tracker: document.querySelector('#tracker-view'),
  history: document.querySelector('#history-view'),
};

const state = {
  authMode: 'signin',
  currentView: 'auth',
  previousView: null,
  selectedActivity: null,
  startTime: null,
  endTime: null,
  timerId: null,
  language: localStorage.getItem(storageKeys.language) || 'en',
  sessions: readJson(storageKeys.sessions, []),
  customActivities: readJson(storageKeys.customActivities, []),
};

const authCard = document.querySelector('.auth-card');
const authForm = document.querySelector('#auth-form');
const authTitle = document.querySelector('#auth-title');
const authDescription = document.querySelector('#auth-description');
const authSubmit = document.querySelector('#auth-submit');
const authMessage = document.querySelector('#auth-message');
const identifierInput = document.querySelector('input[name="identifier"]');
const firstNameInput = document.querySelector('input[name="firstName"]');
const lastNameInput = document.querySelector('input[name="lastName"]');
const passwordInput = document.querySelector('#auth-password');
const repeatPasswordInput = document.querySelector('input[name="repeatPassword"]');
const recoveryCodeInput = document.querySelector('input[name="recoveryCode"]');
const newPasswordInput = document.querySelector('input[name="newPassword"]');
const passkeyButton = document.querySelector('#passkey-button');
const forgotButton = document.querySelector('#forgot-button');
const signupCancelButton = document.querySelector('#signup-cancel-button');
const appleSignupButton = document.querySelector('#apple-signup-button');
const facebookSignupButton = document.querySelector('#facebook-signup-button');
const recoveryCard = document.querySelector('#recovery-card');
const recoveryCodeOutput = document.querySelector('#recovery-code');
const backButton = document.querySelector('#back-button');
const languageButton = document.querySelector('#language-button');
const logoutButton = document.querySelector('#logout-button');
const welcomeText = document.querySelector('#welcome-text');
const activityGrid = document.querySelector('#activity-grid');
const customActivityForm = document.querySelector('#custom-activity-form');
const trackerView = document.querySelector('#tracker-view');
const trackerTitle = document.querySelector('#tracker-title');
const trackerHelper = document.querySelector('#tracker-helper');
const timerDisplay = document.querySelector('#timer-display');
const timerNote = document.querySelector('#timer-note');
const startButton = document.querySelector('#start-button');
const endButton = document.querySelector('#end-button');
const sessionForm = document.querySelector('#session-form');
const activityFields = document.querySelector('#activity-fields');
const sessionMessage = document.querySelector('#session-message');
const historyFilter = document.querySelector('#history-filter');
const historyList = document.querySelector('#history-list');
const clearHistoryButton = document.querySelector('#clear-history-button');
const exportHistoryButton = document.querySelector('#export-history-button');
const totalSessions = document.querySelector('#total-sessions');
const lastActivity = document.querySelector('#last-activity');
const customCount = document.querySelector('#custom-count');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function text(key) {
  return translations[state.language][key] ?? translations.en[key] ?? key;
}

function activityLabel(activity) {
  return translations[state.language].activities[activity] || activity;
}

function activityHelper(activity) {
  return translations[state.language].helpers[activity] || translations[state.language].helpers.default;
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
  languageButton.textContent = text('languageButton');
  backButton.textContent = text('back');
  logoutButton.textContent = text('logout');
  setText('#auth-eyebrow', text('authEyebrow'));
  setText('#hero-title', text('heroTitle'));
  setText('#hero-copy', text('heroCopy'));
  setText('#signin-tab', text('signIn'));
  setText('#signup-tab', text('signUp'));
  setText('#name-label', text('name'));
  setText('#identifier-label', text('identifier'));
  setText('#password-label', text('password'));
  setText('#repeat-password-label', text('repeatPassword'));
  setText('#password-minimum', text('passwordMinimum'));
  setText('#recovery-label', text('recoveryCode'));
  setText('#new-password-label', text('newPassword'));
  setText('#passkey-button', text('passkey'));
  setText('#signup-legal', text('signupLegal'));
  setText('#signup-divider', text('or'));
  setText('#apple-signup-button', text('appleSignup'));
  setText('#facebook-signup-button', text('facebookSignup'));
  setText('#recovery-card-title', text('saveRecoveryCode'));
  setText('#recovery-card-text', text('recoveryHelp'));
  setText('#security-title', text('securityTitle'));
  setText('#security-text', text('securityText'));
  setText('#home-eyebrow', text('home'));
  setText('#home-title', text('homeTitle'));
  setText('#home-history-button', text('history'));
  setText('#total-sessions-label', text('totalSessions'));
  setText('#last-activity-label', text('lastActivity'));
  setText('#custom-count-label', text('customActivities'));
  setText('#custom-activity-label', text('addCustomActivity'));
  setText('#custom-activity-button', text('add'));
  setText('#tracker-eyebrow', text('activity'));
  setText('#tracker-history-button', text('history'));
  setText('#timer-label', text('timer'));
  setText('#start-button', text('start'));
  setText('#end-button', text('end'));
  setText('#save-session-button', text('saveToHistory'));
  setText('#history-eyebrow', text('history'));
  setText('#history-title', text('historyTitle'));
  setText('#history-copy', text('historyCopy'));
  setText('#export-history-button', text('export'));
  setText('#clear-history-button', text('clearAll'));
  setText('#history-filter-label', text('filterActivity'));
  setAuthMode(state.authMode);
  renderHome();
  renderHistory();

  if (state.selectedActivity) {
    trackerTitle.textContent = activityLabel(state.selectedActivity);
  }
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function base64ToBytes(base64) {
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

function randomToken(byteLength = 24) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToBase64(bytes).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

async function hashSecret(secret, saltBase64) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: base64ToBytes(saltBase64),
      iterations: passwordIterations,
    },
    keyMaterial,
    256
  );

  return bytesToBase64(bits);
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

function formatTime(date) {
  if (!date) {
    return 'Not set';
  }

  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(safeSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
}

function getActivities() {
  return [...defaultActivities, ...state.customActivities];
}

function setAuthMode(mode) {
  state.authMode = mode;
  const isSignup = mode === 'signup';
  const isReset = mode === 'reset';

  authCard.classList.toggle('signup-mode', isSignup);
  authCard.classList.toggle('reset-mode', isReset);
  authTitle.textContent = isSignup
    ? text('createAccount')
    : isReset
      ? text('recoverAccount')
      : text('welcomeBack');
  authDescription.textContent = isSignup
    ? text('createProfile')
    : isReset
      ? text('resetDescription')
      : text('signInDescription');
  authSubmit.textContent = isSignup ? text('createAccount') : isReset ? text('resetPassword') : text('signIn');
  identifierInput.required = !isReset;
  firstNameInput.required = isSignup;
  lastNameInput.required = isSignup;
  passwordInput.required = !isReset;
  repeatPasswordInput.required = isSignup;
  recoveryCodeInput.required = isReset;
  newPasswordInput.required = isReset;
  passwordInput.closest('label').style.display = isReset ? 'none' : 'grid';
  passwordInput.autocomplete = isSignup ? 'new-password' : 'current-password';
  passkeyButton.style.display = isSignup || isReset ? 'none' : 'inline-flex';
  forgotButton.textContent = isReset ? text('backToSignin') : text('forgot');
  recoveryCard.classList.add('hidden');
  authMessage.textContent = '';

  document.querySelectorAll('[data-auth-mode]').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.authMode === mode);
  });
}

function currentUser() {
  return readJson(storageKeys.user, null);
}

function isSignedIn() {
  return sessionStorage.getItem(storageKeys.activeSession) === 'true';
}

function markSignedIn() {
  sessionStorage.setItem(storageKeys.activeSession, 'true');
}

async function createPasskey(user) {
  if (!window.PublicKeyCredential || !navigator.credentials) {
    throw new Error('Passkeys are not supported in this browser.');
  }

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: {
        name: 'ActiveTrack',
      },
      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: user.identifier,
        displayName: user.fullName || user.identifier,
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60000,
      attestation: 'none',
    },
  });

  return {
    credentialId: bytesToBase64(credential.rawId),
    createdAt: new Date().toISOString(),
  };
}

async function loginWithPasskey() {
  const user = currentUser();

  if (!user?.passkey?.credentialId) {
    authMessage.textContent = 'No Face ID / passkey is registered yet.';
    return;
  }

  if (!window.PublicKeyCredential || !navigator.credentials) {
    authMessage.textContent = 'Passkeys are not supported in this browser.';
    return;
  }

  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [
          {
            type: 'public-key',
            id: base64ToBytes(user.passkey.credentialId),
          },
        ],
        userVerification: 'required',
        timeout: 60000,
      },
    });

    if (assertion) {
      markSignedIn();
      authMessage.textContent = 'Face ID / passkey accepted.';
      showView('home');
    }
  } catch (error) {
    authMessage.textContent = 'Face ID / passkey was cancelled or failed.';
  }
}

function showView(viewName, remember = true) {
  if (viewName !== 'auth' && !isSignedIn()) {
    viewName = 'auth';
  }

  if (remember && state.currentView !== viewName) {
    state.previousView = state.currentView;
  }

  state.currentView = viewName;

  Object.entries(views).forEach(([name, view]) => {
    view.classList.toggle('active', name === viewName);
  });

  const loggedIn = isSignedIn();
  logoutButton.classList.toggle('hidden', !loggedIn);
  backButton.classList.toggle('hidden', !loggedIn || viewName === 'home' || viewName === 'auth');

  if (viewName === 'home') {
    renderHome();
  }

  if (viewName === 'history') {
    renderHistory();
  }
}

function renderHome() {
  const user = readJson(storageKeys.user, null);
  welcomeText.textContent = user
    ? text('welcomeUser')(user.fullName || user.identifier)
    : text('welcome');

  totalSessions.textContent = String(state.sessions.length);
  lastActivity.textContent = state.sessions[0] ? activityLabel(state.sessions[0].activity) : text('none');
  customCount.textContent = String(state.customActivities.length);

  const sectionHtml = activitySections
    .map((section) => renderActivitySection(section.key, section.activities))
    .join('');
  const customHtml =
    state.customActivities.length > 0
      ? renderActivitySection('custom', state.customActivities)
      : '';

  activityGrid.innerHTML = sectionHtml + customHtml;
}

function renderActivitySection(sectionKey, activities) {
  return `
    <section class="activity-section">
      <h2>${translations[state.language].sections[sectionKey]}</h2>
      <div class="activity-section-grid">
        ${activities
          .map(
            (activity) => `
              <button class="activity-card" type="button" data-activity="${activity}">
                <strong>${activityLabel(activity)}</strong>
                <span>${activityHelper(activity)}</span>
              </button>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

function openTracker(activity) {
  state.selectedActivity = activity;
  state.startTime = null;
  state.endTime = null;
  stopTimer();
  timerDisplay.textContent = '00:00:00';
  timerNote.textContent = text('timerNote');
  sessionMessage.textContent = '';
  trackerTitle.textContent = activityLabel(activity);
  trackerHelper.textContent =
    activity === 'Vehicle Maintenance'
      ? text('trackerVehicle')
      : text('trackerTimed');
  trackerView.classList.toggle('vehicle-mode', activity === 'Vehicle Maintenance');
  activityFields.innerHTML = getFieldsForActivity(activity);
  bindConditionalFields();
  sessionForm.reset();
  showView('tracker');
}

function getFieldsForActivity(activity) {
  if (activity === 'Football') {
    return fieldGrid([
      inputField('Team 1', 'teamOneName', 'Home team'),
      inputField('Team 2', 'teamTwoName', 'Away team'),
      inputField('Team 1 score', 'teamOneScore', '0', 'number'),
      inputField('Team 2 score', 'teamTwoScore', '0', 'number'),
    ]);
  }

  if (activity === 'Gym') {
    return fieldGrid([
      selectField('Workout day', 'gymWorkoutDay', ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Rest']),
      textAreaField('Exercises', 'gymExercises', 'Bench press - 3 sets x 10 reps', true),
    ]);
  }

  if (lapActivities.includes(activity)) {
    return fieldGrid([
      inputField('Laps', 'laps', '4', 'number'),
      inputField('Lap distance', 'lapDistance', activity === 'Cycling' ? '1' : '400', 'number'),
      selectField('Unit', 'lapDistanceUnit', ['m', 'km']),
      textAreaField('Notes', 'notes', 'How did it feel?', true),
    ]);
  }

  if (matchActivities.includes(activity)) {
    return fieldGrid([
      inputField('Team 1', 'matchTeamOneName', 'Us'),
      inputField('Team 2', 'matchTeamTwoName', 'Them'),
      inputField('Team 1 games', 'matchTeamOneTotal', '0', 'number'),
      inputField('Team 2 games', 'matchTeamTwoTotal', '0', 'number'),
      textAreaField('Rounds notes', 'matchRounds', 'Round 1: 6-4', true),
    ]);
  }

  if (activity === 'Baloot') {
    return fieldGrid([
      inputField('US score', 'balootUsTotal', '152', 'number'),
      inputField('THEM score', 'balootThemTotal', '120', 'number'),
      selectField('Dealer direction', 'balootDealerDirection', ['Up', 'Right', 'Down', 'Left']),
      textAreaField('Score notes', 'balootScores', 'Add score rounds here', true),
    ]);
  }

  if (activity === 'Horse Riding') {
    return `
      <div class="horse-form">
        ${fieldSection(horseText('trainingSection'), [
          inputField(horseText('riderName'), 'riderName', horseText('riderNamePlaceholder')),
          inputField(horseText('horseName'), 'horseName', horseText('horseNamePlaceholder')),
          inputField(horseText('trainingType'), 'trainingType', horseText('trainingTypePlaceholder')),
          selectField(horseText('trainingIntensity'), 'trainingIntensity', [
            horseText('easy'),
            horseText('medium'),
            horseText('hard'),
          ]),
          inputField(horseText('trainingTime'), 'trainingTime', '45 min'),
          checkboxField(horseText('restDay'), 'restDay'),
          inputField(horseText('walkingMinutes'), 'walkingMinutes', '20', 'number'),
        ])}
        ${fieldSection(horseText('gaitTrackingSection'), [
          inputField(horseText('walkMinutes'), 'walkMinutes', '10', 'number'),
          inputField(horseText('trotMinutes'), 'trotMinutes', '15', 'number'),
          inputField(horseText('canterMinutes'), 'canterMinutes', '8', 'number'),
        ])}
        ${fieldSection(horseText('dailyCareSection'), [
          checkboxField(horseText('hayGiven'), 'hayGiven'),
          checkboxField(horseText('waterChecked'), 'waterChecked'),
          checkboxField(horseText('foodOilGiven'), 'foodOilGiven'),
          inputField(horseText('foodOilBuyingDate'), 'foodOilBuyingDate', '06/07/2026'),
          checkboxField(horseText('hoofOilUsed'), 'hoofOilUsed'),
          inputField(horseText('hoofOilBuyingDate'), 'hoofOilBuyingDate', '06/07/2026'),
        ])}
        ${fieldSection(horseText('cleaningSection'), [
          checkboxField(horseText('shampooUsed'), 'shampooUsed'),
          inputField(horseText('shampooBuyingDate'), 'shampooBuyingDate', '06/07/2026'),
          checkboxField(horseText('padsCleaningSuppliesUsed'), 'padsCleaningSuppliesUsed'),
          inputField(horseText('padsCleaningSuppliesBuyingDate'), 'padsCleaningSuppliesBuyingDate', horseText('padsDatePlaceholder')),
        ])}
        ${fieldSection(horseText('monthlyFeedSection'), [
          inputField(horseText('releveAmount'), 'releveAmount', '2 kg'),
          inputField(horseText('releveBuyingDate'), 'releveBuyingDate', '06/07/2026'),
          inputField(horseText('equiJewelAmount'), 'equiJewelAmount', '0.5 kg'),
          inputField(horseText('equiJewelBuyingDate'), 'equiJewelBuyingDate', '06/07/2026'),
        ])}
        ${fieldSection(horseText('dressageSection'), [
          checkboxField(horseText('dressageTestDay'), 'dressageTestDay', 'dressage-fields'),
          conditionalFields('dressage-fields', [
            inputField(horseText('dressageTestName'), 'dressageTestName', horseText('dressageTestName')),
            inputField(horseText('dressageScore'), 'dressageScore', '68.5', 'number'),
            textAreaField(horseText('dressageNotes'), 'dressageNotes', horseText('dressageNotes'), true),
          ]),
        ])}
        ${fieldSection(horseText('jumpingSection'), [
          checkboxField(horseText('jumpingDay'), 'jumpingDay', 'jumping-fields'),
          conditionalFields('jumping-fields', [
            inputField(horseText('fenceHeight'), 'fenceHeight', '80 cm'),
            inputField(horseText('fenceCount'), 'fenceCount', '8', 'number'),
            textAreaField(horseText('jumpingNotes'), 'jumpingNotes', horseText('jumpingNotes'), true),
          ]),
        ])}
        ${fieldSection(horseText('notesSection'), [
          textAreaField(horseText('horseNotes'), 'horseNotes', horseText('horseNotes'), true),
        ])}
      </div>
    `;
  }

  if (activity === 'Vehicle Maintenance') {
    return fieldGrid([
      inputField('Vehicle name', 'vehicleName', 'Car name'),
      selectField('Service type', 'serviceType', ['Tire service', 'Battery service', 'Oil service', 'Gas', 'Other service']),
      inputField('Mileage', 'mileage', '12000'),
      inputField('Cost', 'cost', '150'),
      textAreaField('Notes', 'notes', 'What was done?', true),
    ]);
  }

  if (activity === 'Golf') {
    return fieldGrid([
      inputField('Balls hit', 'ballsHit', '80', 'number'),
      inputField('Club', 'club', '7 iron'),
      inputField('Range name', 'rangeName', 'Driving range'),
      textAreaField('Notes', 'notes', 'Practice notes', true),
    ]);
  }

  if (activity === 'Studying') {
    return fieldGrid([
      inputField('Subject', 'subject', 'Math'),
      inputField('Study type', 'studyType', 'Exam, coursework, review'),
      textAreaField('Notes', 'notes', 'What did you study?', true),
    ]);
  }

  return fieldGrid([
    inputField('Session title', 'title', activity),
    textAreaField('Notes', 'notes', 'Add details', true),
  ]);
}

function fieldGrid(fields) {
  return `<div class="field-grid">${fields.join('')}</div>`;
}

function fieldSection(title, fields) {
  return `
    <section class="field-section">
      <h2>${title}</h2>
      <div class="field-grid">${fields.join('')}</div>
    </section>
  `;
}

function inputField(label, name, placeholder, type = 'text') {
  return `
    <label>
      ${label}
      <input name="${name}" type="${type}" placeholder="${placeholder}" />
    </label>
  `;
}

function checkboxField(label, name, controls = '') {
  return `
    <label class="checkbox-field">
      <input name="${name}" type="checkbox" value="true" ${controls ? `data-controls="${controls}"` : ''} />
      <span>${label}</span>
    </label>
  `;
}

function conditionalFields(id, fields) {
  return `
    <div class="conditional-fields full hidden" id="${id}">
      ${fields.join('')}
    </div>
  `;
}

function bindConditionalFields() {
  activityFields.querySelectorAll('[data-controls]').forEach((control) => {
    const target = document.querySelector(`#${control.dataset.controls}`);

    if (!target) {
      return;
    }

    const updateVisibility = () => {
      target.classList.toggle('hidden', !control.checked);
    };

    control.addEventListener('change', updateVisibility);
    updateVisibility();
  });
}

function selectField(label, name, options) {
  return `
    <label>
      ${label}
      <select name="${name}">
        ${options.map((option) => `<option>${option}</option>`).join('')}
      </select>
    </label>
  `;
}

function textAreaField(label, name, placeholder, full = false) {
  return `
    <label class="${full ? 'full' : ''}">
      ${label}
      <textarea name="${name}" placeholder="${placeholder}"></textarea>
    </label>
  `;
}

function horseText(key) {
  const labels = {
    en: {
      trainingSection: 'Training',
      riderName: 'Rider name',
      riderNamePlaceholder: 'Rider name',
      horseName: 'Horse name',
      horseNamePlaceholder: 'Horse name, example: Durkji',
      trainingType: 'Training type',
      trainingTypePlaceholder: 'Dressage / Flatwork / Jumping',
      trainingIntensity: 'Training intensity',
      trainingTime: 'Time of training',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      restDay: 'Rest Day',
      walkingMinutes: 'Daily walking minutes',
      gaitTrackingSection: 'Gait Tracking',
      walkMinutes: 'Walk minutes',
      trotMinutes: 'Trot minutes',
      canterMinutes: 'Canter minutes',
      dailyCareSection: 'Daily Care',
      hayGiven: 'Hay Given',
      waterChecked: 'Water Checked',
      foodOilGiven: 'Food Oil Given',
      foodOilBuyingDate: 'Food oil buying date',
      hoofOilUsed: 'Hoof Oil Used',
      hoofOilBuyingDate: 'Hoof oil buying date',
      cleaningSection: 'Cleaning Supplies',
      shampooUsed: 'Shampoo Used',
      shampooBuyingDate: 'Shampoo buying date',
      padsCleaningSuppliesUsed: 'Pads Cleaning Supplies Used',
      padsCleaningSuppliesBuyingDate: 'Pads cleaning supplies buying date',
      padsDatePlaceholder: 'Pads cleaning supplies buying date',
      monthlyFeedSection: 'Monthly Feed',
      releveAmount: 'Re-Leve amount',
      releveBuyingDate: 'Re-Leve buying date',
      equiJewelAmount: 'Equi Jewel amount',
      equiJewelBuyingDate: 'Equi Jewel buying date',
      dressageSection: 'Dressage Test',
      dressageTestDay: 'Dressage Test Day',
      dressageTestName: 'Dressage test name',
      dressageScore: 'Dressage score %',
      dressageNotes: 'Dressage judge notes',
      jumpingSection: 'Jumping',
      jumpingDay: 'Jumping Day',
      fenceHeight: 'Fence height',
      fenceCount: 'Fence count',
      jumpingNotes: 'Jumping notes',
      notesSection: 'Notes',
      horseNotes: 'Horse riding notes',
    },
    ar: {
      trainingSection: 'التدريب',
      riderName: 'اسم الراكب',
      riderNamePlaceholder: 'اسم الراكب',
      horseName: 'اسم الخيل',
      horseNamePlaceholder: 'اسم الخيل، مثال: Durkji',
      trainingType: 'نوع التدريب',
      trainingTypePlaceholder: 'دريساج / فلات وورك / قفز',
      trainingIntensity: 'شدة التدريب',
      trainingTime: 'وقت التدريب',
      easy: 'سهل',
      medium: 'متوسط',
      hard: 'صعب',
      restDay: 'يوم راحة',
      walkingMinutes: 'دقائق المشي اليومية',
      gaitTrackingSection: 'تتبع المشيات',
      walkMinutes: 'دقائق المشي',
      trotMinutes: 'دقائق التروت',
      canterMinutes: 'دقائق الكانتر',
      dailyCareSection: 'العناية اليومية',
      hayGiven: 'تم إعطاء التبن',
      waterChecked: 'تم فحص الماء',
      foodOilGiven: 'تم إعطاء زيت الطعام',
      foodOilBuyingDate: 'تاريخ شراء زيت الطعام',
      hoofOilUsed: 'تم استخدام زيت الحافر',
      hoofOilBuyingDate: 'تاريخ شراء زيت الحافر',
      cleaningSection: 'مستلزمات التنظيف',
      shampooUsed: 'تم استخدام الشامبو',
      shampooBuyingDate: 'تاريخ شراء الشامبو',
      padsCleaningSuppliesUsed: 'تم استخدام الباد ومستلزمات التنظيف',
      padsCleaningSuppliesBuyingDate: 'تاريخ شراء الباد ومستلزمات التنظيف',
      padsDatePlaceholder: 'تاريخ شراء الباد ومستلزمات التنظيف',
      monthlyFeedSection: 'الأكل الشهري',
      releveAmount: 'كمية Re-Leve',
      releveBuyingDate: 'تاريخ شراء Re-Leve',
      equiJewelAmount: 'كمية Equi Jewel',
      equiJewelBuyingDate: 'تاريخ شراء Equi Jewel',
      dressageSection: 'اختبار الدريساج',
      dressageTestDay: 'يوم اختبار دريساج',
      dressageTestName: 'اسم اختبار الدريساج',
      dressageScore: 'درجة الدريساج %',
      dressageNotes: 'ملاحظات الحكم للدريساج',
      jumpingSection: 'القفز',
      jumpingDay: 'يوم قفز',
      fenceHeight: 'ارتفاع الحاجز',
      fenceCount: 'عدد الحواجز',
      jumpingNotes: 'ملاحظات القفز',
      notesSection: 'ملاحظات',
      horseNotes: 'ملاحظات ركوب الخيل',
    },
  };

  return labels[state.language][key] || labels.en[key] || key;
}

function startTimer() {
  state.startTime = new Date();
  state.endTime = null;
  stopTimer();
  updateTimer();
  state.timerId = window.setInterval(updateTimer, 1000);
  timerNote.textContent = `Started at ${formatTime(state.startTime)}.`;
}

function endTimer() {
  if (!state.startTime) {
    sessionMessage.textContent = 'Start the timer first.';
    return;
  }

  state.endTime = new Date();
  stopTimer();
  updateTimer();
  timerNote.textContent = `Started ${formatTime(state.startTime)} and ended ${formatTime(state.endTime)}.`;
}

function stopTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateTimer() {
  const end = state.endTime || new Date();
  const seconds = state.startTime ? (end - state.startTime) / 1000 : 0;
  timerDisplay.textContent = formatDuration(seconds);
}

function saveSession(event) {
  event.preventDefault();

  const activity = state.selectedActivity;
  const isVehicle = activity === 'Vehicle Maintenance';

  if (!activity) {
    return;
  }

  if (!isVehicle && !state.startTime) {
    sessionMessage.textContent = 'Start the timer before saving.';
    return;
  }

  if (!isVehicle && !state.endTime) {
    state.endTime = new Date();
    stopTimer();
  }

  const details = getSessionDetails();
  const durationSeconds = isVehicle ? 0 : Math.floor((state.endTime - state.startTime) / 1000);
  const now = new Date();

  const session = {
    id: Date.now(),
    activity,
    date: now.toISOString(),
    start: isVehicle ? '' : state.startTime.toISOString(),
    end: isVehicle ? '' : state.endTime.toISOString(),
    duration: isVehicle ? '' : formatDuration(durationSeconds),
    durationSeconds,
    details,
  };

  state.sessions = [session, ...state.sessions];
  writeJson(storageKeys.sessions, state.sessions);
  sessionMessage.textContent = 'Saved to History.';
  renderHome();
  renderHistory();
}

function getSessionDetails() {
  const details = {};

  sessionForm.querySelectorAll('input, select, textarea').forEach((field) => {
    if (!field.name) {
      return;
    }

    if (field.type === 'checkbox') {
      details[field.name] = field.checked;
      return;
    }

    details[field.name] = field.value;
  });

  return details;
}

function renderHistory() {
  const selected = historyFilter.value || 'All';
  const activities = ['All', ...new Set(state.sessions.map((session) => session.activity))];
  historyFilter.innerHTML = activities
    .map((activity) => {
      const label = activity === 'All' ? text('all') : activityLabel(activity);
      return `<option value="${activity}">${label}</option>`;
    })
    .join('');
  historyFilter.value = activities.includes(selected) ? selected : 'All';

  const filteredSessions =
    historyFilter.value === 'All'
      ? state.sessions
      : state.sessions.filter((session) => session.activity === historyFilter.value);

  if (filteredSessions.length === 0) {
    historyList.innerHTML = `<div class="empty-state">${text('noSessions')}</div>`;
    return;
  }

  historyList.innerHTML = filteredSessions
    .map((session) => {
      const details = Object.entries(session.details || {})
        .filter(([, value]) => String(value).trim() !== '')
        .map(([key, value]) => `<div><span>${labelFromKey(key)}</span>${value}</div>`)
        .join('');

      return `
        <article class="history-card">
          <header>
            <div>
              <h3>${activityLabel(session.activity)}</h3>
              <span>${formatDate(session.date)}</span>
            </div>
            <button class="button danger" type="button" data-delete-session="${session.id}">${text('delete')}</button>
          </header>
          ${
            session.activity === 'Vehicle Maintenance'
              ? `<p>${text('maintenanceRecord')}</p>`
              : `<p>${formatTime(session.start)} to ${formatTime(session.end)} - ${session.duration}</p>`
          }
          <div class="history-details">${details || `<div><span>${text('details')}</span>${text('noDetails')}</div>`}</div>
        </article>
      `;
    })
    .join('');
}

function labelFromKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase());
}

function clearHistory() {
  if (state.sessions.length === 0) {
    return;
  }

  state.sessions = [];
  writeJson(storageKeys.sessions, state.sessions);
  renderHome();
  renderHistory();
}

function exportHistory() {
  const user = readJson(storageKeys.user, null);
  const exportData = {
    app: 'ActiveTrack Web',
    exportedAt: new Date().toISOString(),
    user: user
      ? {
          fullName: user.fullName,
          identifier: user.identifier,
          goal: user.goal,
        }
      : null,
    customActivities: state.customActivities,
    sessions: state.sessions,
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStamp = new Date().toISOString().slice(0, 10);

  link.href = downloadUrl;
  link.download = `activetrack-history-${dateStamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
}

document.querySelectorAll('[data-auth-mode]').forEach((tab) => {
  tab.addEventListener('click', () => setAuthMode(tab.dataset.authMode));
});

languageButton.addEventListener('click', () => {
  state.language = state.language === 'en' ? 'ar' : 'en';
  localStorage.setItem(storageKeys.language, state.language);
  applyLanguage();
});

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(authForm);
  const identifier = String(formData.get('identifier') || '').trim();
  const firstName = String(formData.get('firstName') || '').trim();
  const lastName = String(formData.get('lastName') || '').trim();
  const fullName = `${firstName} ${lastName}`.trim() || identifier;
  const password = String(formData.get('password') || '');
  const repeatPassword = String(formData.get('repeatPassword') || '');
  const newPassword = String(formData.get('newPassword') || '');
  const recoveryCode = String(formData.get('recoveryCode') || '').trim();

  try {
    if (state.authMode === 'signup') {
      if (password.length < 8) {
        authMessage.textContent = 'Use at least 8 characters for your password.';
        return;
      }

      if (password !== repeatPassword) {
        authMessage.textContent = 'Passwords do not match.';
        return;
      }

      const passwordSalt = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
      const recoverySalt = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
      const generatedRecoveryCode = randomToken(18);
      const user = {
        schemaVersion: 2,
        createdAt: new Date().toISOString(),
        firstName,
        lastName,
        fullName,
        identifier,
        goal: null,
        passwordSalt,
        passwordHash: await hashSecret(password, passwordSalt),
        recoverySalt,
        recoveryHash: await hashSecret(generatedRecoveryCode, recoverySalt),
        passkey: null,
      };

      try {
        user.passkey = await createPasskey(user);
        authMessage.textContent = `Account created. Face ID / passkey is ready.`;
      } catch (error) {
        authMessage.textContent = `Account created. Passkey setup can be added later.`;
      }

      writeJson(storageKeys.user, user);
      recoveryCodeOutput.textContent = generatedRecoveryCode;
      recoveryCard.classList.remove('hidden');
      authForm.reset();
      setAuthMode('signin');
      recoveryCard.classList.remove('hidden');
      authMessage.textContent = user.passkey
        ? 'Account created. Face ID / passkey is ready.'
        : 'Account created. Save your recovery code before signing in.';
      return;
    }

    if (state.authMode === 'reset') {
      const savedUser = currentUser();

      if (!savedUser?.recoveryHash || !savedUser?.recoverySalt) {
        authMessage.textContent = 'No recoverable account exists on this device.';
        return;
      }

      if (newPassword.length < 8) {
        authMessage.textContent = 'Use at least 8 characters for the new password.';
        return;
      }

      const recoveryHash = await hashSecret(recoveryCode, savedUser.recoverySalt);

      if (!timingSafeEqual(recoveryHash, savedUser.recoveryHash)) {
        authMessage.textContent = 'Recovery code is not correct.';
        return;
      }

      const passwordSalt = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
      savedUser.passwordSalt = passwordSalt;
      savedUser.passwordHash = await hashSecret(newPassword, passwordSalt);
      savedUser.updatedAt = new Date().toISOString();
      writeJson(storageKeys.user, savedUser);
      authForm.reset();
      setAuthMode('signin');
      authMessage.textContent = `Password reset. Your username is ${savedUser.identifier}.`;
      return;
    }

    const savedUser = currentUser();

    if (!savedUser) {
      authMessage.textContent = 'Create an account first on this device.';
      return;
    }

    if (!savedUser.passwordHash || !savedUser.passwordSalt) {
      writeJson(storageKeys.user, {
        ...savedUser,
        identifier: savedUser.identifier || identifier,
      });
      markSignedIn();
      showView('home');
      return;
    }

    if (identifier && identifier !== savedUser.identifier) {
      authMessage.textContent = 'That username or phone is not saved on this device.';
      return;
    }

    const passwordHash = await hashSecret(password, savedUser.passwordSalt);

    if (!timingSafeEqual(passwordHash, savedUser.passwordHash)) {
      authMessage.textContent = 'Password is not correct.';
      return;
    }

    markSignedIn();
    showView('home');
    authForm.reset();
  } catch (error) {
    authMessage.textContent = 'Security action failed. Try again.';
  }
});

forgotButton.addEventListener('click', () => {
  setAuthMode(state.authMode === 'reset' ? 'signin' : 'reset');
});

passkeyButton.addEventListener('click', loginWithPasskey);
signupCancelButton.addEventListener('click', () => setAuthMode('signin'));
appleSignupButton.addEventListener('click', () => {
  authMessage.textContent = 'Apple sign-up can be connected later.';
});
facebookSignupButton.addEventListener('click', () => {
  authMessage.textContent = 'Facebook sign-up can be connected later.';
});

logoutButton.addEventListener('click', () => {
  stopTimer();
  sessionStorage.removeItem(storageKeys.activeSession);
  showView('auth', false);
});

backButton.addEventListener('click', () => {
  if (state.currentView === 'tracker') {
    showView('home');
    return;
  }

  showView(state.previousView && state.previousView !== 'auth' ? state.previousView : 'home', false);
});

document.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]');
  const activityButton = event.target.closest('[data-activity]');
  const deleteButton = event.target.closest('[data-delete-session]');

  if (viewButton) {
    event.preventDefault();
    showView(viewButton.dataset.view);
  }

  if (activityButton) {
    openTracker(activityButton.dataset.activity);
  }

  if (deleteButton) {
    state.sessions = state.sessions.filter((session) => String(session.id) !== deleteButton.dataset.deleteSession);
    writeJson(storageKeys.sessions, state.sessions);
    renderHome();
    renderHistory();
  }
});

customActivityForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(customActivityForm);
  const customActivity = String(formData.get('customActivity') || '').trim();

  if (!customActivity || getActivities().includes(customActivity)) {
    return;
  }

  state.customActivities = [...state.customActivities, customActivity];
  writeJson(storageKeys.customActivities, state.customActivities);
  customActivityForm.reset();
  renderHome();
});

startButton.addEventListener('click', startTimer);
endButton.addEventListener('click', endTimer);
sessionForm.addEventListener('submit', saveSession);
historyFilter.addEventListener('change', renderHistory);
clearHistoryButton.addEventListener('click', clearHistory);
exportHistoryButton.addEventListener('click', exportHistory);

setAuthMode('signin');
applyLanguage();
showView(isSignedIn() ? 'home' : 'auth', false);

function setupCanvas(canvas, drawFrame) {
  const context = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  let frameId = null;

  function frame(time) {
    drawFrame(context, width, height, motionQuery.matches ? 0 : time);
    if (!motionQuery.matches) {
      frameId = window.requestAnimationFrame(frame);
    }
  }

  frame(0);
}

const activityCanvas = document.querySelector('#activity-canvas');
const canvasLabels = ['Football', 'Gym', 'Run', 'Padel', 'Horse', 'Baloot', 'Vehicle', 'Study'];

setupCanvas(activityCanvas, (ctx, width, height, time) => {
  ctx.clearRect(0, 0, width, height);

  const centerX = width * 0.52;
  const centerY = height * 0.46;
  const baseRadius = Math.min(width, height) * 0.28;

  for (let i = 1; i <= 4; i += 1) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * (i / 4), 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.stroke();
  }

  canvasLabels.forEach((label, index) => {
    const angle = (Math.PI * 2 * index) / canvasLabels.length + time * 0.00014;
    const radius = baseRadius + Math.sin(time * 0.001 + index) * 22;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius * 0.72;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = index % 2 === 0 ? 'rgba(88, 166, 255, 0.18)' : 'rgba(110, 231, 183, 0.16)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 5 + (index % 3), 0, Math.PI * 2);
    ctx.fillStyle = index % 3 === 0 ? '#6ee7b7' : index % 3 === 1 ? '#58a6ff' : '#f6c177';
    ctx.fill();

    if (width > 760) {
      ctx.font = '600 12px Inter, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(244, 244, 245, 0.5)';
      ctx.fillText(label, x + 12, y + 4);
    }
  });
});
