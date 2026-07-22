const storageKeys = {
  // Keep the original keys so the Tafasili rebrand does not erase saved browser data.
  user: 'activetrack-web-user',
  sessions: 'activetrack-web-sessions',
  customActivities: 'activetrack-web-custom-activities',
  customTemplates: 'activetrack-web-custom-templates',
  customGroups: 'activetrack-web-custom-groups',
  activeSession: 'activetrack-web-session-active',
  language: 'activetrack-web-language',
  settings: 'tafasili-web-settings',
  draft: 'tafasili-web-draft',
};
const passwordIterations = 210000;
const cloudConfig = window.TAFASILI_SUPABASE;
const passwordRecoveryHashParams = new URLSearchParams(window.location.hash.slice(1));
const passwordRecoverySearchParams = new URLSearchParams(window.location.search);
const passwordRecoveryRequestedAtLoad =
  passwordRecoveryHashParams.get('type') === 'recovery' ||
  passwordRecoverySearchParams.get('type') === 'recovery';
const cloudClient = window.supabase && cloudConfig
  ? window.supabase.createClient(cloudConfig.url, cloudConfig.publishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

const defaultActivities = [
  'Football',
  'Gym',
  'Run',
  'Padel',
  'Tennis',
  'Golf',
  'Horse Riding',
  'Daily Care',
  'Supplies and Feed',
  'Riding Test',
  'Cycling',
  'Walking',
  'Swimming',
  'Studying',
  'Work',
  'Baloot',
  'Vehicle Maintenance',
  'Personal Info',
];

const activitySections = [
  {
    key: 'sportsGames',
    activities: ['Football', 'Padel', 'Tennis', 'Golf', 'Baloot'],
  },
  {
    key: 'fitnessMovement',
    activities: ['Gym', 'Run', 'Cycling', 'Walking', 'Swimming'],
  },
  {
    key: 'horse',
    activities: ['Horse Riding', 'Daily Care', 'Supplies and Feed', 'Riding Test'],
  },
  {
    key: 'studyWork',
    activities: ['Studying', 'Work'],
  },
  {
    key: 'lifeTracking',
    activities: ['Personal Info'],
  },
  {
    key: 'vehicle',
    activities: ['Vehicle Maintenance'],
  },
];

const horseActivities = ['Horse Riding', 'Daily Care', 'Supplies and Feed', 'Riding Test'];
const defaultUsabilitySettings = {
  favoriteActivities: [],
  recentActivities: [],
  dateFormat: 'day-first',
  measurementSystem: 'metric',
  defaultReminderDays: 30,
  notificationsEnabled: true,
  appLockEnabled: false,
  onboardingComplete: false,
};

const translations = {
  en: {
    languageButton: 'العربية',
    back: 'Back',
    logout: 'Logout',
    authEyebrow: 'Personal activity tracking',
    heroTitle: 'Your life, Organized.',
    heroCopy:
      'Your Tafasili account securely saves activity history to the cloud, while keeping an offline copy on this device.',
    signIn: 'Sign in',
    signUp: 'Sign up',
    welcomeBack: 'Welcome back',
    createAccount: 'Create your account',
    createProfile: 'Create a secure Tafasili cloud account.',
    signInDescription: 'Sign in to continue tracking on this device.',
    name: 'Name',
    signinIdentifier: 'Email or phone',
    signupIdentifier: 'Email or phone',
    password: 'Password',
    confirmPassword: 'Confirm password',
    passwordMinimum: 'Password must be at least 8 characters.',
    newPassword: 'New password',
    showPassword: 'Show',
    hidePassword: 'Hide',
    passkey: 'Use Face ID / Passkey',
    forgot: 'Forgot password?',
    signupLegal:
      'By creating a Tafasili account, you agree to save your data on this device. We never share your data.',
    or: 'Or',
    appleSignin: 'Log in with Apple',
    facebookSignin: 'Log in with Facebook',
    appleSignup: 'Sign up with Apple',
    facebookSignup: 'Sign up with Facebook',
    securityTitle: 'Secure cloud account',
    securityText:
      'Encrypted sign-in and private history protected by account-level access rules.',
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
    customFields: 'Reusable fields (separate with commas)',
    add: 'Add',
    activity: 'Activity',
    trackerHelper: 'Fill the details, then save the session.',
    trackerTimed: 'Start the timer, fill the details, then save the session.',
    trackerVehicle: 'Vehicle Maintenance saves without a timer.',
    trackerRecord: 'Personal Info saves as a record without a timer.',
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
    personalRecord: 'Personal information record. No timer used.',
    details: 'Details',
    noDetails: 'No details saved',
    sections: {
      sportsGames: 'Sports and games',
      fitnessMovement: 'Fitness and movement',
      horse: 'Horse activities',
      studyWork: 'Study and work',
      lifeTracking: 'Life tracking',
      vehicle: 'Vehicle and maintenance',
      custom: 'Custom activities',
    },
    helpers: {
      'Vehicle Maintenance': 'Service, mileage, cost, notes',
      'Personal Info': 'Document numbers and expiration dates',
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
      'Daily Care': 'Daily horse care, notes, reminder',
      'Supplies and Feed': 'Cleaning, monthly feed, farrier',
      'Riding Test': 'Dressage, jumping, notes',
      Golf: 'Balls, club, range notes',
      Studying: 'Subject, study type, notes',
      Work: 'Project, time, notes',
      default: 'Timed session and notes',
    },
    activities: {},
  },
  ar: {
    languageButton: 'English',
    back: 'رجوع',
    logout: 'تسجيل الخروج',
    authEyebrow: 'تتبع النشاطات الشخصية',
    heroTitle: 'كل تفاصيلك في مكان واحد',
    heroCopy:
      'يحفظ حساب تفاصيلي سجل نشاطاتك بأمان في السحابة، مع نسخة محلية على هذا الجهاز.',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    welcomeBack: 'مرحباً بعودتك',
    createAccount: 'إنشاء حساب',
    createProfile: 'أنشئ حساب تفاصيلي سحابياً وآمناً.',
    signInDescription: 'سجل الدخول لمتابعة التتبع على هذا الجهاز.',
    name: 'الاسم',
    signinIdentifier: 'البريد أو رقم الجوال',
    signupIdentifier: 'البريد أو رقم الجوال',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    passwordMinimum: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.',
    newPassword: 'كلمة مرور جديدة',
    showPassword: 'إظهار',
    hidePassword: 'إخفاء',
    passkey: 'استخدام Face ID / مفتاح المرور',
    forgot: 'نسيت كلمة المرور؟',
    signupLegal:
      'بإنشاء حساب تفاصيلي، أنت توافق على حفظ بياناتك على هذا الجهاز. لا نشارك بياناتك.',
    or: 'أو',
    appleSignin: 'تسجيل الدخول باستخدام Apple',
    facebookSignin: 'تسجيل الدخول باستخدام Facebook',
    appleSignup: 'إنشاء حساب باستخدام Apple',
    facebookSignup: 'إنشاء حساب باستخدام Facebook',
    securityTitle: 'حساب سحابي آمن',
    securityText:
      'تسجيل دخول مشفر وسجل خاص محمي بسياسات وصول خاصة بكل حساب.',
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
    customFields: 'حقول قابلة لإعادة الاستخدام (افصل بينها بفواصل)',
    add: 'إضافة',
    activity: 'النشاط',
    trackerHelper: 'املأ التفاصيل ثم احفظ الجلسة.',
    trackerTimed: 'ابدأ المؤقت، املأ التفاصيل، ثم احفظ الجلسة.',
    trackerVehicle: 'صيانة السيارة تحفظ بدون مؤقت.',
    trackerRecord: 'تحفظ المعلومات الشخصية كسجل بدون مؤقت.',
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
    personalRecord: 'سجل معلومات شخصية. لا يوجد مؤقت.',
    details: 'التفاصيل',
    noDetails: 'لا توجد تفاصيل محفوظة',
    sections: {
      sportsGames: 'الرياضات والألعاب',
      fitnessMovement: 'اللياقة والحركة',
      horse: 'أنشطة الخيل',
      studyWork: 'الدراسة والعمل',
      lifeTracking: 'تتبع الحياة',
      vehicle: 'المركبات والصيانة',
      custom: 'نشاطات مخصصة',
    },
    helpers: {
      'Vehicle Maintenance': 'الخدمة، العداد، التكلفة، الملاحظات',
      'Personal Info': 'أرقام الوثائق وتواريخ الانتهاء',
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
      'Daily Care': 'العناية اليومية بالخيل والملاحظات والتذكير',
      'Supplies and Feed': 'التنظيف والعلف الشهري والبيطار',
      'Riding Test': 'الدريساج والقفز والملاحظات',
      Golf: 'عدد الكرات، العصا، ملاحظات الملعب',
      Studying: 'المادة، نوع الدراسة، الملاحظات',
      Work: 'المشروع، الوقت، الملاحظات',
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
      'Daily Care': 'العناية اليومية',
      'Supplies and Feed': 'المستلزمات والعلف',
      'Riding Test': 'اختبار الركوب',
      Cycling: 'الدراجات',
      Walking: 'المشي',
      Swimming: 'السباحة',
      Studying: 'الدراسة',
      Work: 'العمل',
      Baloot: 'بلوت',
      'Vehicle Maintenance': 'صيانة السيارة',
      'Personal Info': 'المعلومات الشخصية',
    },
  },
};

const lapActivities = ['Run', 'Walking', 'Cycling', 'Swimming'];
const movementActivities = ['Run', 'Walking', 'Cycling'];
const matchActivities = ['Padel', 'Tennis'];
const balootDealerDirections = ['↑', '→', '↓', '←'];
const gymWorkoutDays = ['Chest', 'Back', 'Legs', 'Shoulder', 'Arms', 'Abs', 'Rest'];
const STUDY_CANDLE_DURATION_SECONDS = 3 * 60 * 60;
const views = {
  auth: document.querySelector('#auth-view'),
  home: document.querySelector('#home-view'),
  tracker: document.querySelector('#tracker-view'),
  history: document.querySelector('#history-view'),
};

const state = {
  authMode: 'signin',
  passwordRecovery: passwordRecoveryRequestedAtLoad,
  currentView: 'auth',
  previousView: null,
  userId: null,
  userEmail: null,
  selectedActivity: null,
  selectedCategory: null,
  startTime: null,
  endTime: null,
  timerId: null,
  language: localStorage.getItem(storageKeys.language) || 'en',
  sessions: readJson(storageKeys.sessions, []),
  customActivities: readJson(storageKeys.customActivities, []),
  customTemplates: readJson(storageKeys.customTemplates, {}),
  customGroups: readJson(storageKeys.customGroups, {}),
  customActivityUsesTimer: false,
  currentGymSets: [],
  gymExercises: [],
  gymRestSeconds: 0,
  gymRestTimerId: null,
  studyCandleSeconds: 0,
  studyCandleDurationSeconds: STUDY_CANDLE_DURATION_SECONDS,
  studyCandleRunning: false,
  studyCandleTimerId: null,
  studyCandleStartedAt: null,
  studyCandleBaseSeconds: 0,
  studyCandleAutoSaved: false,
  balootScores: [],
  balootDealerDirection: '↑',
  horseFeedCount: 1,
  horseCleaningSupplyCount: 0,
  editingSessionId: null,
  editableSessionFields: [],
  settings: { ...defaultUsabilitySettings },
  draft: null,
  syncStatus: 'saved',
  onboardingStep: 0,
  devices: [],
  historyChannel: null,
};

const authCard = document.querySelector('.auth-card');
const authForm = document.querySelector('#auth-form');
const authTitle = document.querySelector('#auth-title');
const authDescription = document.querySelector('#auth-description');
const authSubmit = document.querySelector('#auth-submit');
const authMessage = document.querySelector('#auth-message');
const identifierInput = document.querySelector('input[name="identifier"]');
const passwordInput = document.querySelector('#auth-password');
const repeatPasswordInput = document.querySelector('input[name="repeatPassword"]');
const passwordToggleButtons = document.querySelectorAll('[data-password-target]');
const passkeyButton = document.querySelector('#passkey-button');
const forgotButton = document.querySelector('#forgot-button');
const appleSignupButton = document.querySelector('#apple-signup-button');
const facebookSignupButton = document.querySelector('#facebook-signup-button');
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
const timerCard = document.querySelector('#timer-card');
const sessionForm = document.querySelector('#session-form');
const activityFields = document.querySelector('#activity-fields');
const sessionMessage = document.querySelector('#session-message');
const historyFilter = document.querySelector('#history-filter');
const progressDashboard = document.querySelector('#progress-dashboard');
const historyList = document.querySelector('#history-list');
const clearHistoryButton = document.querySelector('#clear-history-button');
const exportHistoryButton = document.querySelector('#export-history-button');
const exportCsvButton = document.querySelector('#export-csv-button');
const printHistoryButton = document.querySelector('#print-history-button');
const totalSessions = document.querySelector('#total-sessions');
const lastActivity = document.querySelector('#last-activity');
const customCount = document.querySelector('#custom-count');
const editSessionModal = document.querySelector('#edit-session-modal');
const editSessionForm = document.querySelector('#edit-session-form');
const editSessionFields = document.querySelector('#edit-session-fields');
const editSessionClose = document.querySelector('#edit-session-close');
const editSessionCancel = document.querySelector('#edit-session-cancel');
const settingsButton = document.querySelector('#settings-button');
const settingsModal = document.querySelector('#settings-modal');
const settingsClose = document.querySelector('#settings-close');
const settingsFields = document.querySelector('#settings-fields');
const onboardingModal = document.querySelector('#onboarding-modal');
const onboardingTitle = document.querySelector('#onboarding-title');
const onboardingCopy = document.querySelector('#onboarding-copy');
const onboardingIcon = document.querySelector('#onboarding-icon');
const onboardingDots = document.querySelector('#onboarding-dots');
const onboardingNext = document.querySelector('#onboarding-next');
const onboardingSkip = document.querySelector('#onboarding-skip');
const todayDashboard = document.querySelector('#today-dashboard');
const favoriteActivities = document.querySelector('#favorite-activities');
const historySearch = document.querySelector('#history-search');
const historyDateRange = document.querySelector('#history-date-range');
const historyViewMode = document.querySelector('#history-view-mode');
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

function balootText(key) {
  const labels = {
    en: {
      title: 'Baloot Calculator',
      subtitle: 'First side to 152 wins',
      us: 'Us',
      them: 'Them',
      winner: 'Winner',
      teamNames: 'Team names',
      usName: 'Us team name',
      themName: 'Them team name',
      dealerDirection: 'Dealer Direction',
      dealerHint: 'Tap to change dealer',
      addHandScore: 'Add hand score',
      usScore: 'Us score',
      themScore: 'Them score',
      addScore: '+ Add Score',
      deleteLast: 'Delete Last Score',
      reset: 'Reset Baloot Scores',
      scoreHistory: 'Score History',
      noScores: 'No scores added yet',
      noScoreToDelete: 'No score to delete',
      scoresMustBeNumbers: 'Scores must be numbers',
      scoresCannotBeNegative: 'Scores cannot be negative',
      enterUs: 'Please enter Us score',
      enterThem: 'Please enter Them score',
      hand: 'Hand',
      shareResult: 'Share Result',
      notFinished: 'Not finished yet',
      tie: 'Tie - play one more hand',
      won: (winner) => `${winner} reached 152 and won.`,
    },
    ar: {
      title: 'حاسبة البلوت',
      subtitle: 'أول فريق يصل إلى 152 يفوز',
      us: 'لنا',
      them: 'لهم',
      winner: 'الفائز',
      teamNames: 'أسماء الفرق',
      usName: 'اسم فريقنا',
      themName: 'اسم فريقهم',
      dealerDirection: 'اتجاه الموزع',
      dealerHint: 'اضغط لتغيير الموزع',
      addHandScore: 'إضافة نقاط الجولة',
      usScore: 'نقاط لنا',
      themScore: 'نقاط لهم',
      addScore: '+ إضافة النقاط',
      deleteLast: 'حذف آخر نتيجة',
      reset: 'إعادة تعيين نقاط البلوت',
      scoreHistory: 'سجل النقاط',
      noScores: 'لم تتم إضافة نقاط بعد',
      noScoreToDelete: 'لا توجد نتيجة للحذف',
      scoresMustBeNumbers: 'يجب أن تكون النقاط أرقاماً',
      scoresCannotBeNegative: 'لا يمكن أن تكون النقاط سالبة',
      enterUs: 'أدخل نقاط لنا',
      enterThem: 'أدخل نقاط لهم',
      hand: 'جولة',
      shareResult: 'مشاركة النتيجة',
      notFinished: 'لم تنته بعد',
      tie: 'تعادل - العب جولة إضافية',
      won: (winner) => `${winner} وصل إلى 152 وفاز.`,
    },
  };

  return labels[state.language][key] || labels.en[key] || key;
}

function gymText(key) {
  const labels = {
    en: {
      title: 'Gym Workout',
      chooseWorkoutDay: 'Choose workout day',
      customWorkout: 'Custom workout',
      customWorkoutPlaceholder: 'Workout name, example: Push Day',
      currentExercise: 'Current Exercise',
      savedExerciseOptions: 'Saved exercise options',
      exerciseName: 'Exercise name',
      exercisePlaceholder: 'Exercise name, example: Bench Press',
      setWeight: 'Weight',
      setReps: 'Set reps',
      restTimer: 'Rest Timer',
      pause: 'Pause',
      reset: 'Reset',
      progressSummary: 'Progress Summary',
      bestSet: 'Best set',
      addWeightForPr: 'Add weight to your sets to track personal records.',
      set: 'Set',
      setsForThisExercise: 'Sets for This Exercise',
      saveExercise: 'Save Exercise',
      exercisesAdded: 'Exercises Added',
      noSets: 'No sets added yet',
      noExercises: 'No exercises saved yet',
      enterReps: 'Please enter reps for this set',
      enterExerciseName: 'Please enter exercise name',
      addSetFirst: 'Please add at least one set',
      workoutDay: 'Workout Day',
      exercises: 'Exercises',
      reps: 'reps',
      Chest: 'Chest',
      Back: 'Back',
      Legs: 'Legs',
      Shoulder: 'Shoulder',
      Arms: 'Arms',
      Abs: 'Abs',
      Rest: 'Rest',
    },
    ar: {
      title: 'تمرين النادي',
      chooseWorkoutDay: 'اختر يوم التمرين',
      customWorkout: 'تمرين مخصص',
      customWorkoutPlaceholder: 'اسم التمرين، مثال: يوم الدفع',
      currentExercise: 'التمرين الحالي',
      savedExerciseOptions: 'خيارات التمارين المحفوظة',
      exerciseName: 'اسم التمرين',
      exercisePlaceholder: 'اسم التمرين، مثال: Bench Press',
      setWeight: 'الوزن',
      setReps: 'تكرارات المجموعة',
      restTimer: 'مؤقت الراحة',
      pause: 'إيقاف مؤقت',
      reset: 'إعادة ضبط',
      progressSummary: 'ملخص التقدم',
      bestSet: 'أفضل مجموعة',
      addWeightForPr: 'أضف الوزن للمجموعات لتتبع الأرقام الشخصية.',
      set: 'مجموعة',
      setsForThisExercise: 'المجموعات لهذا التمرين',
      saveExercise: 'حفظ التمرين',
      exercisesAdded: 'التمارين المضافة',
      noSets: 'لم تتم إضافة مجموعات بعد',
      noExercises: 'لم يتم حفظ تمارين بعد',
      enterReps: 'أدخل تكرارات هذه المجموعة',
      enterExerciseName: 'أدخل اسم التمرين',
      addSetFirst: 'أضف مجموعة واحدة على الأقل',
      workoutDay: 'يوم التمرين',
      exercises: 'التمارين',
      reps: 'تكرارات',
      Chest: 'صدر',
      Back: 'ظهر',
      Legs: 'أرجل',
      Shoulder: 'أكتاف',
      Arms: 'ذراع',
      Abs: 'بطن',
      Rest: 'راحة',
    },
  };

  return labels[state.language][key] || labels.en[key] || key;
}

function studyText(key) {
  const labels = {
    en: {
      title: 'Study Focus',
      subject: 'Subject',
      subjectPlaceholder: 'Math',
      studyType: 'Study type',
      studyTypePlaceholder: 'Exam, coursework, review',
      examDate: 'Exam date',
      examDatePlaceholder: '20/08/2026',
      coursework: 'Coursework',
      courseworkPlaceholder: 'Chapter 4 assignment',
      pomodoroPlan: 'Pomodoro plan',
      pomodoroPlaceholder: '25/5 x 4',
      streak: 'Study streak',
      streakPlaceholder: '5 days',
      totalStudyHours: 'Total study hours',
      totalHoursPlaceholder: '12.5',
      candleTimer: 'Candle Timer',
      candleHint: 'Three-hour study focus',
      candleComplete: 'Your three-hour study session was automatically saved. Continue studying?',
      startAnother: 'Start another candle',
      finishStudying: 'Not now',
      start: 'Start',
      pause: 'Pause',
      stop: 'Stop',
      notes: 'Study notes',
    },
    ar: {
      title: 'تركيز الدراسة',
      subject: 'المادة',
      subjectPlaceholder: 'رياضيات',
      studyType: 'نوع الدراسة',
      studyTypePlaceholder: 'اختبار، واجب، مراجعة',
      examDate: 'تاريخ الاختبار',
      examDatePlaceholder: '20/08/2026',
      coursework: 'الواجبات',
      courseworkPlaceholder: 'واجب الفصل الرابع',
      pomodoroPlan: 'خطة بومودورو',
      pomodoroPlaceholder: '25/5 x 4',
      streak: 'استمرارية الدراسة',
      streakPlaceholder: '5 أيام',
      totalStudyHours: 'إجمالي ساعات الدراسة',
      totalHoursPlaceholder: '12.5',
      candleTimer: 'مؤقت الشمعة',
      candleHint: 'تركيز دراسي لمدة ثلاث ساعات',
      candleComplete: 'تم حفظ جلسة الدراسة لمدة ثلاث ساعات تلقائياً. هل تريد متابعة الدراسة؟',
      startAnother: 'بدء شمعة جديدة',
      finishStudying: 'ليس الآن',
      start: 'بدء',
      pause: 'إيقاف مؤقت',
      stop: 'إيقاف',
      notes: 'ملاحظات الدراسة',
    },
  };

  return labels[state.language][key] || labels.en[key] || key;
}

function workText(key) {
  const labels = {
    en: {
      title: 'Work Focus',
      projectName: 'Project name',
      projectPlaceholder: 'Client project',
      candleHours: 'Candle hours',
      candleMinutes: 'Candle minutes',
      candleHint: 'Set the work time, then start the candle.',
      candleTimeRequired: 'Set a candle time of at least one minute.',
      notes: 'Work notes',
      projectRequired: 'Please enter project name.',
    },
    ar: {
      title: 'تركيز العمل',
      projectName: 'اسم المشروع',
      projectPlaceholder: 'مشروع العميل',
      candleHours: 'ساعات الشمعة',
      candleMinutes: 'دقائق الشمعة',
      candleHint: 'حدد وقت العمل ثم ابدأ الشمعة.',
      candleTimeRequired: 'حدد وقتاً لا يقل عن دقيقة واحدة.',
      notes: 'ملاحظات العمل',
      projectRequired: 'أدخل اسم المشروع.',
    },
  };

  return labels[state.language][key] || labels.en[key] || key;
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  // Keep the viewport anchored left-to-right and apply RTL inside the page.
  // Setting RTL on <html> can shift wide grids outside the visible viewport.
  document.documentElement.dir = 'ltr';
  document.body.dir = 'ltr';
  document.body.classList.toggle('rtl', state.language === 'ar');
  languageButton.textContent = state.language === 'ar' ? 'EN' : 'AR';
  languageButton.setAttribute('aria-label', state.language === 'ar' ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic');
  backButton.textContent = state.language === 'ar' ? '→' : '←';
  backButton.setAttribute('aria-label', state.language === 'ar' ? 'رجوع' : 'Go back');
  logoutButton.textContent = '⏻';
  logoutButton.setAttribute('aria-label', state.language === 'ar' ? 'تسجيل الخروج' : 'Log out');
  setText('#auth-eyebrow', text('authEyebrow'));
  setText('#hero-title', text('heroTitle'));
  setText('#hero-copy', text('heroCopy'));
  setText('#signin-tab', text('signIn'));
  setText('#signup-tab', text('signUp'));
  setText('#identifier-label', state.authMode === 'signup' ? text('signupIdentifier') : text('signinIdentifier'));
  setText('#password-label', state.authMode === 'signup' ? text('newPassword') : text('password'));
  setText('#repeat-password-label', text('confirmPassword'));
  setText('#password-minimum', text('passwordMinimum'));
  passwordToggleButtons.forEach((button) => {
    const target = document.querySelector(`#${button.dataset.passwordTarget}`);
    button.textContent = target?.type === 'text' ? text('hidePassword') : text('showPassword');
  });
  setText('#passkey-button', text('passkey'));
  setText('#signup-divider', text('or'));
  setText('#apple-signup-button', state.authMode === 'signup' ? text('appleSignup') : text('appleSignin'));
  setText('#facebook-signup-button', state.authMode === 'signup' ? text('facebookSignup') : text('facebookSignin'));
  setText('#security-title', text('securityTitle'));
  setText('#security-text', text('securityText'));
  setText('#home-eyebrow', text('home'));
  setText('#home-title', text('homeTitle'));
  setText('#home-history-button', text('history'));
  setText('#total-sessions-label', text('totalSessions'));
  setText('#last-activity-label', text('lastActivity'));
  setText('#custom-count-label', text('customActivities'));
  setText('#custom-activity-label', text('addCustomActivity'));
  setText('#custom-fields-label', text('customFields'));
  setText('#custom-category-label', state.language === 'ar' ? 'نوع النشاط' : 'Activity type');
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

function accountStorageKey(baseKey, userId = state.userId) {
  return userId ? `${baseKey}:${userId}` : baseKey;
}

function restorePersistentData() {
  const savedSessions = readJson(accountStorageKey(storageKeys.sessions), []);
  const savedActivities = readJson(accountStorageKey(storageKeys.customActivities), []);
  const savedTemplates = readJson(accountStorageKey(storageKeys.customTemplates), {});
  const savedGroups = readJson(accountStorageKey(storageKeys.customGroups), {});
  const savedSettings = readJson(accountStorageKey(storageKeys.settings), defaultUsabilitySettings);
  const savedDraft = readJson(accountStorageKey(storageKeys.draft), null);

  state.sessions = Array.isArray(savedSessions) ? savedSessions : [];
  state.customActivities = Array.isArray(savedActivities) ? savedActivities : [];
  state.customTemplates = savedTemplates && typeof savedTemplates === 'object' ? savedTemplates : {};
  state.customGroups = savedGroups && typeof savedGroups === 'object' ? savedGroups : {};
  state.settings = {
    ...defaultUsabilitySettings,
    ...(savedSettings && typeof savedSettings === 'object' ? savedSettings : {}),
  };
  state.draft = savedDraft && typeof savedDraft === 'object' ? savedDraft : null;
}

async function saveUsabilitySettings(nextSettings) {
  state.settings = { ...defaultUsabilitySettings, ...nextSettings };
  writeJson(accountStorageKey(storageKeys.settings), state.settings);
  state.syncStatus = 'syncing';
  renderHome();

  if (!cloudClient || !state.userId) {
    state.syncStatus = 'offline';
    return;
  }

  const { error } = await cloudClient.from('user_preferences').upsert({
    user_id: state.userId,
    preferences: state.settings,
    updated_at: new Date().toISOString(),
  });
  state.syncStatus = error ? 'offline' : 'saved';
  renderHome();
}

async function restoreCloudUsabilitySettings(userId) {
  if (!cloudClient) return;
  const { data, error } = await cloudClient
    .from('user_preferences')
    .select('preferences')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  const cloudSettings = data?.preferences || {};
  state.settings = {
    ...defaultUsabilitySettings,
    ...state.settings,
    ...cloudSettings,
    favoriteActivities: [...new Set([...(cloudSettings.favoriteActivities || []), ...state.settings.favoriteActivities])],
    recentActivities: [...new Set([...state.settings.recentActivities, ...(cloudSettings.recentActivities || [])])].slice(0, 6),
  };
  writeJson(accountStorageKey(storageKeys.settings), state.settings);
}

function webDeviceId() {
  const key = 'tafasili-web-device-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

async function registerAndLoadWebDevices() {
  if (!cloudClient || !state.userId) return;
  const deviceId = webDeviceId();
  const { error: upsertError } = await cloudClient.from('user_devices').upsert({
    user_id: state.userId,
    device_id: deviceId,
    label: 'Web browser',
    platform: 'web',
    last_seen: new Date().toISOString(),
  });
  if (upsertError) throw upsertError;
  const { data, error } = await cloudClient.from('user_devices').select('*').order('last_seen', { ascending: false });
  if (error) throw error;
  state.devices = (data || []).map((device) => ({
    deviceId: device.device_id,
    label: device.label,
    platform: device.platform,
    lastSeen: device.last_seen,
    current: device.device_id === deviceId,
  }));
}

async function rememberActivity(activity) {
  await saveUsabilitySettings({
    ...state.settings,
    recentActivities: [activity, ...state.settings.recentActivities.filter((item) => item !== activity)].slice(0, 6),
  });
}

async function toggleFavoriteActivity(activity) {
  const favoriteActivities = state.settings.favoriteActivities.includes(activity)
    ? state.settings.favoriteActivities.filter((item) => item !== activity)
    : [...state.settings.favoriteActivities, activity];
  await saveUsabilitySettings({ ...state.settings, favoriteActivities });
}

function sessionToCloudRow(session, userId) {
  return {
    user_id: userId,
    id: session.id,
    activity: session.activity,
    start_time: session.start || '',
    end_time: session.end || '',
    duration: session.duration || '',
    duration_seconds: Number(session.durationSeconds || 0),
    session_date: session.date,
    details: session.details || {},
  };
}

function cloudRowToSession(row) {
  return {
    id: Number(row.id),
    activity: row.activity,
    start: row.start_time,
    end: row.end_time,
    duration: row.duration,
    durationSeconds: row.duration_seconds || 0,
    date: row.session_date,
    details: row.details || {},
  };
}

async function saveSessionToCloud(session) {
  if (!cloudClient || !state.userId) {
    throw new Error('Cloud account is not available.');
  }

  const { error } = await cloudClient
    .from('activity_sessions')
    .upsert(sessionToCloudRow(session, state.userId), { onConflict: 'user_id,id' });

  if (error) {
    throw error;
  }
}

async function restoreCloudHistory(userId) {
  const scopedKey = accountStorageKey(storageKeys.sessions, userId);
  const migrationKey = `tafasili-cloud-migrated:${userId}`;
  const shouldMigrate = !localStorage.getItem(migrationKey);
  const localSessions = shouldMigrate
    ? [...readJson(scopedKey, []), ...readJson(storageKeys.sessions, [])]
    : [];

  if (localSessions.length > 0) {
    const uniqueSessions = [...new Map(
      localSessions.map((session) => [String(session.id), session])
    ).values()];
    const { error: migrationError } = await cloudClient
      .from('activity_sessions')
      .upsert(
        uniqueSessions.map((session) => sessionToCloudRow(session, userId)),
        { onConflict: 'user_id,id' }
      );

    if (migrationError) {
      throw migrationError;
    }
  }

  localStorage.setItem(migrationKey, 'true');
  await refreshCloudHistory(userId);
}

async function refreshCloudHistory(userId = state.userId) {
  if (!cloudClient || !userId || userId !== state.userId) {
    return;
  }

  const { data, error } = await cloudClient
    .from('activity_sessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    state.syncStatus = 'offline';
    throw error;
  }

  state.sessions = (data || []).map(cloudRowToSession);
  writeJson(accountStorageKey(storageKeys.sessions, userId), state.sessions);
  state.syncStatus = 'saved';
  renderHome();
  renderHistory();
}

function stopHistorySubscription() {
  if (cloudClient && state.historyChannel) {
    void cloudClient.removeChannel(state.historyChannel);
  }
  state.historyChannel = null;
}

function subscribeToHistoryChanges() {
  stopHistorySubscription();
  if (!cloudClient || !state.userId) return;

  state.historyChannel = cloudClient
    .channel(`activity-sessions-${state.userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'activity_sessions' },
      () => { void refreshCloudHistory().catch(() => {}); }
    )
    .subscribe();
}

function customActivityToCloudRow(name, userId, templates, groups) {
  const categoryAliases = {
    'Sports and Games': 'sports',
    'Fitness and Movement': 'fitness',
    'Horse Activities': 'horse',
    'Study and Work': 'study',
    'Life Tracking': 'life',
    'Vehicle and Maintenance': 'vehicle',
  };

  return {
    user_id: userId,
    name,
    category: categoryAliases[groups[name]] || groups[name] || 'life',
    fields: templates[name] || [],
    updated_at: new Date().toISOString(),
  };
}

async function saveCustomActivityToCloud(name) {
  if (!cloudClient || !state.userId) {
    throw new Error('Cloud account is not available.');
  }

  const { error } = await cloudClient
    .from('custom_activities')
    .upsert(
      customActivityToCloudRow(name, state.userId, state.customTemplates, state.customGroups),
      { onConflict: 'user_id,name' }
    );

  if (error) {
    throw error;
  }
}

async function restoreCloudCustomActivities(userId) {
  const activitiesKey = accountStorageKey(storageKeys.customActivities, userId);
  const templatesKey = accountStorageKey(storageKeys.customTemplates, userId);
  const groupsKey = accountStorageKey(storageKeys.customGroups, userId);
  const migrationKey = `tafasili-custom-activities-migrated:${userId}`;
  const scopedActivities = readJson(activitiesKey, []);
  const scopedTemplates = readJson(templatesKey, {});
  const scopedGroups = readJson(groupsKey, {});
  const shouldMigrateLegacy = !localStorage.getItem(migrationKey);
  const legacyActivities = shouldMigrateLegacy ? readJson(storageKeys.customActivities, []) : [];
  const legacyTemplates = shouldMigrateLegacy ? readJson(storageKeys.customTemplates, {}) : {};
  const legacyGroups = shouldMigrateLegacy ? readJson(storageKeys.customGroups, {}) : {};
  const localNames = [...new Set([...scopedActivities, ...legacyActivities])];
  const localTemplates = { ...legacyTemplates, ...scopedTemplates };
  const localGroups = { ...legacyGroups, ...scopedGroups };

  if (localNames.length > 0) {
    const { error: migrationError } = await cloudClient
      .from('custom_activities')
      .upsert(
        localNames.map((name) => customActivityToCloudRow(name, userId, localTemplates, localGroups)),
        { onConflict: 'user_id,name' }
      );

    if (migrationError) {
      throw migrationError;
    }
  }

  const { data, error } = await cloudClient
    .from('custom_activities')
    .select('name,category,fields')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  const mergedActivities = new Map();
  localNames.forEach((name) => {
    mergedActivities.set(name, {
      category: localGroups[name] || 'life',
      fields: localTemplates[name] || [],
    });
  });
  (data || []).forEach((activity) => {
    mergedActivities.set(activity.name, {
      category: activity.category,
      fields: Array.isArray(activity.fields) ? activity.fields : [],
    });
  });

  state.customActivities = [...mergedActivities.keys()];
  state.customTemplates = Object.fromEntries(
    [...mergedActivities].map(([name, activity]) => [name, activity.fields])
  );
  state.customGroups = Object.fromEntries(
    [...mergedActivities].map(([name, activity]) => [name, activity.category])
  );
  writeJson(activitiesKey, state.customActivities);
  writeJson(templatesKey, state.customTemplates);
  writeJson(groupsKey, state.customGroups);
  localStorage.setItem(migrationKey, 'true');
}

function showDueExpirationReminders() {
  if (!state.userId) {
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const dueReminders = state.sessions
    .flatMap((session) => session.details?.expirationReminders || [])
    .filter((reminder) => reminder.remindOn <= today && reminder.expirationDate >= today);
  const uniqueReminders = [...new Map(
    dueReminders.map((reminder) => [`${reminder.label}:${reminder.expirationDate}`, reminder])
  ).values()];
  const alertKey = `tafasili-expiration-reminder-alert:${state.userId}:${today}`;

  if (uniqueReminders.length === 0 || localStorage.getItem(alertKey)) {
    return;
  }

  localStorage.setItem(alertKey, 'true');
  const title = state.language === 'ar' ? 'تذكيرات الانتهاء' : 'Expiration reminders';
  const message = uniqueReminders
    .map((reminder) => `${reminder.label}: ${reminder.expirationDate}`)
    .join('\n');
  if (state.settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body: message, icon: './assets/tafasili-favicon.png?v=20260721-logo-v9' });
  }
  window.alert(`${title}\n\n${message}`);
}

function showDueSessionReminders() {
  if (
    !state.userId
    || !state.settings.notificationsEnabled
    || !('Notification' in window)
    || Notification.permission !== 'granted'
  ) {
    return;
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const currentTime = now.toTimeString().slice(0, 5);
  state.sessions.forEach((session) => {
    const reminder = session.details?.reminder;
    if (
      !reminder?.notificationEnabled
      || reminder.date !== today
      || (reminder.time && reminder.time > currentTime)
    ) {
      return;
    }

    const alertKey = `tafasili-session-reminder-alert:${state.userId}:${session.id}:${today}`;
    if (localStorage.getItem(alertKey)) return;
    localStorage.setItem(alertKey, 'true');
    new Notification(`${state.language === 'ar' ? 'تذكير' : 'Reminder'}: ${activityLabel(session.activity)}`, {
      body: reminder.note || activityLabel(session.activity),
      icon: './assets/tafasili-favicon.png?v=20260721-logo-v9',
    });
  });
}

async function completeCloudSignIn(user) {
  state.userId = user.id;
  state.userEmail = user.email || user.phone || '';
  markSignedIn();
  restorePersistentData();

  try {
    await restoreCloudHistory(user.id);
  } catch {
    authMessage.textContent = 'Signed in. Cloud history will retry when your connection returns.';
  }
  subscribeToHistoryChanges();

  try {
    await restoreCloudCustomActivities(user.id);
  } catch {
    authMessage.textContent = 'Signed in. Custom activities will sync after the database update is applied.';
  }

  try {
    await restoreCloudUsabilitySettings(user.id);
    await registerAndLoadWebDevices();
    state.syncStatus = 'saved';
  } catch {
    state.syncStatus = 'offline';
  }

  showView('home');
  renderHome();
  showDueExpirationReminders();
  showDueSessionReminders();
  renderHistory();
  if (!state.settings.onboardingComplete) {
    state.onboardingStep = 0;
    renderOnboarding();
    onboardingModal.classList.remove('hidden');
  }
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
  return new Date(date).toLocaleDateString(state.settings.dateFormat === 'month-first' ? 'en-US' : 'en-GB', {
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

function getCustomTemplateFields(activity) {
  const fields = state.customTemplates[activity];
  return Array.isArray(fields)
    ? fields.filter((field) => !['session title', 'notes'].includes(String(field).trim().toLowerCase()))
    : [];
}

function supportsReminders(activity) {
  return state.customActivities.includes(activity)
    || ['Gym', 'Studying', 'Work', 'Vehicle Maintenance'].includes(activity)
    || horseActivities.includes(activity);
}

function isNonTimedActivity(activity) {
  return activity === 'Vehicle Maintenance' || activity === 'Personal Info';
}

function isSelectedActivityNonTimed(activity) {
  return isNonTimedActivity(activity)
    || (horseActivities.includes(activity) && activity !== 'Horse Riding')
    || (state.customActivities.includes(activity) && !state.customActivityUsesTimer);
}

function isSessionNonTimed(session) {
  return isNonTimedActivity(session.activity) || (!session.start && !session.end);
}

function getSensitiveEnding(value) {
  const cleanValue = String(value || '').trim();
  return cleanValue ? cleanValue.slice(-4) : '';
}

function reminderFields() {
  const labels = state.language === 'ar'
    ? { title: 'تذكير', date: 'تاريخ التذكير', time: 'وقت التذكير', note: 'ملاحظة التذكير', notification: 'إرسال إشعار' }
    : { title: 'Reminder', date: 'Reminder date', time: 'Reminder time', note: 'Reminder note', notification: 'Send notification' };

  return fieldSection(labels.title, [
    textAreaField(labels.note, 'reminderNote', 'Reminder details', true),
    checkboxField(labels.notification, 'reminderNotificationEnabled', 'reminder-notification-fields'),
    conditionalFields('reminder-notification-fields', [
      inputField(labels.date, 'reminderDate', '2026-08-01', 'date'),
      inputField(labels.time, 'reminderTime', '18:30', 'time'),
    ]),
  ]);
}

function getReminderDetails() {
  if (!supportsReminders(state.selectedActivity)) {
    return undefined;
  }

  const date = sessionForm.querySelector('[name="reminderDate"]')?.value.trim() || '';
  const time = sessionForm.querySelector('[name="reminderTime"]')?.value.trim() || '';
  const note = sessionForm.querySelector('[name="reminderNote"]')?.value.trim() || '';
  const notificationEnabled = sessionForm.querySelector('[name="reminderNotificationEnabled"]')?.checked || false;

  return date || time || note ? { date, time, note, notificationEnabled } : undefined;
}

function expirationReminderField() {
  const label = state.language === 'ar' ? 'تذكير تلقائي بالانتهاء' : 'Automatic expiration reminder';
  const options = state.language === 'ar'
    ? [
        ['0', 'إيقاف'],
        ['7', 'قبل أسبوع'],
        ['30', 'قبل شهر'],
        ['90', 'قبل 3 أشهر'],
      ]
    : [
        ['0', 'Off'],
        ['7', '1 week before'],
        ['30', '1 month before'],
        ['90', '3 months before'],
      ];

  return `
    <label>
      ${label}
      <select name="expirationReminderLeadDays">
        ${options.map(([value, text]) => `<option value="${value}" ${Number(value) === state.settings.defaultReminderDays ? 'selected' : ''}>${text}</option>`).join('')}
      </select>
    </label>
  `;
}

function calculateExpirationReminderDate(expirationDate, daysBefore) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)) {
    return '';
  }

  const expiration = new Date(`${expirationDate}T00:00:00Z`);

  if (Number.isNaN(expiration.getTime())) {
    return '';
  }

  expiration.setUTCDate(expiration.getUTCDate() - daysBefore);
  return expiration.toISOString().slice(0, 10);
}

function getExpirationReminders() {
  const daysBefore = Number(sessionForm.querySelector('[name="expirationReminderLeadDays"]')?.value || 0);

  if (daysBefore <= 0) {
    return [];
  }

  const fields = state.selectedActivity === 'Personal Info'
    ? [
        ['ID expiration', 'personalIdExpirationDate'],
        ['Driving license expiration', 'personalDlExpirationDate'],
        ['Passport expiration', 'personalPassportExpirationDate'],
      ]
    : state.selectedActivity === 'Vehicle Maintenance'
      ? [
          ['Insurance expiration', 'insuranceExpirationDate'],
          ['Registration expiration', 'registrationEndDate'],
        ]
      : [];

  return fields.flatMap(([label, fieldName]) => {
    const expirationDate = sessionForm.querySelector(`[name="${fieldName}"]`)?.value || '';
    const remindOn = calculateExpirationReminderDate(expirationDate, daysBefore);
    return expirationDate && remindOn
      ? [{ label, expirationDate, remindOn, daysBefore }]
      : [];
  });
}

function setAuthMode(mode) {
  state.authMode = mode;
  const isSignup = mode === 'signup';
  const isRecovery = mode === 'recovery';

  authCard.classList.toggle('signup-mode', isSignup || isRecovery);
  authTitle.textContent = isRecovery
    ? state.language === 'ar' ? 'تعيين كلمة مرور جديدة' : 'Set a new password'
    : isSignup ? text('createAccount') : text('welcomeBack');
  authDescription.textContent = isRecovery
    ? state.language === 'ar' ? 'أدخل كلمة المرور الجديدة وأكدها.' : 'Enter and confirm your new password.'
    : isSignup ? text('createProfile') : text('signInDescription');
  authSubmit.textContent = isRecovery
    ? state.language === 'ar' ? 'تحديث كلمة المرور' : 'Update password'
    : isSignup ? text('signUp') : text('signIn');
  document.querySelector('#identifier-label').textContent = isSignup ? text('signupIdentifier') : text('signinIdentifier');
  document.querySelector('#password-label').textContent = isSignup ? text('newPassword') : text('password');
  appleSignupButton.textContent = isSignup ? text('appleSignup') : text('appleSignin');
  facebookSignupButton.textContent = isSignup ? text('facebookSignup') : text('facebookSignin');
  identifierInput.required = !isRecovery;
  passwordInput.required = true;
  repeatPasswordInput.required = isSignup || isRecovery;
  repeatPasswordInput.closest('label').style.display = isSignup || isRecovery ? 'grid' : 'none';
  identifierInput.closest('label').style.display = isRecovery ? 'none' : 'grid';
  passwordInput.closest('label').style.display = 'grid';
  passwordInput.autocomplete = isSignup || isRecovery ? 'new-password' : 'current-password';
  passkeyButton.style.display = isRecovery ? 'none' : 'inline-flex';
  document.querySelector('.segmented').style.display = isRecovery ? 'none' : 'grid';
  document.querySelector('.signup-divider').style.display = isRecovery ? 'none' : 'block';
  document.querySelector('.signup-social').style.display = isRecovery ? 'none' : 'grid';
  forgotButton.style.display = isSignup || isRecovery ? 'none' : 'inline-flex';
  forgotButton.textContent = text('forgot');
  authMessage.textContent = '';
  passwordToggleButtons.forEach((button) => {
    const target = document.querySelector(`#${button.dataset.passwordTarget}`);
    if (target) {
      target.type = 'password';
    }
    button.textContent = text('showPassword');
  });

  document.querySelectorAll('[data-auth-mode]').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.authMode === mode);
  });
}

function currentUser() {
  return readJson(storageKeys.user, null);
}

function isSignedIn() {
  return Boolean(state.userId) && sessionStorage.getItem(storageKeys.activeSession) === 'true';
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
        name: 'Tafasili',
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
      restorePersistentData();
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

  renderTodayAndQuickAccess();

  customActivityForm.classList.toggle('collapsed', state.selectedCategory !== 'custom');

  const categories = [
    ...activitySections.map((section) => {
      const assignedCustomActivities = state.customActivities.filter(
        (activity) => state.customGroups[activity] === section.key
      );
      const activities = [...section.activities, ...assignedCustomActivities];

      return { key: section.key, count: activities.length, activities };
    }),
    {
      key: 'custom',
      activities: state.customActivities.filter((activity) => !state.customGroups[activity]),
    },
  ].map((category) => ({
    ...category,
    count: category.activities.length,
  }));
  const customCategorySelect = customActivityForm.querySelector('[name="customCategory"]');

  customCategorySelect.innerHTML = `
    <option value="">${state.language === 'ar' ? 'اختر نوع النشاط' : 'Choose an activity type'}</option>
    ${activitySections
      .map(
        (section) => `<option value="${section.key}">${translations[state.language].sections[section.key]}</option>`
      )
      .join('')}
  `;

  activityGrid.innerHTML = `
    <section class="activity-section">
      <h2>${state.language === 'ar' ? 'أنواع الأنشطة' : 'Activity types'}</h2>
      <div class="activity-section-grid category-grid">
        ${categories
          .map(
            (category) => `
              <div class="category-group-card">
                <button class="activity-card category-card${state.selectedCategory === category.key ? ' active' : ''}" type="button" data-category="${category.key}">
                  <strong>${translations[state.language].sections[category.key]}</strong>
                  <span>${category.count} ${state.language === 'ar' ? category.count === 1 ? 'نشاط' : 'أنشطة' : category.count === 1 ? 'activity' : 'activities'}</span>
                </button>
                ${state.selectedCategory === category.key ? renderActivitySection(category.activities) : ''}
              </div>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderActivitySection(activities) {
  return `
    <section class="activity-section category-activity-dropdown">
      <div class="activity-option-list">
        ${activities.length
          ? activities
              .map(
                (activity) => `
                  <div class="activity-option-row${state.customActivities.includes(activity) ? ' custom' : ''}">
                    <button class="favorite-toggle" type="button" data-favorite-activity="${escapeHtml(activity)}" aria-label="Favorite ${escapeHtml(activityLabel(activity))}">
                      ${state.settings.favoriteActivities.includes(activity) ? '★' : '☆'}
                    </button>
                    <button class="activity-option-button" type="button" data-activity="${escapeHtml(activity)}">
                      ${escapeHtml(activityLabel(activity))}
                    </button>
                    ${state.customActivities.includes(activity) ? `
                      <button class="custom-activity-delete" type="button" data-delete-custom-activity="${escapeHtml(activity)}" aria-label="${state.language === 'ar' ? 'حذف' : 'Delete'} ${escapeHtml(activityLabel(activity))}">
                        <span aria-hidden="true">&#128465;</span>
                      </button>` : ''}
                  </div>
                `
              )
              .join('')
          : `<p class="activity-option-empty">${state.language === 'ar' ? 'لا توجد أنشطة بعد' : 'No activities yet'}</p>`}
      </div>
    </section>
  `;
}

function renderTodayAndQuickAccess() {
  const today = new Date().toISOString().slice(0, 10);
  const due = state.sessions.flatMap((session) => {
    const standard = session.details?.reminder?.date === today
      ? [{ label: session.activity, date: session.details.reminder.date }]
      : [];
    const expirations = (session.details?.expirationReminders || [])
      .filter((reminder) => reminder.remindOn <= today && reminder.expirationDate >= today)
      .map((reminder) => ({ label: reminder.label, date: reminder.expirationDate }));
    return [...standard, ...expirations];
  });
  const syncLabels = state.language === 'ar'
    ? { saved: 'محفوظ', syncing: 'جارٍ المزامنة', offline: 'دون اتصال', failed: 'فشلت المزامنة' }
    : { saved: 'Saved', syncing: 'Syncing', offline: 'Offline', failed: 'Sync failed' };

  todayDashboard.innerHTML = `
    <div class="today-head">
      <div>
        <h2>${state.language === 'ar' ? 'اليوم' : 'Today'}</h2>
        <span class="sync-status"><i class="${state.syncStatus === 'saved' ? 'saved' : ''}"></i>${syncLabels[state.syncStatus] || syncLabels.saved}</span>
      </div>
      ${state.sessions.length ? `<button class="button secondary" type="button" data-repeat-last>${state.language === 'ar' ? 'تكرار الأخير' : 'Repeat last'}</button>` : ''}
    </div>
    <div class="today-items">
      ${due.length
        ? due.slice(0, 5).map((item) => `<div><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.date)}</span></div>`).join('')
        : `<p>${state.language === 'ar' ? 'لا توجد تذكيرات مستحقة اليوم.' : 'No reminders are due today.'}</p>`}
    </div>
    ${state.draft ? `
      <div class="draft-resume-row">
        <button class="draft-resume" type="button" data-continue-draft>
          <strong>${state.language === 'ar' ? 'متابعة المسودة' : 'Continue draft'}</strong>
          <span>${escapeHtml(activityLabel(state.draft.activity))}</span>
        </button>
        <button class="draft-delete" type="button" data-delete-draft aria-label="${state.language === 'ar' ? 'حذف المسودة' : 'Delete draft'}">−</button>
      </div>` : ''}
  `;

  renderQuickActivityGroup(favoriteActivities, state.language === 'ar' ? 'المفضلة' : 'Favorites', state.settings.favoriteActivities, true);
}

async function deleteCustomActivity(activity) {
  const confirmed = window.confirm(state.language === 'ar'
    ? `حذف ${activityLabel(activity)} من قائمة الأنشطة؟ سيبقى السجل السابق محفوظاً.`
    : `Delete ${activityLabel(activity)} from your activities? Existing history will stay saved.`);
  if (!confirmed) return;

  state.customActivities = state.customActivities.filter((item) => item !== activity);
  delete state.customTemplates[activity];
  delete state.customGroups[activity];
  writeJson(accountStorageKey(storageKeys.customActivities), state.customActivities);
  writeJson(accountStorageKey(storageKeys.customTemplates), state.customTemplates);
  writeJson(accountStorageKey(storageKeys.customGroups), state.customGroups);
  await saveUsabilitySettings({
    ...state.settings,
    favoriteActivities: state.settings.favoriteActivities.filter((item) => item !== activity),
    recentActivities: state.settings.recentActivities.filter((item) => item !== activity),
  });

  if (state.draft?.activity === activity) {
    state.draft = null;
    localStorage.removeItem(accountStorageKey(storageKeys.draft));
  }

  try {
    if (cloudClient && state.userId) {
      const { error } = await cloudClient
        .from('custom_activities')
        .delete()
        .eq('user_id', state.userId)
        .eq('name', activity);
      if (error) throw error;
    }
  } catch {
    window.alert(state.language === 'ar'
      ? 'تم الحذف من هذا الجهاز، لكن تعذر حذفه من السحابة.'
      : 'Deleted on this device, but cloud deletion failed.');
  }
  renderHome();
}

function deleteDraft() {
  const confirmed = window.confirm(
    state.language === 'ar'
      ? 'حذف المسودة غير المحفوظة؟'
      : 'Delete this unfinished draft?'
  );
  if (!confirmed) return;
  state.draft = null;
  localStorage.removeItem(accountStorageKey(storageKeys.draft));
  renderHome();
}

function renderQuickActivityGroup(container, title, activities, favorite) {
  container.classList.toggle('hidden', activities.length === 0);
  container.innerHTML = activities.length ? `
    <h2>${title}</h2>
    <div>${activities.map((activity) => `
      <button class="quick-activity" type="button" data-activity="${escapeHtml(activity)}">
        ${favorite ? '★ ' : ''}${escapeHtml(activityLabel(activity))}
      </button>`).join('')}
    </div>` : '';
}

function renderSettings() {
  const labels = state.language === 'ar'
    ? {
        title: 'الإعدادات والخصوصية', date: 'تنسيق التاريخ', units: 'وحدات القياس', reminder: 'التذكير الافتراضي',
        notifications: 'إشعارات المتصفح', lock: 'قفل الحساب بمفتاح المرور', devices: 'تسجيل الخروج من الأجهزة الأخرى', remove: 'حذف كل السجل', tutorial: 'عرض التعريف مرة أخرى',
      }
    : {
        title: 'Settings & Privacy', date: 'Date format', units: 'Measurement units', reminder: 'Default expiration reminder',
        notifications: 'Browser notifications', lock: 'Require passkey when available', devices: 'Sign out other devices', remove: 'Delete all history data', tutorial: 'Show onboarding again',
      };
  document.querySelector('#settings-title').textContent = labels.title;
  settingsFields.innerHTML = `
    <label>${labels.date}
      <select data-setting="dateFormat">
        <option value="day-first" ${state.settings.dateFormat === 'day-first' ? 'selected' : ''}>DD/MM/YYYY</option>
        <option value="month-first" ${state.settings.dateFormat === 'month-first' ? 'selected' : ''}>MM/DD/YYYY</option>
      </select>
    </label>
    <label>${labels.units}
      <select data-setting="measurementSystem">
        <option value="metric" ${state.settings.measurementSystem === 'metric' ? 'selected' : ''}>Metric</option>
        <option value="imperial" ${state.settings.measurementSystem === 'imperial' ? 'selected' : ''}>Imperial</option>
      </select>
    </label>
    <label>${labels.reminder}
      <select data-setting="defaultReminderDays">
        ${[7, 30, 90].map((days) => `<option value="${days}" ${state.settings.defaultReminderDays === days ? 'selected' : ''}>${days} days</option>`).join('')}
      </select>
    </label>
    <label class="settings-toggle"><span>${labels.notifications}</span><input type="checkbox" data-setting="notificationsEnabled" ${state.settings.notificationsEnabled ? 'checked' : ''}></label>
    <label class="settings-toggle"><span>${labels.lock}</span><input type="checkbox" data-setting="appLockEnabled" ${state.settings.appLockEnabled ? 'checked' : ''}></label>
    <button class="button secondary" type="button" data-settings-action="devices">${labels.devices}</button>
    <div class="device-list">
      <strong>${state.language === 'ar' ? 'الأجهزة المسجلة' : 'Signed-in devices'}</strong>
      ${state.devices.length
        ? state.devices.map((device) => `<div><span>${escapeHtml(device.label)}${device.current ? ' (This device)' : ''}</span><small>${escapeHtml(new Date(device.lastSeen).toLocaleString())}</small></div>`).join('')
        : `<small>${state.language === 'ar' ? 'ستظهر الأجهزة بعد تحديث قاعدة البيانات.' : 'Devices appear after the database update is applied.'}</small>`}
    </div>
    <button class="button secondary" type="button" data-settings-action="tutorial">${labels.tutorial}</button>
    <button class="button danger" type="button" data-settings-action="delete">${labels.remove}</button>
  `;
}

function renderOnboarding() {
  const content = state.language === 'ar'
    ? [
        ['◷', 'كل ما يهمك اليوم', 'شاهد التذكيرات والمسودات من الرئيسية.'],
        ['☆', 'وصول أسرع', 'ثبّت الأنشطة المفضلة وكرر آخر سجل بضغطة واحدة.'],
        ['✓', 'محفوظ ومتزامن', 'تعرف دائماً متى تم حفظ سجلاتك في السحابة.'],
      ]
    : [
        ['◷', 'Everything important today', 'See reminders and unfinished drafts on Home.'],
        ['☆', 'Faster access', 'Pin favorites and repeat your latest record in one tap.'],
        ['✓', 'Saved and synchronized', 'Always know whether your records reached the cloud.'],
      ];
  const [icon, title, copy] = content[state.onboardingStep];
  onboardingIcon.textContent = icon;
  onboardingTitle.textContent = title;
  onboardingCopy.textContent = copy;
  onboardingDots.innerHTML = content.map((_, index) => `<i class="${index === state.onboardingStep ? 'active' : ''}"></i>`).join('');
  onboardingNext.textContent = state.onboardingStep === content.length - 1
    ? state.language === 'ar' ? 'ابدأ' : 'Get started'
    : state.language === 'ar' ? 'التالي' : 'Next';
  onboardingSkip.textContent = state.language === 'ar' ? 'تخطٍ' : 'Skip';
}

async function finishOnboarding() {
  await saveUsabilitySettings({ ...state.settings, onboardingComplete: true });
  onboardingModal.classList.add('hidden');
  state.onboardingStep = 0;
}

async function openTracker(activity, restoreDraft = false) {
  resetStudyCandle();
  state.customActivityUsesTimer = false;
  if (activity === 'Supplies and Feed') {
    state.horseFeedCount = 1;
    state.horseCleaningSupplyCount = 0;
  }
  state.selectedActivity = activity;
  state.startTime = null;
  state.endTime = null;
  stopTimer();
  timerDisplay.textContent = '00:00:00';
  timerNote.textContent = text('timerNote');
  sessionMessage.textContent = '';
  trackerTitle.textContent = activityLabel(activity);
  trackerHelper.textContent = trackerHelperText(activity);
  trackerView.classList.toggle('vehicle-mode', isSelectedActivityNonTimed(activity));
  trackerView.classList.toggle('focus-mode', activity === 'Studying' || activity === 'Work');
  timerCard.hidden = isSelectedActivityNonTimed(activity) || activity === 'Studying' || activity === 'Work';
  activityFields.innerHTML = getFieldsForActivity(activity);
  bindConditionalFields();
  bindHorseFeedEntries();
  bindHorseCleaningSupplies();
  if (state.customActivities.includes(activity)) {
    bindCustomTimerToggle();
  }
  if (activity === 'Studying' || activity === 'Work') {
    resetStudyCandle();
    bindStudyCandle();
  }
  if (activity === 'Gym') {
    resetGymState();
    bindGymWorkoutBuilder();
  }
  if (activity === 'Baloot') {
    resetBalootState();
    bindBalootCalculator();
  }
  sessionForm.reset();
  if (restoreDraft && state.draft?.activity === activity) {
    Object.entries(state.draft.values || {}).forEach(([name, value]) => {
      const field = sessionForm.querySelector(`[name="${CSS.escape(name)}"]`);
      if (field && 'value' in field) field.value = String(value ?? '');
    });
  }
  if (state.customActivities.includes(activity)) {
    const restoredTimerValue = state.draft?.activity === activity
      ? state.draft.values?.customUseTimer
      : undefined;
    state.customActivityUsesTimer = restoredTimerValue === 'on' || restoredTimerValue === 'true';
    const customTimerToggle = sessionForm.querySelector('[name="customUseTimer"]');
    if (customTimerToggle) customTimerToggle.checked = state.customActivityUsesTimer;
    updateCustomTimerVisibility();
  }
  if (activity === 'Work') {
    sessionForm.querySelector('[name="workCandleHours"]').value = '3';
    sessionForm.querySelector('[name="workCandleMinutes"]').value = '0';
    state.studyCandleDurationSeconds = STUDY_CANDLE_DURATION_SECONDS;
  }
  if (activity === 'Studying' || activity === 'Work') {
    renderStudyCandle();
  }
  if (activity === 'Gym') {
    renderGymWorkoutBuilder();
  }
  if (activity === 'Baloot') {
    renderBalootCalculator();
  }
  await rememberActivity(activity);
  showView('tracker');
}

function trackerHelperText(activity) {
  if (activity === 'Vehicle Maintenance') {
    return text('trackerVehicle');
  }

  if (activity === 'Personal Info') {
    return text('trackerRecord');
  }

  if (activity === 'Studying' || activity === 'Work') {
    return state.language === 'ar'
      ? 'حدد التفاصيل واستخدم مؤقت الشمعة ثم احفظ الجلسة.'
      : 'Set the details, use the candle timer, then save the session.';
  }

  if (state.customActivities.includes(activity)) {
    return state.language === 'ar'
      ? 'أدخل التفاصيل واحفظها. استخدام المؤقت اختياري.'
      : 'Enter the details and save. The timer is optional.';
  }

  return text('trackerTimed');
}

function captureActivityFieldValues() {
  const occurrences = {};

  return Array.from(activityFields.querySelectorAll('[name]')).map((field) => {
    const occurrence = occurrences[field.name] || 0;
    occurrences[field.name] = occurrence + 1;

    return {
      name: field.name,
      occurrence,
      value: field.value,
      checked: field.checked,
    };
  });
}

function restoreActivityFieldValues(savedFields) {
  const occurrences = {};

  activityFields.querySelectorAll('[name]').forEach((field) => {
    const occurrence = occurrences[field.name] || 0;
    occurrences[field.name] = occurrence + 1;
    const savedField = savedFields.find(
      (item) => item.name === field.name && item.occurrence === occurrence
    );

    if (!savedField) {
      return;
    }

    field.value = savedField.value;
    if (field.type === 'checkbox' || field.type === 'radio') {
      field.checked = savedField.checked;
    }
  });
}

function refreshOpenTrackerLanguage() {
  const activity = state.selectedActivity;

  if (!activity || trackerView.classList.contains('hidden')) {
    return;
  }

  const savedFields = captureActivityFieldValues();
  trackerTitle.textContent = activityLabel(activity);
  trackerHelper.textContent = trackerHelperText(activity);
  activityFields.innerHTML = getFieldsForActivity(activity);
  restoreActivityFieldValues(savedFields);
  bindConditionalFields();
  bindHorseFeedEntries();
  bindHorseCleaningSupplies();

  if (state.customActivities.includes(activity)) {
    bindCustomTimerToggle();
    const toggle = sessionForm.querySelector('[name="customUseTimer"]');
    if (toggle) toggle.checked = state.customActivityUsesTimer;
    updateCustomTimerVisibility();
  }

  if (activity === 'Studying' || activity === 'Work') {
    bindStudyCandle();
    renderStudyCandle();
  }

  if (activity === 'Gym') {
    bindGymWorkoutBuilder();
    renderGymWorkoutBuilder();
  }

  if (activity === 'Baloot') {
    bindBalootCalculator();
    renderBalootCalculator();
  }
}

function getMovementDistanceKm() {
  const laps = Number(sessionForm.querySelector('[name="laps"]')?.value || 0);
  const lapDistance = Number(sessionForm.querySelector('[name="lapDistance"]')?.value || 0);
  const unit = sessionForm.querySelector('[name="lapDistanceUnit"]')?.value || 'm';

  if (!laps || !lapDistance) {
    return 0;
  }

  const totalDistance = laps * lapDistance;

  if (unit === 'm') return totalDistance / 1000;
  if (unit === 'yd') return totalDistance / 1093.613;
  if (unit === 'mi') return totalDistance * 1.609344;
  return totalDistance;
}

function getMovementTotalDistance() {
  const laps = Number(sessionForm.querySelector('[name="laps"]')?.value || 0);
  const lapDistance = Number(sessionForm.querySelector('[name="lapDistance"]')?.value || 0);
  const unit = sessionForm.querySelector('[name="lapDistanceUnit"]')?.value || 'm';

  if (!laps || !lapDistance) {
    return `0 ${unit}`;
  }

  const totalDistance = laps * lapDistance;

  if (unit === 'm' && totalDistance >= 1000) {
    return `${(totalDistance / 1000).toFixed(2)} km`;
  }

  return `${totalDistance} ${unit}`;
}

function getMovementAveragePace(durationSeconds) {
  const totalKm = getMovementDistanceKm();

  if (!totalKm || !durationSeconds) {
    return 'Not calculated';
  }

  const secondsPerKm = durationSeconds / totalKm;
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);

  return `${minutes}:${String(seconds).padStart(2, '0')} min/km`;
}

function getMovementAverageSpeed(durationSeconds) {
  const totalKm = getMovementDistanceKm();

  if (!totalKm || !durationSeconds) {
    return 'Not calculated';
  }

  return `${(totalKm / (durationSeconds / 3600)).toFixed(2)} km/h`;
}

function getFieldsForActivity(activity) {
  if (state.customActivities.includes(activity)) {
    const timerLabels = state.language === 'ar'
      ? { title: 'استخدام المؤقت', help: 'اختياري. يمكنك حفظ النشاط بدون وقت.' }
      : { title: 'Use timer', help: 'Optional. You can save this activity without timing it.' };
    return `
      <label class="settings-toggle custom-timer-toggle">
        <span><strong>${timerLabels.title}</strong><small>${timerLabels.help}</small></span>
        <input name="customUseTimer" type="checkbox" />
      </label>
      ${fieldGrid(
        getCustomTemplateFields(activity).map((field, index) =>
          inputField(escapeHtml(field), `customField${index}`, escapeHtml(field))
        )
      )}
      ${reminderFields()}
    `;
  }

  if (activity === 'Football') {
    return fieldGrid([
      inputField('Team 1', 'teamOneName', 'Home team'),
      inputField('Team 2', 'teamTwoName', 'Away team'),
      inputField('Team 1 score', 'teamOneScore', '0', 'number'),
      inputField('Team 2 score', 'teamTwoScore', '0', 'number'),
    ]);
  }

  if (activity === 'Gym') {
    return `
      <div class="gym-workout-builder">
        <header>
          <h2>${gymText('title')}</h2>
          <p>${gymText('chooseWorkoutDay')}</p>
        </header>

        <input id="gym-workout-day" name="gymWorkoutDay" type="hidden" value="" />
        <div class="workout-grid" id="gym-workout-grid">
          ${gymWorkoutDays
            .map(
              (day) => `
                <button class="workout-button" type="button" data-gym-day="${day}">
                  ${gymText(day)}
                </button>
              `
            )
            .join('')}
        </div>

        ${inputField(gymText('customWorkout'), 'gymCustomWorkout', gymText('customWorkoutPlaceholder'))}

        <h2 class="gym-section-title">${gymText('currentExercise')}</h2>
        <label class="gym-exercise-name-field">
          ${gymText('exerciseName')}
          <input name="gymExerciseName" type="text" autocomplete="off" placeholder="${gymText('exercisePlaceholder')}" />
          <div class="gym-exercise-options collapsed" id="gym-exercise-options">
            <div class="gym-option-list" id="gym-exercise-option-list"></div>
          </div>
        </label>

        <div class="gym-set-row">
          ${inputField(gymText('setWeight'), 'gymSetWeight', gymText('setWeight'), 'number')}
          ${inputField(gymText('setReps'), 'gymSetReps', gymText('setReps'), 'number')}
          <button class="button secondary" id="gym-add-set" type="button">+ ${gymText('set')}</button>
        </div>

        <div class="gym-list-box">
          <h2>${gymText('restTimer')}</h2>
          <strong class="gym-rest-time" id="gym-rest-time">00:00</strong>
          <div class="button-row">
            <button class="button secondary" id="gym-rest-start" type="button">${text('start')}</button>
            <button class="button secondary" id="gym-rest-pause" type="button">${gymText('pause')}</button>
            <button class="button secondary" id="gym-rest-reset" type="button">${gymText('reset')}</button>
          </div>
        </div>

        <div class="gym-list-box">
          <h2>${gymText('setsForThisExercise')}</h2>
          <div id="gym-current-set-list" class="gym-entry-list"></div>
        </div>

        <button class="button secondary" id="gym-save-exercise" type="button">${gymText('saveExercise')}</button>

        <div class="gym-list-box">
          <h2>${gymText('exercisesAdded')}</h2>
          <div id="gym-exercise-list" class="gym-entry-list"></div>
        </div>

        <div class="gym-list-box">
          <h2>${gymText('progressSummary')}</h2>
          <div id="gym-progress-summary" class="gym-entry-list"></div>
        </div>
        ${reminderFields()}
      </div>
    `;
  }

  if (lapActivities.includes(activity)) {
    const imperial = state.settings.measurementSystem === 'imperial';
    const fields = [
      inputField('Laps', 'laps', '4', 'number'),
      inputField('Lap distance', 'lapDistance', imperial ? (activity === 'Swimming' ? '25' : '1') : activity === 'Cycling' ? '1' : '400', 'number'),
      selectField('Unit', 'lapDistanceUnit', imperial ? ['yd', 'mi'] : ['m', 'km']),
    ];

    if (movementActivities.includes(activity)) {
      fields.push(
        inputField('Route name', 'routeName', 'Park loop'),
        inputField('Goal', 'goal', '5 km easy pace'),
        inputField('Elevation gain', 'elevationGain', '120 m'),
        textAreaField('Splits', 'splits', '1km 6:10, 2km 6:05', true),
        textAreaField('Personal record', 'personalRecord', 'Fastest 5 km', true)
      );
    }

    fields.push(textAreaField('Notes', 'notes', 'How did it feel?', true));

    return fieldGrid(fields);
  }

  if (matchActivities.includes(activity)) {
    return fieldGrid([
      inputField('Team 1', 'matchTeamOneName', 'Us'),
      inputField('Team 2', 'matchTeamTwoName', 'Them'),
      inputField('Set number', 'matchSetNumber', '1', 'number'),
      inputField('Team 1 games', 'matchTeamOneTotal', '0', 'number'),
      inputField('Team 2 games', 'matchTeamTwoTotal', '0', 'number'),
      inputField('Team 1 points', 'matchTeamOnePoints', '40'),
      inputField('Team 2 points', 'matchTeamTwoPoints', '30'),
      inputField('Server', 'matchServer', 'Team 1'),
      inputField('Tiebreak score', 'matchTiebreakScore', '7-5'),
      inputField('Winner', 'matchWinner', 'Team 1'),
      inputField('Team 1 winners', 'matchTeamOneWinners', '12', 'number'),
      inputField('Team 2 winners', 'matchTeamTwoWinners', '9', 'number'),
      inputField('Team 1 errors', 'matchTeamOneErrors', '6', 'number'),
      inputField('Team 2 errors', 'matchTeamTwoErrors', '8', 'number'),
      textAreaField('Rounds notes', 'matchRounds', 'Round 1: 6-4', true),
    ]);
  }

  if (activity === 'Baloot') {
    return `
      <div class="baloot-calculator">
        <header>
          <div>
            <h2>${balootText('title')}</h2>
            <p>${balootText('subtitle')}</p>
          </div>
        </header>

        <h2 class="baloot-section-title">${balootText('teamNames')}</h2>
        <div class="field-grid">
          ${inputField(balootText('usName'), 'balootUsName', balootText('us'))}
          ${inputField(balootText('themName'), 'balootThemName', balootText('them'))}
        </div>

        <div class="baloot-total-box">
          <div class="baloot-total-card">
            <span id="baloot-us-label">${balootText('us')}</span>
            <strong id="baloot-us-total">0</strong>
          </div>
          <div class="baloot-total-card">
            <span id="baloot-them-label">${balootText('them')}</span>
            <strong id="baloot-them-total">0</strong>
          </div>
        </div>

        <div class="baloot-winner-box">
          <span>${balootText('winner')}</span>
          <strong id="baloot-winner">Not finished yet</strong>
        </div>

        <button class="baloot-dealer-box" id="baloot-dealer-button" type="button">
          <span>${balootText('dealerDirection')}</span>
          <strong id="baloot-dealer-direction">↑</strong>
          <small>${balootText('dealerHint')}</small>
        </button>

        <h2 class="baloot-section-title">${balootText('addHandScore')}</h2>
        <div class="field-grid">
          ${inputField(balootText('usScore'), 'balootUsScore', balootText('us'), 'number')}
          ${inputField(balootText('themScore'), 'balootThemScore', balootText('them'), 'number')}
        </div>

        <div class="button-row baloot-actions">
          <button class="button secondary" id="baloot-add-score" type="button">${balootText('addScore')}</button>
          <button class="button secondary" id="baloot-delete-last" type="button">${balootText('deleteLast')}</button>
          <button class="button danger" id="baloot-reset" type="button">${balootText('reset')}</button>
        </div>

        <div class="baloot-score-history">
          <h2>${balootText('scoreHistory')}</h2>
          <div id="baloot-score-list" class="baloot-score-list"></div>
        </div>

        <div class="baloot-winner-box">
          <span>${balootText('shareResult')}</span>
          <strong id="baloot-share-result"></strong>
        </div>
      </div>
    `;
  }

  if (horseActivities.includes(activity)) {
    const commonHorseField = inputField(horseText('horseName'), 'horseName', horseText('horseNamePlaceholder'));
    const horseNotesField = textAreaField(horseText('notesSection'), 'horseNotes', horseText('horseNotes'), true);

    if (activity === 'Horse Riding') {
      return `
        <div class="horse-form">
          ${fieldSection(horseText('trainingSection'), [
            inputField(horseText('riderName'), 'riderName', horseText('riderNamePlaceholder')),
            commonHorseField,
            inputField(horseText('trainingType'), 'trainingType', horseText('trainingTypePlaceholder')),
            selectField(horseText('trainingIntensity'), 'trainingIntensity', [
              horseText('easy'), horseText('medium'), horseText('hard'),
            ]),
            inputField(horseText('trainingTime'), 'trainingTime', '45 min'),
            checkboxField(horseText('restDay'), 'restDay'),
            inputField(horseText('walkingMinutes'), 'walkingMinutes', '20', 'number'),
            horseNotesField,
          ])}
          ${fieldSection(horseText('performanceSection'), [
            inputField(horseText('walkMinutes'), 'walkMinutes', '10', 'number'),
            inputField(horseText('trotMinutes'), 'trotMinutes', '15', 'number'),
            inputField(horseText('canterMinutes'), 'canterMinutes', '8', 'number'),
            inputField(horseText('rideDistance'), 'rideDistance', '4.2 km'),
            inputField(horseText('averageSpeed'), 'averageSpeed', '8.5 km/h'),
            inputField(horseText('leftTurns'), 'leftTurns', '12', 'number'),
            inputField(horseText('rightTurns'), 'rightTurns', '12', 'number'),
          ])}
          ${reminderFields()}
        </div>
      `;
    }

    if (activity === 'Daily Care') {
      return `
        <div class="horse-form">
          ${fieldSection(horseText('dailyCareSection'), [
            commonHorseField,
            checkboxField(horseText('hayGiven'), 'hayGiven'),
            checkboxField(horseText('waterChecked'), 'waterChecked'),
            checkboxField(horseText('foodOilGiven'), 'foodOilGiven'),
            checkboxField(horseText('hoofOilUsed'), 'hoofOilUsed'),
            horseNotesField,
          ])}
          ${reminderFields()}
        </div>
      `;
    }

    if (activity === 'Supplies and Feed') {
      return `
        <div class="horse-form">
          ${fieldSection(horseText('farrierSection'), [
            commonHorseField,
            inputField(horseText('farrierVisit'), 'farrierVisit', '17/07/2026'),
            inputField(horseText('nextFarrierVisit'), 'nextFarrierVisit', '28/08/2026'),
            inputField(horseText('foodOilBuyingDate'), 'foodOilBuyingDate', '06/07/2026'),
            inputField(horseText('hoofOilBuyingDate'), 'hoofOilBuyingDate', '06/07/2026'),
            horseNotesField,
          ])}
          ${fieldSection(horseText('cleaningSection'), [
            checkboxField(horseText('shampooUsed'), 'shampooUsed'),
            inputField(horseText('shampooBuyingDate'), 'shampooBuyingDate', '06/07/2026'),
            checkboxField(horseText('padsCleaningSuppliesUsed'), 'padsCleaningSuppliesUsed'),
            inputField(horseText('padsCleaningSuppliesBuyingDate'), 'padsCleaningSuppliesBuyingDate', horseText('padsDatePlaceholder')),
            `<div class="optional-supply-builder full">
              <div id="horse-cleaning-supply-list">
                ${Array.from({ length: state.horseCleaningSupplyCount }, (_, index) => horseCleaningSupplyEntryFields(index)).join('')}
              </div>
              <button class="button secondary add-feed-button" id="horse-add-cleaning-supply" type="button">+ ${horseText('addCleaningSupply')}</button>
            </div>`,
          ])}
          <div class="field-section">
            <h2>${horseText('monthlyFeedSection')}</h2>
            <div id="horse-feed-list">
              ${Array.from({ length: state.horseFeedCount }, (_, index) => horseFeedEntryFields(index)).join('')}
            </div>
            <button class="button secondary add-feed-button" id="horse-add-feed" type="button">+ ${horseText('addFeed')}</button>
          </div>
          ${reminderFields()}
        </div>
      `;
    }

    return `
      <div class="horse-form">
        ${fieldSection(horseText('ridingInfoSection'), [
          inputField(horseText('riderName'), 'riderName', horseText('riderNamePlaceholder')),
          commonHorseField,
          horseNotesField,
        ])}
        ${fieldSection(horseText('testSection'), [
          checkboxField(horseText('dressageTestDay'), 'dressageTestDay', 'dressage-fields'),
          checkboxField(horseText('jumpingDay'), 'jumpingDay', 'jumping-fields'),
          conditionalFields('dressage-fields', [
            inputField(horseText('dressageTestName'), 'dressageTestName', horseText('dressageTestName')),
            inputField(horseText('dressageScore'), 'dressageScore', '68.5', 'number'),
            textAreaField(horseText('dressageNotes'), 'dressageNotes', horseText('dressageNotes'), true),
          ]),
          conditionalFields('jumping-fields', [
            inputField(horseText('fenceHeight'), 'fenceHeight', '80 cm'),
            inputField(horseText('fenceCount'), 'fenceCount', '8', 'number'),
            textAreaField(horseText('jumpingNotes'), 'jumpingNotes', horseText('jumpingNotes'), true),
          ]),
        ])}
        ${reminderFields()}
      </div>
    `;
  }

  if (activity === 'Vehicle Maintenance') {
    return fieldGrid([
      inputField('Vehicle name', 'vehicleName', 'Car name'),
      inputField('Plate number', 'plateNumber', 'ABC 1234'),
      inputField('Model / Year', 'modelYear', 'Camry 2022'),
      selectField('Service type', 'serviceType', [
        'Tire service',
        'Battery service',
        'Oil service',
        'Gas',
        'Insurance',
        'Registration',
        'Repair',
        'Other service',
      ]),
      inputField('Service date', 'serviceDate', '2026-07-17', 'date'),
      inputField('Mileage', 'mileage', '12000'),
      inputField('Cost', 'cost', '150'),
      inputField('Shop / place name', 'shopName', 'Service center'),
      inputField('Next service date', 'nextServiceDate', '2026-10-17', 'date'),
      inputField('Next service mileage', 'nextServiceMileage', '17000'),
      inputField('Insurance expiration date', 'insuranceExpirationDate', '2027-07-17', 'date'),
      inputField('Registration end date', 'registrationEndDate', '2027-07-17', 'date'),
      expirationReminderField(),
      inputField('Reminder date', 'reminderDate', '2026-08-01', 'date'),
      inputField('Reminder time', 'reminderTime', '18:30', 'time'),
      textAreaField('Reminder note', 'reminderNote', 'Renew insurance or book service', true),
      textAreaField('Notes', 'notes', 'What was done?', true),
    ]);
  }

  if (activity === 'Personal Info') {
    const labels = state.language === 'ar'
      ? {
          title: 'المعلومات الشخصية', privacy: 'للخصوصية، يتم حفظ آخر أربعة أحرف فقط من أرقام الوثائق.',
          idNumber: 'رقم الهوية', idExpiration: 'تاريخ انتهاء الهوية',
          dlExpiration: 'تاريخ انتهاء رخصة القيادة', passportNumber: 'رقم الجواز',
          passportExpiration: 'تاريخ انتهاء الجواز',
        }
      : {
          title: 'Personal Info', privacy: 'For privacy, only the last four characters of document numbers are saved.',
          idNumber: 'ID number', idExpiration: 'ID expiration date',
          dlExpiration: 'Driving license expiration date', passportNumber: 'Passport number',
          passportExpiration: 'Passport expiration date',
        };

    return `
      <section class="field-section personal-info-form">
        <h2>${labels.title}</h2>
        <p class="privacy-note">${labels.privacy}</p>
        <div class="field-grid">
          ${inputField(labels.idNumber, 'personalIdNumber', labels.idNumber, 'password')}
          ${inputField(labels.idExpiration, 'personalIdExpirationDate', '2027-01-01', 'date')}
          ${inputField(labels.dlExpiration, 'personalDlExpirationDate', '2027-01-01', 'date')}
          ${inputField(labels.passportNumber, 'personalPassportNumber', labels.passportNumber, 'password')}
          ${inputField(labels.passportExpiration, 'personalPassportExpirationDate', '2027-01-01', 'date')}
          ${expirationReminderField()}
        </div>
      </section>
    `;
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
    return `
      <div class="study-focus">
        <header>
          <h2>${studyText('title')}</h2>
          <p>${studyText('candleHint')}</p>
        </header>
        <div class="field-grid">
          ${inputField(studyText('subject'), 'subject', studyText('subjectPlaceholder'))}
          ${inputField(studyText('studyType'), 'studyType', studyText('studyTypePlaceholder'))}
          ${inputField(studyText('examDate'), 'examDate', studyText('examDatePlaceholder'))}
          ${inputField(studyText('coursework'), 'coursework', studyText('courseworkPlaceholder'))}
          ${inputField(studyText('streak'), 'streak', studyText('streakPlaceholder'))}
          ${inputField(studyText('totalStudyHours'), 'totalStudyHours', studyText('totalHoursPlaceholder'), 'number')}
        </div>
        <div class="study-candle-card">
          <span>${studyText('candleTimer')}</span>
          <div class="study-candle-visual">
            <div class="study-candle-flame" id="study-candle-flame"></div>
            <div class="study-candle-body" id="study-candle-body">
              <div class="study-candle-wick"></div>
              <div class="study-candle-wax-lip"></div>
              <div class="study-candle-wax-drip"></div>
            </div>
          </div>
          <strong id="study-candle-time">03:00:00</strong>
          <div class="study-candle-progress" aria-hidden="true">
            <div id="study-candle-progress-fill"></div>
          </div>
          <div class="button-row">
            <button class="button secondary" id="study-candle-start" type="button">${studyText('start')}</button>
            <button class="button secondary" id="study-candle-pause" type="button">${studyText('pause')}</button>
            <button class="button secondary" id="study-candle-stop" type="button">${studyText('stop')}</button>
          </div>
          <div class="study-candle-complete hidden" id="study-candle-complete" role="status">
            <p>${studyText('candleComplete')}</p>
            <div class="button-row">
              <button class="button primary" id="study-candle-restart" type="button">${studyText('startAnother')}</button>
              <button class="button secondary" id="study-candle-finish" type="button">${studyText('finishStudying')}</button>
            </div>
          </div>
        </div>
        ${textAreaField(studyText('notes'), 'notes', studyText('notes'), true)}
        ${reminderFields()}
      </div>
    `;
  }

  if (activity === 'Work') {
    return `
      <div class="study-focus">
        <header>
          <h2>${workText('title')}</h2>
          <p>${workText('candleHint')}</p>
        </header>
        <div class="field-grid">
          ${inputField(workText('projectName'), 'projectName', workText('projectPlaceholder'))}
          ${inputField(workText('candleHours'), 'workCandleHours', '3', 'number')}
          ${inputField(workText('candleMinutes'), 'workCandleMinutes', '0', 'number')}
        </div>
        ${focusCandleMarkup('work')}
        ${textAreaField(workText('notes'), 'notes', workText('notes'), true)}
        ${reminderFields()}
      </div>
    `;
  }

  return fieldGrid([
    inputField('Session title', 'title', activity),
    textAreaField('Notes', 'notes', 'Add details', true),
  ]);
}

function focusCandleMarkup(mode) {
  const isWork = mode === 'work';
  const candleHint = isWork
    ? workText('candleHint')
    : studyText('candleHint');
  const completeText = isWork
    ? state.language === 'ar' ? 'تم حفظ جلسة العمل تلقائياً. هل تريد متابعة العمل؟' : 'Your work session was automatically saved. Continue working?'
    : studyText('candleComplete');
  const finishText = isWork
    ? state.language === 'ar' ? 'ليس الآن' : 'Not now'
    : studyText('finishStudying');

  return `
    <div class="study-candle-card">
      <span>${studyText('candleTimer')}</span>
      <div class="study-candle-visual">
        <div class="study-candle-flame" id="study-candle-flame"></div>
        <div class="study-candle-body" id="study-candle-body">
          <div class="study-candle-wick"></div>
          <div class="study-candle-wax-lip"></div>
          <div class="study-candle-wax-drip"></div>
        </div>
      </div>
      <strong id="study-candle-time">03:00:00</strong>
      <p>${candleHint}</p>
      <div class="study-candle-progress" aria-hidden="true">
        <div id="study-candle-progress-fill"></div>
      </div>
      <div class="button-row">
        <button class="button secondary" id="study-candle-start" type="button">${studyText('start')}</button>
        <button class="button secondary" id="study-candle-pause" type="button">${studyText('pause')}</button>
        <button class="button secondary" id="study-candle-stop" type="button">${studyText('stop')}</button>
      </div>
      <div class="study-candle-complete hidden" id="study-candle-complete" role="status">
        <p>${completeText}</p>
        <div class="button-row">
          <button class="button primary" id="study-candle-restart" type="button">${studyText('startAnother')}</button>
          <button class="button secondary" id="study-candle-finish" type="button">${finishText}</button>
        </div>
      </div>
    </div>
  `;
}

function fieldGrid(fields) {
  return `<div class="field-grid">${fields.join('')}</div>`;
}

const arabicFieldLabels = {
  'Balls hit': 'عدد الكرات',
  Club: 'العصا',
  Cost: 'التكلفة',
  'Elevation gain': 'الارتفاع المكتسب',
  Goal: 'الهدف',
  'Insurance expiration date': 'تاريخ انتهاء التأمين',
  'Lap distance': 'مسافة اللفة',
  Laps: 'اللفات',
  Mileage: 'عداد المسافة',
  'Model / Year': 'الموديل / السنة',
  'Next service date': 'تاريخ الصيانة القادمة',
  'Next service mileage': 'عداد الصيانة القادمة',
  Notes: 'ملاحظات',
  'Personal record': 'الرقم القياسي الشخصي',
  'Plate number': 'رقم اللوحة',
  'Range name': 'اسم ميدان التدريب',
  'Registration end date': 'تاريخ انتهاء الاستمارة',
  'Reminder date': 'تاريخ التذكير',
  'Reminder note': 'ملاحظة التذكير',
  'Reminder time': 'وقت التذكير',
  'Rounds notes': 'ملاحظات الجولات',
  'Route name': 'اسم المسار',
  Server: 'المرسل',
  'Service date': 'تاريخ الصيانة',
  'Session title': 'عنوان الجلسة',
  'Set number': 'رقم المجموعة',
  'Shop / place name': 'اسم المحل / المكان',
  Splits: 'تقسيمات الوقت',
  'Team 1': 'الفريق الأول',
  'Team 1 errors': 'أخطاء الفريق الأول',
  'Team 1 games': 'أشواط الفريق الأول',
  'Team 1 points': 'نقاط الفريق الأول',
  'Team 1 score': 'نتيجة الفريق الأول',
  'Team 1 winners': 'ضربات الفوز للفريق الأول',
  'Team 2': 'الفريق الثاني',
  'Team 2 errors': 'أخطاء الفريق الثاني',
  'Team 2 games': 'أشواط الفريق الثاني',
  'Team 2 points': 'نقاط الفريق الثاني',
  'Team 2 score': 'نتيجة الفريق الثاني',
  'Team 2 winners': 'ضربات الفوز للفريق الثاني',
  'Tiebreak score': 'نتيجة كسر التعادل',
  'Vehicle name': 'اسم المركبة',
  Winner: 'الفائز',
};

function localizedFieldLabel(label) {
  return state.language === 'ar' ? arabicFieldLabels[label] || label : label;
}

function fieldSection(title, fields) {
  return `
    <section class="field-section">
      <h2>${localizedFieldLabel(title)}</h2>
      <div class="field-grid">${fields.join('')}</div>
    </section>
  `;
}

function inputField(label, name, placeholder, type = 'text') {
  const displayLabel = localizedFieldLabel(label);
  return `
    <label>
      ${displayLabel}
      <input name="${name}" type="${type}" placeholder="${state.language === 'ar' ? displayLabel : placeholder}" />
    </label>
  `;
}

function checkboxField(label, name, controls = '') {
  return `
    <label class="checkbox-field">
      <input name="${name}" type="checkbox" value="true" ${controls ? `data-controls="${controls}"` : ''} />
      <span>${localizedFieldLabel(label)}</span>
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

    control.addEventListener('change', async () => {
      if (
        control.name === 'reminderNotificationEnabled'
        && control.checked
        && 'Notification' in window
      ) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          control.checked = false;
          sessionMessage.textContent = state.language === 'ar'
            ? 'الإشعارات غير مسموحة في إعدادات المتصفح.'
            : 'Notifications are blocked in your browser settings.';
        } else if (!state.settings.notificationsEnabled) {
          await saveUsabilitySettings({ ...state.settings, notificationsEnabled: true });
        }
      }
      updateVisibility();
    });
    updateVisibility();
  });
}

function updateCustomTimerVisibility() {
  const isCustom = state.customActivities.includes(state.selectedActivity);
  const hideTimer = isCustom && !state.customActivityUsesTimer;
  timerCard.hidden = hideTimer || isSelectedActivityNonTimed(state.selectedActivity)
    || state.selectedActivity === 'Studying' || state.selectedActivity === 'Work';
  trackerView.classList.toggle('vehicle-mode', hideTimer || isSelectedActivityNonTimed(state.selectedActivity));
}

function bindCustomTimerToggle() {
  const toggle = sessionForm.querySelector('[name="customUseTimer"]');
  if (!toggle) return;
  toggle.addEventListener('change', () => {
    state.customActivityUsesTimer = toggle.checked;
    if (!toggle.checked) {
      stopTimer();
      state.startTime = null;
      state.endTime = null;
      timerDisplay.textContent = '00:00:00';
    }
    updateCustomTimerVisibility();
  });
}

function bindHorseFeedEntries() {
  const addFeedButton = document.querySelector('#horse-add-feed');

  if (!addFeedButton) {
    return;
  }

  addFeedButton.addEventListener('click', () => {
    const savedFields = captureActivityFieldValues();
    state.horseFeedCount += 1;
    activityFields.innerHTML = getFieldsForActivity('Supplies and Feed');
    restoreActivityFieldValues(savedFields);
    bindConditionalFields();
    bindHorseFeedEntries();
    bindHorseCleaningSupplies();
  });
}

function bindHorseCleaningSupplies() {
  const addButton = document.querySelector('#horse-add-cleaning-supply');
  if (!addButton) return;

  addButton.addEventListener('click', () => {
    const savedFields = captureActivityFieldValues();
    state.horseCleaningSupplyCount += 1;
    activityFields.innerHTML = getFieldsForActivity('Supplies and Feed');
    restoreActivityFieldValues(savedFields);
    bindConditionalFields();
    bindHorseFeedEntries();
    bindHorseCleaningSupplies();
  });

  activityFields.querySelectorAll('[data-remove-cleaning-supply]').forEach((button) => {
    button.addEventListener('click', () => {
      const removedIndex = Number(button.dataset.removeCleaningSupply);
      const savedValues = Array.from(
        activityFields.querySelectorAll('[data-horse-cleaning-supply-entry]')
      )
        .filter((_, index) => index !== removedIndex)
        .map((entry, index) => ({
          name: entry.querySelector(`[name^="cleaningSupplyName"]`)?.value || '',
          buyingDate: entry.querySelector(`[name^="cleaningSupplyBuyingDate"]`)?.value || '',
          index,
        }));
      const savedFields = captureActivityFieldValues().filter(
        (field) => !/^cleaningSupply(?:Name|BuyingDate)\d+$/.test(field.name)
      );
      state.horseCleaningSupplyCount = savedValues.length;
      activityFields.innerHTML = getFieldsForActivity('Supplies and Feed');
      restoreActivityFieldValues(savedFields);
      savedValues.forEach((entry) => {
        const nameInput = activityFields.querySelector(`[name="cleaningSupplyName${entry.index}"]`);
        const dateInput = activityFields.querySelector(`[name="cleaningSupplyBuyingDate${entry.index}"]`);
        if (nameInput) nameInput.value = entry.name;
        if (dateInput) dateInput.value = entry.buyingDate;
      });
      bindConditionalFields();
      bindHorseFeedEntries();
      bindHorseCleaningSupplies();
    });
  });
}

function formatStudyCandleElapsedTime() {
  return formatDuration(state.studyCandleSeconds);
}

function formatStudyCandleRemainingTime() {
  return formatDuration(Math.max(0, state.studyCandleDurationSeconds - state.studyCandleSeconds));
}

function getConfiguredWorkCandleSeconds() {
  const hours = Number(sessionForm.querySelector('[name="workCandleHours"]')?.value || 0);
  const minutes = Number(sessionForm.querySelector('[name="workCandleMinutes"]')?.value || 0);
  return Math.min(12 * 60 * 60, Math.max(0, Math.floor(hours * 60 * 60 + minutes * 60)));
}

function resetStudyCandle() {
  if (state.studyCandleTimerId) {
    window.clearInterval(state.studyCandleTimerId);
  }

  state.studyCandleSeconds = 0;
  state.studyCandleDurationSeconds =
    state.selectedActivity === 'Work'
      ? getConfiguredWorkCandleSeconds() || STUDY_CANDLE_DURATION_SECONDS
      : STUDY_CANDLE_DURATION_SECONDS;
  state.studyCandleRunning = false;
  state.studyCandleTimerId = null;
  state.studyCandleStartedAt = null;
  state.studyCandleBaseSeconds = 0;
  state.studyCandleAutoSaved = false;
  document.querySelector('#save-session-button')?.removeAttribute('disabled');
}

function bindStudyCandle() {
  document.querySelector('#study-candle-start')?.addEventListener('click', startStudyCandle);
  document.querySelector('#study-candle-pause')?.addEventListener('click', pauseStudyCandle);
  document.querySelector('#study-candle-stop')?.addEventListener('click', stopStudyCandle);
  document.querySelector('#study-candle-restart')?.addEventListener('click', startAnotherStudyCandle);
  document.querySelector('#study-candle-finish')?.addEventListener('click', () => {
    document.querySelector('#study-candle-complete')?.classList.add('hidden');
  });
  sessionForm.querySelectorAll('[name="workCandleHours"], [name="workCandleMinutes"]').forEach((input) => {
    input.addEventListener('input', () => {
      if (!state.studyCandleRunning && state.studyCandleSeconds === 0) {
        state.studyCandleDurationSeconds = getConfiguredWorkCandleSeconds();
        renderStudyCandle();
      }
    });
  });
}

function startStudyCandle() {
  if (
    state.selectedActivity === 'Work' &&
    !sessionForm.querySelector('[name="projectName"]')?.value.trim()
  ) {
    sessionMessage.textContent = workText('projectRequired');
    return;
  }

  if (state.selectedActivity === 'Work') {
    const configuredSeconds = getConfiguredWorkCandleSeconds();
    if (configuredSeconds < 60) {
      sessionMessage.textContent = workText('candleTimeRequired');
      return;
    }
    if (state.studyCandleSeconds === 0) {
      state.studyCandleDurationSeconds = configuredSeconds;
    }
  }

  if (state.studyCandleSeconds >= state.studyCandleDurationSeconds) {
    startAnotherStudyCandle();
    return;
  }

  if (!state.startTime) {
    startTimer();
  }

  if (state.studyCandleTimerId) {
    return;
  }

  state.studyCandleRunning = true;
  state.studyCandleBaseSeconds = state.studyCandleSeconds;
  state.studyCandleStartedAt = Date.now();
  state.studyCandleAutoSaved = false;
  state.studyCandleTimerId = window.setInterval(updateStudyCandle, 1000);
  updateStudyCandle();
  renderStudyCandle();
}

function pauseStudyCandle() {
  updateStudyCandle(false);

  if (state.studyCandleTimerId) {
    window.clearInterval(state.studyCandleTimerId);
  }

  state.studyCandleRunning = false;
  state.studyCandleTimerId = null;
  state.studyCandleStartedAt = null;
  state.studyCandleBaseSeconds = state.studyCandleSeconds;
  renderStudyCandle();
}

function stopStudyCandle() {
  pauseStudyCandle();

  if (state.startTime && !state.endTime) {
    endTimer();
  }
}

function updateStudyCandle(allowAutoSave = true) {
  if (!state.studyCandleRunning || !state.studyCandleStartedAt) {
    return;
  }

  const elapsedSinceStart = Math.floor((Date.now() - state.studyCandleStartedAt) / 1000);
  state.studyCandleSeconds = Math.min(
    state.studyCandleDurationSeconds,
    state.studyCandleBaseSeconds + elapsedSinceStart
  );

  if (
    allowAutoSave &&
    state.studyCandleSeconds >= state.studyCandleDurationSeconds &&
    !state.studyCandleAutoSaved
  ) {
    autoSaveCompletedStudyCandle();
    return;
  }

  renderStudyCandle();
}

function autoSaveCompletedStudyCandle() {
  const completedAt = new Date(
    state.studyCandleStartedAt +
      (state.studyCandleDurationSeconds - state.studyCandleBaseSeconds) * 1000
  );

  const completedDurationSeconds = state.studyCandleDurationSeconds;
  state.studyCandleSeconds = completedDurationSeconds;
  state.studyCandleBaseSeconds = completedDurationSeconds;
  state.studyCandleStartedAt = null;
  state.studyCandleRunning = false;
  state.endTime = completedAt;
  state.startTime = new Date(completedAt.getTime() - completedDurationSeconds * 1000);

  if (state.studyCandleTimerId) {
    window.clearInterval(state.studyCandleTimerId);
    state.studyCandleTimerId = null;
  }

  stopTimer();
  updateTimer();
  sessionForm.requestSubmit();
  state.studyCandleAutoSaved = true;
  document.querySelector('#save-session-button')?.setAttribute('disabled', '');
  renderStudyCandle();
}

function syncStudyCandleWithClock() {
  if (state.studyCandleRunning) {
    updateStudyCandle();
  }
}

function startAnotherStudyCandle() {
  resetStudyCandle();
  state.startTime = null;
  state.endTime = null;
  updateTimer();
  startStudyCandle();
}

function renderStudyCandle() {
  const progress = Math.min(
    1,
    state.studyCandleDurationSeconds > 0
      ? state.studyCandleSeconds / state.studyCandleDurationSeconds
      : 0
  );
  const candleBody = document.querySelector('#study-candle-body');
  const flame = document.querySelector('#study-candle-flame');

  setText('#study-candle-time', formatStudyCandleRemainingTime());
  flame?.classList.toggle('active', state.studyCandleRunning);
  flame?.classList.toggle('burned-out', progress >= 1);

  if (candleBody) {
    candleBody.style.height = `${Math.max(3, 82 * (1 - progress))}px`;
    candleBody.classList.toggle('burned-out', progress >= 1);
  }

  const progressFill = document.querySelector('#study-candle-progress-fill');
  if (progressFill) {
    progressFill.style.width = `${progress * 100}%`;
  }

  sessionForm.querySelectorAll('[name="workCandleHours"], [name="workCandleMinutes"]').forEach((input) => {
    input.disabled = state.studyCandleRunning || state.studyCandleSeconds > 0;
  });

  document.querySelector('#study-candle-complete')?.classList.toggle(
    'hidden',
    !state.studyCandleAutoSaved
  );
}

function resetGymState() {
  state.currentGymSets = [];
  state.gymExercises = [];
  resetGymRestTimer();
}

function bindGymWorkoutBuilder() {
  document.querySelectorAll('[data-gym-day]').forEach((button) => {
    button.addEventListener('click', () => {
      const dayInput = document.querySelector('#gym-workout-day');
      dayInput.value = button.dataset.gymDay;
      renderGymWorkoutBuilder();
    });
  });
  document.querySelector('#gym-add-set')?.addEventListener('click', addGymSet);
  document.querySelector('#gym-save-exercise')?.addEventListener('click', saveGymExercise);
  document.querySelector('#gym-rest-start')?.addEventListener('click', startGymRestTimer);
  document.querySelector('#gym-rest-pause')?.addEventListener('click', pauseGymRestTimer);
  document.querySelector('#gym-rest-reset')?.addEventListener('click', resetGymRestTimer);
  const exerciseInput = document.querySelector('[name="gymExerciseName"]');
  exerciseInput?.addEventListener('input', renderGymExerciseSuggestions);
  exerciseInput?.addEventListener('focus', renderGymExerciseSuggestions);
  exerciseInput?.addEventListener('blur', () => {
    window.setTimeout(() => {
      document.querySelector('#gym-exercise-options')?.classList.add('collapsed');
    }, 120);
  });
}

function formatGymRestTime() {
  const minutes = Math.floor(state.gymRestSeconds / 60);
  const seconds = state.gymRestSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startGymRestTimer() {
  if (state.gymRestTimerId) {
    return;
  }

  state.gymRestTimerId = window.setInterval(() => {
    state.gymRestSeconds += 1;
    renderGymWorkoutBuilder();
  }, 1000);
  renderGymWorkoutBuilder();
}

function pauseGymRestTimer() {
  if (state.gymRestTimerId) {
    window.clearInterval(state.gymRestTimerId);
  }

  state.gymRestTimerId = null;
  renderGymWorkoutBuilder();
}

function resetGymRestTimer() {
  if (state.gymRestTimerId) {
    window.clearInterval(state.gymRestTimerId);
  }

  state.gymRestTimerId = null;
  state.gymRestSeconds = 0;
  renderGymWorkoutBuilder();
}

function addGymSet() {
  const repsInput = sessionForm.querySelector('[name="gymSetReps"]');
  const weightInput = sessionForm.querySelector('[name="gymSetWeight"]');
  const cleanReps = repsInput.value.trim();
  const cleanWeight = weightInput.value.trim();

  if (cleanReps === '') {
    sessionMessage.textContent = gymText('enterReps');
    return;
  }

  state.currentGymSets = [
    ...state.currentGymSets,
    {
      id: Date.now(),
      reps: cleanReps,
      weight: cleanWeight,
    },
  ];
  repsInput.value = '';
  weightInput.value = '';
  sessionMessage.textContent = '';
  state.gymRestSeconds = 0;
  startGymRestTimer();
  renderGymWorkoutBuilder();
}

function deleteCurrentGymSet(setId) {
  state.currentGymSets = state.currentGymSets.filter((set) => set.id !== setId);
  renderGymWorkoutBuilder();
}

function saveGymExercise() {
  const exerciseInput = sessionForm.querySelector('[name="gymExerciseName"]');
  const repsInput = sessionForm.querySelector('[name="gymSetReps"]');
  const weightInput = sessionForm.querySelector('[name="gymSetWeight"]');
  const cleanExerciseName = exerciseInput.value.trim();

  if (cleanExerciseName === '') {
    sessionMessage.textContent = gymText('enterExerciseName');
    return;
  }

  if (state.currentGymSets.length === 0) {
    sessionMessage.textContent = gymText('addSetFirst');
    return;
  }

  state.gymExercises = [
    ...state.gymExercises,
    {
      id: Date.now(),
      name: cleanExerciseName,
      sets: state.currentGymSets,
    },
  ];
  state.currentGymSets = [];
  exerciseInput.value = '';
  repsInput.value = '';
  weightInput.value = '';
  sessionMessage.textContent = '';
  renderGymWorkoutBuilder();
}

function deleteGymExercise(exerciseId) {
  state.gymExercises = state.gymExercises.filter((exercise) => exercise.id !== exerciseId);
  renderGymWorkoutBuilder();
}

function getBestGymSet() {
  const allSets = state.gymExercises.flatMap((exercise) =>
    exercise.sets.map((set) => ({
      exerciseName: exercise.name,
      reps: String(set.reps || ''),
      weight: String(set.weight || ''),
      numericWeight: Number(set.weight) || 0,
    }))
  );

  const weightedSets = allSets.filter((set) => set.numericWeight > 0);

  if (weightedSets.length === 0) {
    return null;
  }

  return weightedSets.reduce((bestSet, set) =>
    set.numericWeight > bestSet.numericWeight ? set : bestSet
  );
}

function getGymExerciseOptions() {
  const names = new Map();
  const exercises = [
    ...state.sessions.flatMap((session) => session.activity === 'Gym' && Array.isArray(session.details?.gymExercises)
      ? session.details.gymExercises
      : []),
    ...state.gymExercises,
  ];
  exercises.forEach((exercise) => {
    const cleanName = String(exercise.name || '').trim();
    if (cleanName) names.set(cleanName.toLowerCase(), cleanName);
  });
  return [...names.values()].sort((a, b) => a.localeCompare(b));
}

function renderGymExerciseSuggestions() {
  const exerciseInput = sessionForm.querySelector('[name="gymExerciseName"]');
  const exerciseOptionsBox = document.querySelector('#gym-exercise-options');
  const exerciseOptionList = document.querySelector('#gym-exercise-option-list');

  if (!exerciseInput || !exerciseOptionsBox || !exerciseOptionList) return;

  const search = exerciseInput.value.trim().toLowerCase();
  const isTyping = document.activeElement === exerciseInput && search.length > 0;
  const matchingOptions = isTyping
    ? getGymExerciseOptions()
        .filter((exerciseName) => exerciseName.toLowerCase().includes(search))
        .slice(0, 6)
    : [];

  exerciseOptionList.innerHTML = matchingOptions
    .map((exerciseName) => `<button class="gym-option-button" type="button" data-gym-exercise-option="${escapeHtml(exerciseName)}">${escapeHtml(exerciseName)}</button>`)
    .join('');
  exerciseOptionsBox.classList.toggle('collapsed', matchingOptions.length === 0);

  exerciseOptionList.querySelectorAll('[data-gym-exercise-option]').forEach((button) => {
    button.addEventListener('click', () => {
      exerciseInput.value = button.dataset.gymExerciseOption;
      exerciseOptionsBox.classList.add('collapsed');
      exerciseInput.blur();
    });
  });
}

function renderGymWorkoutBuilder() {
  const selectedDay = document.querySelector('#gym-workout-day')?.value || '';
  const restTimer = document.querySelector('#gym-rest-time');
  const currentSetList = document.querySelector('#gym-current-set-list');
  const exerciseList = document.querySelector('#gym-exercise-list');
  const progressSummary = document.querySelector('#gym-progress-summary');

  document.querySelectorAll('[data-gym-day]').forEach((button) => {
    button.classList.toggle('selected', button.dataset.gymDay === selectedDay);
  });

  if (restTimer) {
    restTimer.textContent = formatGymRestTime();
  }

  renderGymExerciseSuggestions();

  if (currentSetList) {
    currentSetList.innerHTML =
      state.currentGymSets.length === 0
        ? `<div class="empty-state">${gymText('noSets')}</div>`
        : state.currentGymSets
            .map(
              (set, index) => `
                <div class="gym-entry-row">
                  <span>${gymText('set')} ${index + 1}: ${set.weight ? `${escapeHtml(set.weight)} kg, ` : ''}${escapeHtml(set.reps)} ${gymText('reps')}</span>
                  <button class="icon-button" type="button" data-delete-gym-set="${set.id}">X</button>
                </div>
              `
            )
            .join('');

    currentSetList.querySelectorAll('[data-delete-gym-set]').forEach((button) => {
      button.addEventListener('click', () => deleteCurrentGymSet(Number(button.dataset.deleteGymSet)));
    });
  }

  if (exerciseList) {
    exerciseList.innerHTML =
      state.gymExercises.length === 0
        ? `<div class="empty-state">${gymText('noExercises')}</div>`
        : state.gymExercises
            .map(
              (exercise, index) => `
                <div class="gym-entry-row">
                  <span>
                    <strong>${index + 1}. ${escapeHtml(exercise.name)}</strong>
                    ${exercise.sets
                      .map((set, setIndex) => `<small>${gymText('set')} ${setIndex + 1}: ${set.weight ? `${escapeHtml(set.weight)} kg, ` : ''}${escapeHtml(set.reps)} ${gymText('reps')}</small>`)
                      .join('')}
                  </span>
                  <button class="icon-button" type="button" data-delete-gym-exercise="${exercise.id}">X</button>
                </div>
              `
            )
            .join('');

    exerciseList.querySelectorAll('[data-delete-gym-exercise]').forEach((button) => {
      button.addEventListener('click', () => deleteGymExercise(Number(button.dataset.deleteGymExercise)));
    });
  }

  if (progressSummary) {
    const bestSet = getBestGymSet();

    progressSummary.innerHTML = bestSet
      ? `<div class="gym-entry-row"><span>${gymText('bestSet')}: <strong>${escapeHtml(bestSet.exerciseName)}</strong><small>${escapeHtml(bestSet.weight)} kg x ${escapeHtml(bestSet.reps)} ${gymText('reps')}</small></span></div>`
      : `<div class="empty-state">${gymText('addWeightForPr')}</div>`;
  }
}

function resetBalootState() {
  state.balootScores = [];
  state.balootDealerDirection = '↑';
}

function getBalootUsTotalFromScores(scores) {
  return scores.reduce((total, score) => total + Number(score.us || 0), 0);
}

function getBalootThemTotalFromScores(scores) {
  return scores.reduce((total, score) => total + Number(score.them || 0), 0);
}

function getBalootUsName() {
  return sessionForm.querySelector('[name="balootUsName"]')?.value.trim() || balootText('us');
}

function getBalootThemName() {
  return sessionForm.querySelector('[name="balootThemName"]')?.value.trim() || balootText('them');
}

function getBalootWinner(usTotal, themTotal) {
  const usName = getBalootUsName();
  const themName = getBalootThemName();

  if (usTotal >= 152 && usTotal > themTotal) {
    return usName;
  }

  if (themTotal >= 152 && themTotal > usTotal) {
    return themName;
  }

  if (usTotal >= 152 && themTotal >= 152 && usTotal === themTotal) {
    return balootText('tie');
  }

  return balootText('notFinished');
}

function getBalootShareText(scores, usTotal, themTotal) {
  const usName = getBalootUsName();
  const themName = getBalootThemName();
  const winner = getBalootWinner(usTotal, themTotal);

  return `Baloot result: ${usName} ${usTotal} - ${themName} ${themTotal}. Winner: ${winner}. Hands played: ${scores.length}.`;
}

function bindBalootCalculator() {
  document.querySelector('#baloot-add-score')?.addEventListener('click', addBalootScore);
  document.querySelector('#baloot-delete-last')?.addEventListener('click', deleteLastBalootScore);
  document.querySelector('#baloot-reset')?.addEventListener('click', resetBalootScores);
  document.querySelector('#baloot-dealer-button')?.addEventListener('click', changeBalootDealerDirection);
  sessionForm.querySelector('[name="balootUsName"]')?.addEventListener('input', renderBalootCalculator);
  sessionForm.querySelector('[name="balootThemName"]')?.addEventListener('input', renderBalootCalculator);
}

function addBalootScore() {
  const usInput = sessionForm.querySelector('[name="balootUsScore"]');
  const themInput = sessionForm.querySelector('[name="balootThemScore"]');
  const cleanUsScore = usInput.value.trim();
  const cleanThemScore = themInput.value.trim();

  if (cleanUsScore === '') {
    sessionMessage.textContent = balootText('enterUs');
    return;
  }

  if (cleanThemScore === '') {
    sessionMessage.textContent = balootText('enterThem');
    return;
  }

  const usNumber = Number(cleanUsScore);
  const themNumber = Number(cleanThemScore);

  if (Number.isNaN(usNumber) || Number.isNaN(themNumber)) {
    sessionMessage.textContent = balootText('scoresMustBeNumbers');
    return;
  }

  if (usNumber < 0 || themNumber < 0) {
    sessionMessage.textContent = balootText('scoresCannotBeNegative');
    return;
  }

  state.balootScores = [
    ...state.balootScores,
    {
      id: Date.now(),
      us: cleanUsScore,
      them: cleanThemScore,
    },
  ];
  usInput.value = '';
  themInput.value = '';
  sessionMessage.textContent = '';
  renderBalootCalculator();

  const winner = getBalootWinner(
    getBalootUsTotalFromScores(state.balootScores),
    getBalootThemTotalFromScores(state.balootScores)
  );

  if (winner === getBalootUsName() || winner === getBalootThemName()) {
    sessionMessage.textContent = balootText('won')(winner);
  }
}

function deleteBalootScore(scoreId) {
  state.balootScores = state.balootScores.filter((score) => score.id !== scoreId);
  renderBalootCalculator();
}

function deleteLastBalootScore() {
  if (state.balootScores.length === 0) {
    sessionMessage.textContent = balootText('noScoreToDelete');
    return;
  }

  state.balootScores = state.balootScores.slice(0, -1);
  sessionMessage.textContent = '';
  renderBalootCalculator();
}

function resetBalootScores() {
  resetBalootState();
  sessionForm.querySelector('[name="balootUsScore"]').value = '';
  sessionForm.querySelector('[name="balootThemScore"]').value = '';
  sessionMessage.textContent = '';
  renderBalootCalculator();
}

function changeBalootDealerDirection() {
  const currentIndex = balootDealerDirections.indexOf(state.balootDealerDirection);
  const nextIndex = (currentIndex + 1) % balootDealerDirections.length;
  state.balootDealerDirection = balootDealerDirections[nextIndex];
  renderBalootCalculator();
}

function renderBalootCalculator() {
  const usTotal = getBalootUsTotalFromScores(state.balootScores);
  const themTotal = getBalootThemTotalFromScores(state.balootScores);
  const usName = getBalootUsName();
  const themName = getBalootThemName();
  const scoreList = document.querySelector('#baloot-score-list');

  setText('#baloot-us-label', usName);
  setText('#baloot-them-label', themName);
  setText('#baloot-us-total', usTotal);
  setText('#baloot-them-total', themTotal);
  setText('#baloot-winner', getBalootWinner(usTotal, themTotal));
  setText('#baloot-dealer-direction', state.balootDealerDirection);
  setText('#baloot-share-result', getBalootShareText(state.balootScores, usTotal, themTotal));

  if (!scoreList) {
    return;
  }

  if (state.balootScores.length === 0) {
    scoreList.innerHTML = `<div class="empty-state">${balootText('noScores')}</div>`;
    return;
  }

  scoreList.innerHTML = state.balootScores
    .map(
      (score, index) => `
        <div class="baloot-score-row">
          <span>${balootText('hand')} ${index + 1}: ${escapeHtml(usName)} ${escapeHtml(score.us)} - ${escapeHtml(themName)} ${escapeHtml(score.them)}</span>
          <button class="icon-button" type="button" data-delete-baloot-score="${score.id}">X</button>
        </div>
      `
    )
    .join('');

  scoreList.querySelectorAll('[data-delete-baloot-score]').forEach((button) => {
    button.addEventListener('click', () => deleteBalootScore(Number(button.dataset.deleteBalootScore)));
  });
}

function selectField(label, name, options) {
  const displayLabel = localizedFieldLabel(label);
  return `
    <label>
      ${displayLabel}
      <select name="${name}">
        ${options.map((option) => `<option>${option}</option>`).join('')}
      </select>
    </label>
  `;
}

function textAreaField(label, name, placeholder, full = false) {
  const displayLabel = localizedFieldLabel(label);
  return `
    <label class="${full ? 'full' : ''}">
      ${displayLabel}
      <textarea name="${name}" placeholder="${state.language === 'ar' ? displayLabel : placeholder}"></textarea>
    </label>
  `;
}

function horseFeedEntryFields(index) {
  return `
    <div class="horse-feed-entry" data-horse-feed-entry>
      <strong>${horseText('feedSection')} ${index + 1}</strong>
      ${inputField(horseText('feedAmount'), `feedAmount${index}`, '2 kg')}
      ${inputField(horseText('feedBuyingDate'), `feedBuyingDate${index}`, '06/07/2026')}
    </div>
  `;
}

function horseCleaningSupplyEntryFields(index) {
  return `
    <div class="horse-feed-entry" data-horse-cleaning-supply-entry>
      <div class="horse-entry-heading">
        <strong>${horseText('additionalSupply')} ${index + 1}</strong>
        <button class="icon-button" type="button" data-remove-cleaning-supply="${index}" aria-label="${horseText('removeSupply')}">−</button>
      </div>
      ${inputField(horseText('supplyName'), `cleaningSupplyName${index}`, horseText('supplyName'))}
      ${inputField(horseText('feedBuyingDate'), `cleaningSupplyBuyingDate${index}`, '06/07/2026')}
    </div>
  `;
}

function horseText(key) {
  const labels = {
    en: {
      logType: 'Horse activity',
      logHorseRiding: 'Horse Riding',
      logDailyCare: 'Daily Care',
      logSupplies: 'Cleaning Supplies, Monthly Feed and Farrier',
      logRidingTest: 'Riding Test',
      farrierSection: 'Farrier and Care Supplies',
      monthlyFeedSection: 'Monthly Feed',
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
      performanceSection: 'Gait Tracking and Ride Metrics',
      walkMinutes: 'Walk minutes',
      trotMinutes: 'Trot minutes',
      canterMinutes: 'Canter minutes',
      rideMetricsSection: 'Ride Metrics',
      rideDistance: 'Ride distance',
      averageSpeed: 'Average speed',
      leftTurns: 'Left turns',
      rightTurns: 'Right turns',
      calendarSafetySection: 'Calendar and Safety',
      rideDate: 'Ride date',
      calendarNote: 'Calendar note',
      calendarNotePlaceholder: 'Farrier visit next week',
      farrierVisit: 'Farrier visit date',
      nextFarrierVisit: 'Next farrier visit',
      safetyLocation: 'Safety location',
      safetyLocationPlaceholder: 'Riyadh stable',
      safetyContact: 'Safety contact',
      safetyContactPlaceholder: 'Emergency contact',
      dailyCareSection: 'Daily Care',
      hayGiven: 'Hay Given',
      waterChecked: 'Water Checked',
      foodOilGiven: 'Food Oil Given',
      foodOilBuyingDate: 'Food oil buying date',
      hoofOilUsed: 'Hoof Oil Used',
      hoofOilBuyingDate: 'Hoof oil buying date',
      cleaningSection: 'Cleaning Supplies',
      additionalCleaningSupplies: 'Optional Cleaning Supplies',
      addCleaningSupply: 'Add cleaning supply',
      additionalSupply: 'Additional supply',
      removeSupply: 'Remove supply',
      supplyName: 'Supply name',
      shampooUsed: 'Shampoo Used',
      shampooBuyingDate: 'Shampoo buying date',
      padsCleaningSuppliesUsed: 'Pads Cleaning Supplies Used',
      padsCleaningSuppliesBuyingDate: 'Pads cleaning supplies buying date',
      padsDatePlaceholder: 'Pads cleaning supplies buying date',
      feedSection: 'Feed',
      feedAmount: 'Feed amount',
      feedBuyingDate: 'Buying date',
      addFeed: 'Add another feed',
      dressageSection: 'Dressage Test',
      ridingInfoSection: 'Riding Info',
      testSection: 'Test',
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
      logType: 'نشاط الخيل',
      logHorseRiding: 'ركوب الخيل',
      logDailyCare: 'العناية اليومية',
      logSupplies: 'مستلزمات التنظيف والعلف الشهري والبيطار',
      logRidingTest: 'اختبار الركوب',
      farrierSection: 'البيطار ومستلزمات العناية',
      monthlyFeedSection: 'العلف الشهري',
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
      performanceSection: 'تتبع المشيات ومقاييس الركوب',
      walkMinutes: 'دقائق المشي',
      trotMinutes: 'دقائق التروت',
      canterMinutes: 'دقائق الكانتر',
      rideMetricsSection: 'مقاييس الركوب',
      rideDistance: 'مسافة الركوب',
      averageSpeed: 'متوسط السرعة',
      leftTurns: 'اللفات يسار',
      rightTurns: 'اللفات يمين',
      calendarSafetySection: 'التقويم والسلامة',
      rideDate: 'تاريخ الركوب',
      calendarNote: 'ملاحظة التقويم',
      calendarNotePlaceholder: 'زيارة البيطار الأسبوع القادم',
      farrierVisit: 'تاريخ زيارة البيطار',
      nextFarrierVisit: 'زيارة البيطار القادمة',
      safetyLocation: 'موقع السلامة',
      safetyLocationPlaceholder: 'إسطبل الرياض',
      safetyContact: 'جهة اتصال السلامة',
      safetyContactPlaceholder: 'رقم الطوارئ',
      dailyCareSection: 'العناية اليومية',
      hayGiven: 'تم إعطاء التبن',
      waterChecked: 'تم فحص الماء',
      foodOilGiven: 'تم إعطاء زيت الطعام',
      foodOilBuyingDate: 'تاريخ شراء زيت الطعام',
      hoofOilUsed: 'تم استخدام زيت الحافر',
      hoofOilBuyingDate: 'تاريخ شراء زيت الحافر',
      cleaningSection: 'مستلزمات التنظيف',
      additionalCleaningSupplies: 'مستلزمات تنظيف اختيارية',
      addCleaningSupply: 'إضافة مستلزم تنظيف',
      additionalSupply: 'مستلزم إضافي',
      removeSupply: 'حذف المستلزم',
      supplyName: 'اسم المستلزم',
      shampooUsed: 'تم استخدام الشامبو',
      shampooBuyingDate: 'تاريخ شراء الشامبو',
      padsCleaningSuppliesUsed: 'تم استخدام الباد ومستلزمات التنظيف',
      padsCleaningSuppliesBuyingDate: 'تاريخ شراء الباد ومستلزمات التنظيف',
      padsDatePlaceholder: 'تاريخ شراء الباد ومستلزمات التنظيف',
      feedSection: 'الأعلاف',
      feedAmount: 'كمية العلف',
      feedBuyingDate: 'تاريخ الشراء',
      addFeed: 'إضافة علف آخر',
      dressageSection: 'اختبار الدريساج',
      ridingInfoSection: 'معلومات الركوب',
      testSection: 'الاختبار',
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

async function saveSession(event) {
  event.preventDefault();

  const activity = state.selectedActivity;
  const isNonTimed = isSelectedActivityNonTimed(activity);

  if (!activity) {
    return;
  }

  if ((activity === 'Studying' || activity === 'Work') && state.studyCandleAutoSaved) {
    sessionMessage.textContent = 'This candle session is already saved.';
    return;
  }

  if (!isNonTimed && !state.startTime) {
    sessionMessage.textContent = 'Start the timer before saving.';
    return;
  }

  if (!isNonTimed && !state.endTime) {
    state.endTime = new Date();
    stopTimer();
  }

  if (activity === 'Gym' && !sessionForm.querySelector('[name="gymWorkoutDay"]').value) {
    sessionMessage.textContent = gymText('chooseWorkoutDay');
    return;
  }

  if (activity === 'Work' && !sessionForm.querySelector('[name="projectName"]').value.trim()) {
    sessionMessage.textContent = workText('projectRequired');
    return;
  }

  const details = getSessionDetails();
  const durationSeconds = isNonTimed ? 0 : Math.floor((state.endTime - state.startTime) / 1000);
  const now = new Date();

  const session = {
    id: Date.now(),
    activity,
    date: now.toISOString(),
    start: isNonTimed ? '' : state.startTime.toISOString(),
    end: isNonTimed ? '' : state.endTime.toISOString(),
    duration: isNonTimed ? '' : formatDuration(durationSeconds),
    durationSeconds,
    details,
  };

  state.sessions = [session, ...state.sessions];
  writeJson(accountStorageKey(storageKeys.sessions), state.sessions);
  state.draft = null;
  localStorage.removeItem(accountStorageKey(storageKeys.draft));
  if (activity === 'Studying' || activity === 'Work') {
    pauseStudyCandle();
  }

  try {
    state.syncStatus = 'syncing';
    await saveSessionToCloud(session);
    state.syncStatus = 'saved';
    sessionMessage.textContent = 'Saved securely to your account.';
  } catch {
    state.syncStatus = 'offline';
    sessionMessage.textContent = 'Saved on this device. Cloud sync will retry after you reconnect.';
  }
  renderHome();
  renderHistory();
}

function getSessionDetails() {
  if (state.selectedActivity === 'Personal Info') {
    const expirationReminders = getExpirationReminders();
    return {
      personalInfo: {
        idNumberEnding: getSensitiveEnding(sessionForm.querySelector('[name="personalIdNumber"]')?.value),
        idExpirationDate: sessionForm.querySelector('[name="personalIdExpirationDate"]')?.value || '',
        drivingLicenseExpirationDate: sessionForm.querySelector('[name="personalDlExpirationDate"]')?.value || '',
        passportNumberEnding: getSensitiveEnding(sessionForm.querySelector('[name="personalPassportNumber"]')?.value),
        passportExpirationDate: sessionForm.querySelector('[name="personalPassportExpirationDate"]')?.value || '',
      },
      ...(expirationReminders.length > 0 ? { expirationReminders } : {}),
    };
  }

  if (state.customActivities.includes(state.selectedActivity)) {
    return {
      customFields: getCustomTemplateFields(state.selectedActivity).map((label, index) => ({
        label,
        value: sessionForm.querySelector(`[name="customField${index}"]`)?.value.trim() || '',
      })),
      customUsesTimer: state.customActivityUsesTimer,
      reminder: getReminderDetails(),
    };
  }

  if (state.selectedActivity === 'Studying') {
    return {
      studying: {
        subject: sessionForm.querySelector('[name="subject"]').value.trim(),
        studyType: sessionForm.querySelector('[name="studyType"]').value.trim(),
        examDate: sessionForm.querySelector('[name="examDate"]').value.trim(),
        coursework: sessionForm.querySelector('[name="coursework"]').value.trim(),
        streak: sessionForm.querySelector('[name="streak"]').value.trim(),
        totalStudyHours: sessionForm.querySelector('[name="totalStudyHours"]').value.trim(),
        candleSeconds: state.studyCandleSeconds,
        candleTime: formatStudyCandleElapsedTime(),
        notes: sessionForm.querySelector('[name="notes"]').value.trim(),
      },
      reminder: getReminderDetails(),
    };
  }

  if (state.selectedActivity === 'Work') {
    return {
      work: {
        projectName: sessionForm.querySelector('[name="projectName"]').value.trim(),
        candleSeconds: state.studyCandleSeconds,
        candleTime: formatStudyCandleElapsedTime(),
        candleTargetSeconds: state.studyCandleDurationSeconds,
        candleTargetTime: formatDuration(state.studyCandleDurationSeconds),
        notes: sessionForm.querySelector('[name="notes"]').value.trim(),
      },
    };
  }

  if (state.selectedActivity === 'Gym') {
    const workoutDay = sessionForm.querySelector('[name="gymWorkoutDay"]').value;
    const customWorkout = sessionForm.querySelector('[name="gymCustomWorkout"]').value.trim();
    const exerciseName = sessionForm.querySelector('[name="gymExerciseName"]').value.trim();
    const gymExercises =
      exerciseName !== '' && state.currentGymSets.length > 0
        ? [
            ...state.gymExercises,
            {
              id: Date.now(),
              name: exerciseName,
              sets: state.currentGymSets,
            },
          ]
        : state.gymExercises;

    return {
      gymWorkoutDay: workoutDay,
      gymCustomWorkout: customWorkout,
      gymExercises,
      reminder: getReminderDetails(),
    };
  }

  if (state.selectedActivity === 'Baloot') {
    const cleanUsScore = sessionForm.querySelector('[name="balootUsScore"]').value.trim();
    const cleanThemScore = sessionForm.querySelector('[name="balootThemScore"]').value.trim();
    const usName = getBalootUsName();
    const themName = getBalootThemName();
    const balootScores =
      cleanUsScore !== '' && cleanThemScore !== ''
        ? [
            ...state.balootScores,
            {
              id: Date.now(),
              us: cleanUsScore,
              them: cleanThemScore,
            },
          ]
        : state.balootScores;
    const usTotal = getBalootUsTotalFromScores(balootScores);
    const themTotal = getBalootThemTotalFromScores(balootScores);

    return {
      balootScores,
      balootUsName: usName,
      balootThemName: themName,
      balootUsTotal: usTotal,
      balootThemTotal: themTotal,
      balootWinner: getBalootWinner(usTotal, themTotal),
      balootDealerDirection: state.balootDealerDirection,
      balootShareText: getBalootShareText(balootScores, usTotal, themTotal),
    };
  }

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

  if (horseActivities.includes(state.selectedActivity)) {
    details.horseLogType = state.selectedActivity;

    details.feedEntries = Array.from(
      sessionForm.querySelectorAll('[data-horse-feed-entry]')
    )
      .map((entry, index) => ({
        amount: entry.querySelector(`[name="feedAmount${index}"]`)?.value.trim() || '',
        buyingDate: entry.querySelector(`[name="feedBuyingDate${index}"]`)?.value.trim() || '',
      }))
      .filter((feed) => feed.amount || feed.buyingDate);

    details.customCleaningSupplies = Array.from(
      sessionForm.querySelectorAll('[data-horse-cleaning-supply-entry]')
    )
      .map((entry, index) => ({
        name: entry.querySelector(`[name="cleaningSupplyName${index}"]`)?.value.trim() || '',
        buyingDate: entry.querySelector(`[name="cleaningSupplyBuyingDate${index}"]`)?.value.trim() || '',
      }))
      .filter((supply) => supply.name || supply.buyingDate);

    Object.keys(details).forEach((key) => {
      if (/^(?:feed(?:Amount|BuyingDate)|cleaningSupply(?:Name|BuyingDate))\d+$/.test(key)) {
        delete details[key];
      }
    });
  }

  if (supportsReminders(state.selectedActivity)) {
    details.reminder = getReminderDetails();
    delete details.reminderDate;
    delete details.reminderTime;
    delete details.reminderNote;
  }

  const expirationReminders = getExpirationReminders();
  if (expirationReminders.length > 0) {
    details.expirationReminders = expirationReminders;
  }
  delete details.expirationReminderLeadDays;

  if (movementActivities.includes(state.selectedActivity)) {
    const durationSeconds = state.startTime && state.endTime
      ? Math.floor((state.endTime - state.startTime) / 1000)
      : 0;

    details.totalDistance = getMovementTotalDistance();
    details.averagePace = getMovementAveragePace(durationSeconds);
    details.averageSpeed = getMovementAverageSpeed(durationSeconds);
  }

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

  const query = historySearch.value.trim().toLowerCase();
  const rangeDays = historyDateRange.value === 'week' ? 7 : historyDateRange.value === 'month' ? 30 : null;
  const rangeStart = rangeDays ? Date.now() - rangeDays * 24 * 60 * 60 * 1000 : null;
  const filteredSessions = state.sessions.filter((session) => {
    if (historyFilter.value !== 'All' && session.activity !== historyFilter.value) return false;
    const sessionTime = new Date(session.date).getTime();
    if (rangeStart && (!Number.isFinite(sessionTime) || sessionTime < rangeStart)) return false;
    if (!query) return true;
    return `${session.activity} ${session.date} ${JSON.stringify(session.details || {})}`.toLowerCase().includes(query);
  });

  renderProgressDashboard();

  if (filteredSessions.length === 0) {
    historyList.innerHTML = `<div class="empty-state">${text('noSessions')}</div>`;
    return;
  }

  if (historyViewMode.value === 'calendar') {
    const grouped = new Map();
    filteredSessions.forEach((session) => {
      const parsed = new Date(session.date);
      const day = Number.isNaN(parsed.getTime()) ? session.date : parsed.toISOString().slice(0, 10);
      grouped.set(day, [...(grouped.get(day) || []), session]);
    });
    historyList.innerHTML = [...grouped.entries()]
      .sort(([first], [second]) => second.localeCompare(first))
      .map(([day, daySessions]) => `
        <article class="calendar-day">
          <header><strong>${escapeHtml(day)}</strong><span>${daySessions.length} ${state.language === 'ar' ? 'سجل' : 'records'}</span></header>
          <p>${escapeHtml([...new Set(daySessions.map((session) => activityLabel(session.activity)))].join(' • '))}</p>
        </article>`)
      .join('');
    return;
  }

  historyList.innerHTML = filteredSessions
    .map((session) => {
      const details = renderSessionDetails(session);

      return `
        <article class="history-card">
          <header>
            <div>
              <h3>${activityLabel(session.activity)}</h3>
              <span>${formatDate(session.date)}</span>
            </div>
            <div class="history-card-actions">
              <button class="button secondary" type="button" data-duplicate-session="${session.id}">${state.language === 'ar' ? 'تكرار' : 'Duplicate'}</button>
              <button class="button secondary" type="button" data-edit-session="${session.id}">${state.language === 'ar' ? 'تعديل' : 'Edit'}</button>
              <button class="button danger" type="button" data-delete-session="${session.id}">${text('delete')}</button>
            </div>
          </header>
          ${
            isSessionNonTimed(session)
              ? `<p>${session.activity === 'Personal Info' ? text('personalRecord') : text('maintenanceRecord')}</p>`
              : `<p>${formatTime(session.start)} to ${formatTime(session.end)} - ${session.duration}</p>`
          }
          <div class="history-details">
            ${details || `<div><span>${text('details')}</span>${text('noDetails')}</div>`}
            ${renderReminderDetails(session)}
            ${renderExpirationReminderDetails(session)}
            ${renderHistoryNote(session)}
          </div>
        </article>
      `;
    })
    .join('');
}

async function duplicateHistorySession(sessionId) {
  const source = state.sessions.find((session) => String(session.id) === String(sessionId));
  if (!source) return;
  const now = new Date().toISOString();
  const duplicated = {
    ...source,
    id: Date.now(),
    date: now,
    start: source.start ? now : '',
    end: source.end ? now : '',
    details: JSON.parse(JSON.stringify(source.details || {})),
  };
  state.sessions = [duplicated, ...state.sessions];
  writeJson(accountStorageKey(storageKeys.sessions), state.sessions);
  state.syncStatus = 'syncing';
  try {
    await saveSessionToCloud(duplicated);
    state.syncStatus = 'saved';
  } catch {
    state.syncStatus = 'offline';
  }
  renderHome();
  renderHistory();
}

function renderHistoryNote(session) {
  const note = session.details?.historyNote;

  if (!note) {
    return '';
  }

  return `<div><span>${state.language === 'ar' ? 'ملاحظة السجل' : 'History note'}</span>${escapeHtml(note)}</div>`;
}

const calculatedEditFieldKeys = new Set([
  'historyNote',
  'expirationReminders',
  'candleSeconds',
  'candleTime',
  'candleTargetSeconds',
  'candleTargetTime',
  'balootShareText',
  'totalDistance',
  'averagePace',
  'averageSpeed',
]);

function collectEditableSessionFields(value, path = []) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([key, fieldValue]) => {
    if (calculatedEditFieldKeys.has(key) || Array.isArray(fieldValue)) {
      return [];
    }

    const nextPath = [...path, key];

    if (typeof fieldValue === 'string' || typeof fieldValue === 'number') {
      const rawLabel = labelFromKey(key);
      return [{
        path: nextPath.join('.'),
        label: state.language === 'ar' ? localizedFieldLabel(rawLabel) : rawLabel,
        type: typeof fieldValue,
        value: String(fieldValue),
      }];
    }

    return collectEditableSessionFields(fieldValue, nextPath);
  });
}

function setNestedSessionField(target, path, value, type) {
  const keys = path.split('.');
  const finalKey = keys.pop();
  const parent = keys.reduce((current, key) => {
    current[key] = current[key] && typeof current[key] === 'object' ? current[key] : {};
    return current[key];
  }, target);

  parent[finalKey] = type === 'number' ? Number(value || 0) : value;
}

function refreshEditedExpirationReminders(session) {
  const existing = session.details?.expirationReminders;

  if (!Array.isArray(existing) || existing.length === 0) {
    return;
  }

  const daysBefore = Number(existing[0]?.daysBefore || 0);
  const fields = session.activity === 'Personal Info'
    ? [
        ['ID expiration', session.details?.personalInfo?.idExpirationDate],
        ['Driving license expiration', session.details?.personalInfo?.drivingLicenseExpirationDate],
        ['Passport expiration', session.details?.personalInfo?.passportExpirationDate],
      ]
    : session.activity === 'Vehicle Maintenance'
      ? [
          ['Insurance expiration', session.details?.insuranceExpirationDate],
          ['Registration expiration', session.details?.registrationEndDate],
        ]
      : [];

  session.details.expirationReminders = fields.flatMap(([label, expirationDate]) => {
    const remindOn = calculateExpirationReminderDate(expirationDate || '', daysBefore);
    return expirationDate && remindOn
      ? [{ label, expirationDate, remindOn, daysBefore }]
      : [];
  });
}

function closeEditSessionModal() {
  state.editingSessionId = null;
  state.editableSessionFields = [];
  editSessionModal.classList.add('hidden');
}

function editHistorySession(sessionId) {
  const session = state.sessions.find((item) => String(item.id) === String(sessionId));

  if (!session) {
    return;
  }

  state.editingSessionId = session.id;
  state.editableSessionFields = collectEditableSessionFields(session.details || {});
  const labels = state.language === 'ar'
    ? { title: 'تعديل البيانات المحفوظة', date: 'تاريخ الجلسة', note: 'ملاحظة السجل', cancel: 'إلغاء', save: 'حفظ التعديلات' }
    : { title: 'Edit saved details', date: 'Session date', note: 'History note', cancel: 'Cancel', save: 'Save changes' };

  document.querySelector('#edit-session-title').textContent = labels.title;
  editSessionCancel.textContent = labels.cancel;
  document.querySelector('#edit-session-save').textContent = labels.save;
  editSessionFields.innerHTML = `
    <label class="full">${labels.date}<input name="sessionDate" value="${escapeHtml(session.date || '')}"></label>
    ${state.editableSessionFields.map((field) => `
      <label>${escapeHtml(field.label)}
        <input data-edit-path="${escapeHtml(field.path)}" data-edit-type="${field.type}" type="${field.type === 'number' ? 'number' : 'text'}" value="${escapeHtml(field.value)}">
      </label>
    `).join('')}
    <label class="full">${labels.note}<textarea name="historyNote">${escapeHtml(session.details?.historyNote || '')}</textarea></label>
  `;
  editSessionModal.classList.remove('hidden');
}

function getRecentSessions(days) {
  const now = Date.now();
  const rangeMilliseconds = days * 24 * 60 * 60 * 1000;

  return state.sessions.filter((session) => {
    const sessionTime = new Date(session.date).getTime();
    return Number.isFinite(sessionTime) && now - sessionTime >= 0 && now - sessionTime <= rangeMilliseconds;
  });
}

function formatProgressTime(sessions) {
  const totalMinutes = Math.round(
    sessions.reduce((total, session) => total + Number(session.durationSeconds || 0), 0) / 60
  );

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
}

function renderProgressDashboard() {
  if (!progressDashboard) {
    return;
  }

  const weeklySessions = getRecentSessions(7);
  const monthlySessions = getRecentSessions(30);
  const activityCounts = monthlySessions.reduce((counts, session) => {
    counts[session.activity] = (counts[session.activity] || 0) + 1;
    return counts;
  }, {});
  const sortedActivities = Object.entries(activityCounts).sort(([, first], [, second]) => second - first);
  const highestCount = sortedActivities[0]?.[1] || 1;
  const labels = state.language === 'ar'
    ? {
        title: 'التقدم', weekly: 'آخر 7 أيام', monthly: 'آخر 30 يوماً', sessions: 'جلسات',
        breakdown: 'توزيع النشاط خلال 30 يوماً', empty: 'لا يوجد نشاط خلال آخر 30 يوماً',
      }
    : {
        title: 'Progress', weekly: 'Last 7 days', monthly: 'Last 30 days', sessions: 'sessions',
        breakdown: 'Activity breakdown (30 days)', empty: 'No activity in the last 30 days.',
      };

  progressDashboard.innerHTML = `
    <h2>${labels.title}</h2>
    <div class="progress-summary">
      <article>
        <span>${labels.weekly}</span>
        <strong>${weeklySessions.length} ${labels.sessions}</strong>
        <small>${formatProgressTime(weeklySessions)}</small>
      </article>
      <article>
        <span>${labels.monthly}</span>
        <strong>${monthlySessions.length} ${labels.sessions}</strong>
        <small>${formatProgressTime(monthlySessions)}</small>
      </article>
    </div>
    <h3>${labels.breakdown}</h3>
    <div class="progress-bars">
      ${
        sortedActivities.length
          ? sortedActivities
              .map(
                ([activity, count]) => `
                  <div class="progress-row">
                    <div><span>${escapeHtml(activityLabel(activity))}</span><small>${count}</small></div>
                    <div class="progress-track"><span style="width: ${Math.max(8, Math.round((count / highestCount) * 100))}%"></span></div>
                  </div>
                `
              )
              .join('')
          : `<p>${labels.empty}</p>`
      }
    </div>
  `;
}

function renderReminderDetails(session) {
  const reminder = session.details?.reminder;

  if (!reminder) {
    return '';
  }

  const labels = state.language === 'ar'
    ? { date: 'تاريخ التذكير', time: 'وقت التذكير', note: 'ملاحظة التذكير' }
    : { date: 'Reminder date', time: 'Reminder time', note: 'Reminder note' };

  return `
    <div><span>${labels.date}</span>${escapeHtml(reminder.date || text('noDetails'))}</div>
    <div><span>${labels.time}</span>${escapeHtml(reminder.time || text('noDetails'))}</div>
    <div><span>${labels.note}</span>${escapeHtml(reminder.note || text('noDetails'))}</div>
  `;
}

function renderExpirationReminderDetails(session) {
  const reminders = session.details?.expirationReminders;

  if (!Array.isArray(reminders) || reminders.length === 0) {
    return '';
  }

  const labels = state.language === 'ar'
    ? { expires: 'ينتهي في', remindOn: 'التذكير في', days: 'يوم قبل الانتهاء' }
    : { expires: 'Expires', remindOn: 'Remind on', days: 'days before expiration' };

  return reminders
    .map(
      (reminder) => `
        <div><span>${escapeHtml(reminder.label)}</span>${labels.expires}: ${escapeHtml(reminder.expirationDate)}</div>
        <div><span>${labels.remindOn}</span>${escapeHtml(reminder.remindOn)} (${escapeHtml(reminder.daysBefore)} ${labels.days})</div>
      `
    )
    .join('');
}

function renderSessionDetails(session) {
  if (session.activity === 'Personal Info' && session.details?.personalInfo) {
    const personalInfo = session.details.personalInfo;
    const labels = state.language === 'ar'
      ? {
          idNumber: 'رقم الهوية ينتهي بـ', idExpiration: 'انتهاء الهوية',
          dlExpiration: 'انتهاء رخصة القيادة', passportNumber: 'رقم الجواز ينتهي بـ',
          passportExpiration: 'انتهاء الجواز',
        }
      : {
          idNumber: 'ID number ending', idExpiration: 'ID expiration',
          dlExpiration: 'Driving license expiration', passportNumber: 'Passport ending',
          passportExpiration: 'Passport expiration',
        };

    return `
      <div><span>${labels.idNumber}</span>${personalInfo.idNumberEnding ? `•••• ${escapeHtml(personalInfo.idNumberEnding)}` : text('noDetails')}</div>
      <div><span>${labels.idExpiration}</span>${escapeHtml(personalInfo.idExpirationDate || text('noDetails'))}</div>
      <div><span>${labels.dlExpiration}</span>${escapeHtml(personalInfo.drivingLicenseExpirationDate || text('noDetails'))}</div>
      <div><span>${labels.passportNumber}</span>${personalInfo.passportNumberEnding ? `•••• ${escapeHtml(personalInfo.passportNumberEnding)}` : text('noDetails')}</div>
      <div><span>${labels.passportExpiration}</span>${escapeHtml(personalInfo.passportExpirationDate || text('noDetails'))}</div>
    `;
  }

  if (Array.isArray(session.details?.customFields)) {
    const timerLabel = state.language === 'ar' ? 'المؤقت' : 'Timer';
    const timerValue = session.details.customUsesTimer
      ? state.language === 'ar' ? 'مستخدم' : 'Used'
      : state.language === 'ar' ? 'غير مستخدم' : 'Not used';
    return `<div><span>${timerLabel}</span>${timerValue}</div>` + session.details.customFields
      .map(
        (field) =>
          `<div><span>${escapeHtml(field.label)}</span>${escapeHtml(field.value || text('noDetails'))}</div>`
      )
      .join('');
  }

  if (session.activity === 'Studying' && session.details?.studying) {
    const study = session.details.studying;

    return `
      <div><span>${studyText('subject')}</span>${escapeHtml(study.subject || text('noDetails'))}</div>
      <div><span>${studyText('studyType')}</span>${escapeHtml(study.studyType || text('noDetails'))}</div>
      <div><span>${studyText('examDate')}</span>${escapeHtml(study.examDate || text('noDetails'))}</div>
      <div><span>${studyText('coursework')}</span>${escapeHtml(study.coursework || text('noDetails'))}</div>
      <div><span>${studyText('streak')}</span>${escapeHtml(study.streak || text('noDetails'))}</div>
      <div><span>${studyText('totalStudyHours')}</span>${escapeHtml(study.totalStudyHours || text('noDetails'))}</div>
      <div><span>${studyText('candleTimer')}</span>${escapeHtml(study.candleTime || '00:00:00')}</div>
      <div><span>${studyText('notes')}</span>${escapeHtml(study.notes || text('noDetails'))}</div>
    `;
  }

  if (session.activity === 'Work' && session.details?.work) {
    const work = session.details.work;

    return `
      <div><span>${workText('projectName')}</span>${escapeHtml(work.projectName || text('noDetails'))}</div>
      <div><span>${state.language === 'ar' ? 'الوقت المحدد' : 'Set time'}</span>${escapeHtml(work.candleTargetTime || text('noDetails'))}</div>
      <div><span>${studyText('candleTimer')}</span>${escapeHtml(work.candleTime || '00:00:00')}</div>
      <div><span>${workText('notes')}</span>${escapeHtml(work.notes || text('noDetails'))}</div>
    `;
  }

  if (session.activity === 'Gym' && session.details) {
    const exercises = Array.isArray(session.details.gymExercises) ? session.details.gymExercises : [];
    const exerciseDetails = exercises.length
      ? exercises
          .map(
            (exercise, index) => `
              <div>
                <span>${index + 1}. ${escapeHtml(exercise.name)}</span>
                ${exercise.sets
                  .map((set, setIndex) => `${gymText('set')} ${setIndex + 1}: ${set.weight ? `${escapeHtml(set.weight)} kg, ` : ''}${escapeHtml(set.reps)} ${gymText('reps')}`)
                  .join('<br>')}
              </div>
            `
          )
          .join('')
      : `<div><span>${gymText('exercises')}</span>${gymText('noExercises')}</div>`;

    return `
      <div><span>${gymText('workoutDay')}</span>${session.details.gymWorkoutDay || text('noDetails')}</div>
      ${session.details.gymCustomWorkout ? `<div><span>${gymText('customWorkout')}</span>${escapeHtml(session.details.gymCustomWorkout)}</div>` : ''}
      ${exerciseDetails}
    `;
  }

  if (session.activity === 'Baloot' && session.details) {
    const scores = Array.isArray(session.details.balootScores) ? session.details.balootScores : [];
    const usName = session.details.balootUsName || balootText('us');
    const themName = session.details.balootThemName || balootText('them');
    const handDetails = scores.length
      ? scores
          .map(
            (score, index) =>
              `<div><span>${balootText('hand')} ${index + 1}</span>${escapeHtml(usName)} ${escapeHtml(score.us)} - ${escapeHtml(themName)} ${escapeHtml(score.them)}</div>`
          )
          .join('')
      : `<div><span>${balootText('scoreHistory')}</span>${balootText('noScores')}</div>`;

    return `
      <div><span>${escapeHtml(usName)}</span>${session.details.balootUsTotal || 0}</div>
      <div><span>${escapeHtml(themName)}</span>${session.details.balootThemTotal || 0}</div>
      <div><span>${balootText('winner')}</span>${session.details.balootWinner || balootText('notFinished')}</div>
      <div><span>${balootText('dealerDirection')}</span>${session.details.balootDealerDirection || '↑'}</div>
      <div><span>${balootText('shareResult')}</span>${escapeHtml(session.details.balootShareText || '')}</div>
      ${handDetails}
    `;
  }

  return Object.entries(session.details || {})
    .filter(([, value]) => String(value).trim() !== '')
    .map(([key, value]) => `<div><span>${labelFromKey(key)}</span>${formatDetailValue(value)}</div>`)
    .join('');
}

function formatDetailValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (typeof item === 'object' && item !== null) {
          return `${index + 1}. ${Object.values(item).join(' - ')}`;
        }

        return String(item);
      })
      .join('<br>');
  }

  if (typeof value === 'object' && value !== null) {
    return Object.entries(value)
      .map(([key, itemValue]) => `${labelFromKey(key)}: ${itemValue}`)
      .join('<br>');
  }

  return value;
}

function labelFromKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase());
}

async function clearHistory() {
  if (state.sessions.length === 0) {
    return;
  }

  if (cloudClient && state.userId) {
    const { error } = await cloudClient
      .from('activity_sessions')
      .delete()
      .eq('user_id', state.userId);

    if (error) {
      sessionMessage.textContent = 'Cloud deletion failed. History was not cleared; please try again.';
      return;
    }
  }

  state.sessions = [];
  writeJson(accountStorageKey(storageKeys.sessions), state.sessions);

  renderHome();
  renderHistory();
}

function exportHistory() {
  const user = readJson(storageKeys.user, null);
  const exportData = {
    app: 'Tafasili Web',
    exportedAt: new Date().toISOString(),
    user: user
      ? {
          fullName: user.fullName,
          identifier: user.identifier,
          goal: user.goal,
        }
      : null,
    customActivities: state.customActivities,
    customTemplates: state.customTemplates,
    customGroups: state.customGroups,
    sessions: state.sessions,
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStamp = new Date().toISOString().slice(0, 10);

  link.href = downloadUrl;
  link.download = `tafasili-history-${dateStamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
}

function exportHistoryCsv() {
  const cell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const rows = [
    ['Activity', 'Date', 'Start', 'End', 'Duration', 'Details'],
    ...state.sessions.map((session) => [
      session.activity, session.date, session.start, session.end, session.duration,
      JSON.stringify(session.details || {}),
    ]),
  ];
  const blob = new Blob([rows.map((row) => row.map(cell).join(',')).join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tafasili-history-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelectorAll('[data-auth-mode]').forEach((tab) => {
  tab.addEventListener('click', () => setAuthMode(tab.dataset.authMode));
});

passwordToggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.querySelector(`#${button.dataset.passwordTarget}`);
    if (!target) {
      return;
    }

    const passwordIsVisible = target.type === 'text';
    target.type = passwordIsVisible ? 'password' : 'text';
    button.textContent = passwordIsVisible ? text('showPassword') : text('hidePassword');
    button.setAttribute('aria-label', button.textContent);
  });
});

async function ensurePasswordRecoverySession() {
  const { data: existingData } = await cloudClient.auth.getSession();

  if (existingData.session) {
    return existingData.session;
  }

  const accessToken = passwordRecoveryHashParams.get('access_token');
  const refreshToken = passwordRecoveryHashParams.get('refresh_token');

  if (accessToken && refreshToken) {
    const { data, error } = await cloudClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (!error && data.session) {
      return data.session;
    }
  }

  const authorizationCode = passwordRecoverySearchParams.get('code');

  if (authorizationCode) {
    const { data, error } = await cloudClient.auth.exchangeCodeForSession(authorizationCode);

    if (!error && data.session) {
      return data.session;
    }
  }

  throw new Error(
    state.language === 'ar'
      ? 'انتهت صلاحية رابط إعادة التعيين. اطلب رابطاً جديداً.'
      : 'This reset link has expired. Request a new password reset link.'
  );
}

languageButton.addEventListener('click', () => {
  state.language = state.language === 'en' ? 'ar' : 'en';
  localStorage.setItem(storageKeys.language, state.language);
  applyLanguage();
  refreshOpenTrackerLanguage();
});

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(authForm);
  const identifier = String(formData.get('identifier') || '').trim();
  const password = String(formData.get('password') || '');
  const repeatPassword = String(formData.get('repeatPassword') || '');

  try {
    if (!cloudClient) {
      authMessage.textContent = 'Cloud accounts are temporarily unavailable.';
      return;
    }

    if (state.authMode === 'recovery') {
      if (password.length < 8) {
        authMessage.textContent = 'Use at least 8 characters for your password.';
        return;
      }

      if (password !== repeatPassword) {
        authMessage.textContent = 'Passwords do not match.';
        return;
      }

      await ensurePasswordRecoverySession();
      const { data, error } = await cloudClient.auth.updateUser({ password });

      if (error || !data.user) {
        throw error || new Error('Password update failed.');
      }

      state.passwordRecovery = false;
      window.history.replaceState({}, document.title, window.location.pathname);
      authForm.reset();
      window.alert(state.language === 'ar' ? 'تم تحديث كلمة المرور.' : 'Password updated successfully.');
      await completeCloudSignIn(data.user);
      return;
    }

    const credentials = identifier.includes('@')
      ? { email: identifier, password }
      : { phone: identifier, password };

    if (state.authMode === 'signup') {
      if (password.length < 8) {
        authMessage.textContent = 'Use at least 8 characters for your password.';
        return;
      }

      if (password !== repeatPassword) {
        authMessage.textContent = 'Passwords do not match.';
        return;
      }

      const { data, error } = await cloudClient.auth.signUp(credentials);

      if (error) {
        throw error;
      }

      authForm.reset();

      if (!data.session || !data.user) {
        setAuthMode('signin');
        authMessage.textContent = 'Account created. Check your email to confirm it, then sign in.';
        return;
      }

      await completeCloudSignIn(data.user);
      return;
    }

    const { data, error } = await cloudClient.auth.signInWithPassword(credentials);

    if (error || !data.user) {
      throw error || new Error('Account not found.');
    }

    await completeCloudSignIn(data.user);
    authForm.reset();
  } catch (error) {
    authMessage.textContent = error?.message || 'Security action failed. Try again.';
  }
});

forgotButton.addEventListener('click', async () => {
  const identifier = String(new FormData(authForm).get('identifier') || '').trim();

  if (!identifier.includes('@')) {
    authMessage.textContent = 'Enter your email address first.';
    return;
  }

  const { error } = await cloudClient.auth.resetPasswordForEmail(identifier, {
    redirectTo: `${window.location.origin}${window.location.pathname}`,
  });

  authMessage.textContent = error
    ? error.message
    : 'Password recovery instructions were sent to your email.';
});

passkeyButton.addEventListener('click', () => {
  authMessage.textContent = 'Secure Face ID / passkey login is the next authentication upgrade.';
});
appleSignupButton.addEventListener('click', () => {
  authMessage.textContent =
    state.authMode === 'signup'
      ? 'Apple sign-up can be connected later.'
      : 'Apple login can be connected later.';
});
facebookSignupButton.addEventListener('click', () => {
  authMessage.textContent =
    state.authMode === 'signup'
      ? 'Facebook sign-up can be connected later.'
      : 'Facebook login can be connected later.';
});

logoutButton.addEventListener('click', async () => {
  stopTimer();
  writeJson(accountStorageKey(storageKeys.sessions), state.sessions);
  writeJson(accountStorageKey(storageKeys.customActivities), state.customActivities);
  writeJson(accountStorageKey(storageKeys.customTemplates), state.customTemplates);
  writeJson(accountStorageKey(storageKeys.customGroups), state.customGroups);
  stopHistorySubscription();
  await cloudClient?.auth.signOut();
  state.userId = null;
  state.userEmail = null;
  state.sessions = [];
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

document.addEventListener('click', async (event) => {
  const viewButton = event.target.closest('[data-view]');
  const activityButton = event.target.closest('[data-activity]');
  const categoryButton = event.target.closest('[data-category]');
  const editButton = event.target.closest('[data-edit-session]');
  const duplicateButton = event.target.closest('[data-duplicate-session]');
  const deleteButton = event.target.closest('[data-delete-session]');
  const favoriteButton = event.target.closest('[data-favorite-activity]');
  const deleteCustomActivityButton = event.target.closest('[data-delete-custom-activity]');
  const repeatButton = event.target.closest('[data-repeat-last]');
  const continueDraftButton = event.target.closest('[data-continue-draft]');
  const deleteDraftButton = event.target.closest('[data-delete-draft]');
  const settingsAction = event.target.closest('[data-settings-action]');

  if (viewButton) {
    event.preventDefault();
    showView(viewButton.dataset.view);
  }

  if (activityButton) {
    openTracker(activityButton.dataset.activity);
  }

  if (categoryButton) {
    state.selectedCategory = state.selectedCategory === categoryButton.dataset.category
      ? null
      : categoryButton.dataset.category;
    renderHome();
  }

  if (editButton) {
    void editHistorySession(editButton.dataset.editSession);
  }

  if (duplicateButton) {
    void duplicateHistorySession(duplicateButton.dataset.duplicateSession);
  }

  if (favoriteButton) {
    void toggleFavoriteActivity(favoriteButton.dataset.favoriteActivity);
  }

  if (deleteCustomActivityButton) {
    void deleteCustomActivity(deleteCustomActivityButton.dataset.deleteCustomActivity);
  }

  if (repeatButton && state.sessions[0]) {
    void duplicateHistorySession(state.sessions[0].id);
  }

  if (continueDraftButton && state.draft) {
    void openTracker(state.draft.activity, true);
  }

  if (deleteDraftButton && state.draft) {
    deleteDraft();
  }

  if (settingsAction?.dataset.settingsAction === 'devices') {
    void cloudClient?.auth.signOut({ scope: 'others' }).then(async ({ error }) => {
      if (!error) {
        await cloudClient.from('user_devices').delete().neq('device_id', webDeviceId());
        await registerAndLoadWebDevices();
        renderSettings();
      }
      window.alert(error ? 'Could not sign out other devices.' : 'Other devices were signed out.');
    });
  }

  if (settingsAction?.dataset.settingsAction === 'tutorial') {
    state.onboardingStep = 0;
    renderOnboarding();
    onboardingModal.classList.remove('hidden');
  }

  if (settingsAction?.dataset.settingsAction === 'delete') {
    if (window.confirm(state.language === 'ar' ? 'حذف كل بيانات السجل؟' : 'Delete all history data?')) {
      void clearHistory();
      settingsModal.classList.add('hidden');
    }
  }

  if (deleteButton) {
    const sessionId = deleteButton.dataset.deleteSession;

    if (cloudClient && state.userId) {
      const { error } = await cloudClient
        .from('activity_sessions')
        .delete()
        .eq('user_id', state.userId)
        .eq('id', Number(sessionId));

      if (error) {
        window.alert(state.language === 'ar'
          ? 'تعذر الحذف من السحابة. لم يتم حذف السجل، حاول مرة أخرى.'
          : 'Cloud delete failed. The session was not deleted; please try again.');
        return;
      }
    }

    state.sessions = state.sessions.filter((session) => String(session.id) !== sessionId);
    writeJson(accountStorageKey(storageKeys.sessions), state.sessions);
    renderHome();
    renderHistory();
  }
});

customActivityForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(customActivityForm);
  const customActivity = String(formData.get('customActivity') || '').trim();
  const customCategory = String(formData.get('customCategory') || '').trim();
  const customFields = String(formData.get('customFields') || '')
    .split(',')
    .map((field) => field.trim())
    .filter((field, index, fields) => field && fields.indexOf(field) === index)
    .slice(0, 8);

  if (!customActivity || !customCategory || getActivities().includes(customActivity)) {
    return;
  }

  state.customActivities = [...state.customActivities, customActivity];
  state.customTemplates = {
    ...state.customTemplates,
    [customActivity]: customFields,
  };
  state.customGroups = {
    ...state.customGroups,
    [customActivity]: customCategory,
  };
  writeJson(accountStorageKey(storageKeys.customActivities), state.customActivities);
  writeJson(accountStorageKey(storageKeys.customTemplates), state.customTemplates);
  writeJson(accountStorageKey(storageKeys.customGroups), state.customGroups);

  try {
    await saveCustomActivityToCloud(customActivity);
  } catch {
    window.alert(state.language === 'ar'
      ? 'تم الحفظ على هذا الجهاز، لكن تعذرت مزامنته الآن.'
      : 'Saved on this device, but cloud sync is currently unavailable.');
  }
  state.selectedCategory = customCategory;
  customActivityForm.reset();
  renderHome();
});

startButton.addEventListener('click', startTimer);
endButton.addEventListener('click', endTimer);
sessionForm.addEventListener('submit', saveSession);
historyFilter.addEventListener('change', renderHistory);
clearHistoryButton.addEventListener('click', clearHistory);
exportHistoryButton.addEventListener('click', exportHistory);
exportCsvButton.addEventListener('click', exportHistoryCsv);
printHistoryButton.addEventListener('click', () => window.print());
historySearch.addEventListener('input', renderHistory);
historyDateRange.addEventListener('change', renderHistory);
historyViewMode.addEventListener('change', renderHistory);
settingsButton.addEventListener('click', () => {
  renderSettings();
  settingsModal.classList.remove('hidden');
});
settingsClose.addEventListener('click', () => settingsModal.classList.add('hidden'));
settingsModal.addEventListener('click', (event) => {
  if (event.target === settingsModal) settingsModal.classList.add('hidden');
});
settingsFields.addEventListener('change', async (event) => {
  const field = event.target.closest('[data-setting]');
  if (!field) return;
  const key = field.dataset.setting;
  let value = field.type === 'checkbox' ? field.checked : field.value;
  if (key === 'defaultReminderDays') value = Number(value);
  if (key === 'notificationsEnabled' && value && 'Notification' in window) {
    value = (await Notification.requestPermission()) === 'granted';
    field.checked = value;
  }
  await saveUsabilitySettings({ ...state.settings, [key]: value });
});
onboardingNext.addEventListener('click', () => {
  if (state.onboardingStep < 2) {
    state.onboardingStep += 1;
    renderOnboarding();
  } else {
    void finishOnboarding();
  }
});
onboardingSkip.addEventListener('click', () => void finishOnboarding());
sessionForm.addEventListener('input', () => {
  if (!state.selectedActivity) return;
  const values = {};
  new FormData(sessionForm).forEach((value, key) => { values[key] = String(value); });
  state.draft = { activity: state.selectedActivity, updatedAt: new Date().toISOString(), values };
  writeJson(accountStorageKey(storageKeys.draft), state.draft);
});
editSessionClose.addEventListener('click', closeEditSessionModal);
editSessionCancel.addEventListener('click', closeEditSessionModal);
editSessionModal.addEventListener('click', (event) => {
  if (event.target === editSessionModal) {
    closeEditSessionModal();
  }
});
editSessionForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const session = state.sessions.find((item) => String(item.id) === String(state.editingSessionId));

  if (!session) {
    closeEditSessionModal();
    return;
  }

  const details = JSON.parse(JSON.stringify(session.details || {}));
  editSessionFields.querySelectorAll('[data-edit-path]').forEach((input) => {
    setNestedSessionField(details, input.dataset.editPath, input.value.trim(), input.dataset.editType);
  });
  details.historyNote = editSessionFields.querySelector('[name="historyNote"]')?.value.trim() || '';

  const updatedSession = {
    ...session,
    date: editSessionFields.querySelector('[name="sessionDate"]')?.value.trim() || session.date,
    details,
  };
  refreshEditedExpirationReminders(updatedSession);
  state.sessions = state.sessions.map((item) => String(item.id) === String(updatedSession.id) ? updatedSession : item);
  writeJson(accountStorageKey(storageKeys.sessions), state.sessions);

  try {
    await saveSessionToCloud(updatedSession);
  } catch {
    window.alert(state.language === 'ar'
      ? 'حُفظ التعديل على هذا الجهاز، لكن فشل الحفظ السحابي.'
      : 'Saved on this device, but cloud update failed.');
  }

  closeEditSessionModal();
  renderHome();
  renderHistory();
});
document.addEventListener('visibilitychange', syncStudyCandleWithClock);
window.addEventListener('focus', syncStudyCandleWithClock);
window.addEventListener('pageshow', syncStudyCandleWithClock);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && state.userId) {
    void refreshCloudHistory().catch(() => {});
  }
});
window.addEventListener('focus', () => {
  if (state.userId) void refreshCloudHistory().catch(() => {});
});
window.addEventListener('pageshow', () => {
  if (state.userId) void refreshCloudHistory().catch(() => {});
});

async function initializeCloudAccount() {
  if (!cloudClient) {
    authMessage.textContent = 'Cloud account configuration is unavailable.';
    showView('auth', false);
    return;
  }

  const { data, error } = await cloudClient.auth.getSession();

  if (state.passwordRecovery || window.location.hash.includes('type=recovery')) {
    state.passwordRecovery = true;
    setAuthMode('recovery');
    showView('auth', false);
    try {
      await ensurePasswordRecoverySession();
    } catch (recoveryError) {
      authMessage.textContent = recoveryError?.message || 'Request a new password reset link.';
    }
    return;
  }

  if (error || !data.session?.user) {
    state.userId = null;
    sessionStorage.removeItem(storageKeys.activeSession);
    showView('auth', false);
    return;
  }

  await completeCloudSignIn(data.session.user);
}

cloudClient?.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    state.passwordRecovery = true;
    setAuthMode('recovery');
    showView('auth', false);
  }
});

setAuthMode(passwordRecoveryRequestedAtLoad ? 'recovery' : 'signin');
applyLanguage();
void initializeCloudAccount();
