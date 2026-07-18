const storageKeys = {
  // Keep the original keys so the Tafasili rebrand does not erase saved browser data.
  user: 'activetrack-web-user',
  sessions: 'activetrack-web-sessions',
  customActivities: 'activetrack-web-custom-activities',
  customTemplates: 'activetrack-web-custom-templates',
  activeSession: 'activetrack-web-session-active',
  language: 'activetrack-web-language',
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
    activities: ['Horse Riding'],
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

const translations = {
  en: {
    languageButton: 'العربية',
    back: 'Back',
    logout: 'Logout',
    authEyebrow: 'Personal activity tracking',
    heroTitle: 'Track and save your activity sessions.',
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
    heroTitle: 'تتبع واحفظ جلسات نشاطك.',
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
      currentExercise: 'Current Exercise',
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
      currentExercise: 'التمرين الحالي',
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
  languageButton.textContent = text('languageButton');
  backButton.textContent = text('back');
  logoutButton.textContent = text('logout');
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
  const savedActivities = readJson(storageKeys.customActivities, []);
  const savedTemplates = readJson(storageKeys.customTemplates, {});

  state.sessions = Array.isArray(savedSessions) ? savedSessions : [];
  state.customActivities = Array.isArray(savedActivities) ? savedActivities : [];
  state.customTemplates = savedTemplates && typeof savedTemplates === 'object' ? savedTemplates : {};
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
  const scopedSessions = readJson(scopedKey, []);
  const legacySessions = localStorage.getItem(migrationKey)
    ? []
    : readJson(storageKeys.sessions, []);
  const localSessions = [...scopedSessions, ...legacySessions];

  const { data, error } = await cloudClient
    .from('activity_sessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  if (legacySessions.length > 0) {
    const { error: migrationError } = await cloudClient
      .from('activity_sessions')
      .upsert(
        legacySessions.map((session) => sessionToCloudRow(session, userId)),
        { onConflict: 'user_id,id' }
      );

    if (migrationError) {
      throw migrationError;
    }
  }

  const mergedSessions = new Map();
  localSessions.forEach((session) => mergedSessions.set(String(session.id), session));
  (data || []).forEach((row) => {
    const session = cloudRowToSession(row);
    mergedSessions.set(String(session.id), session);
  });

  state.sessions = [...mergedSessions.values()].sort(
    (first, second) => new Date(second.date) - new Date(first.date)
  );
  writeJson(scopedKey, state.sessions);
  localStorage.setItem(migrationKey, 'true');
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

  showView('home');
  renderHome();
  renderHistory();
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

function getCustomTemplateFields(activity) {
  const fields = state.customTemplates[activity];
  return Array.isArray(fields) && fields.length > 0 ? fields : ['Session title', 'Notes'];
}

function supportsReminders(activity) {
  return ['Gym', 'Horse Riding', 'Studying', 'Work', 'Vehicle Maintenance'].includes(activity);
}

function isNonTimedActivity(activity) {
  return activity === 'Vehicle Maintenance' || activity === 'Personal Info';
}

function getSensitiveEnding(value) {
  const cleanValue = String(value || '').trim();
  return cleanValue ? cleanValue.slice(-4) : '';
}

function reminderFields() {
  const labels = state.language === 'ar'
    ? { title: 'تذكير', date: 'تاريخ التذكير', time: 'وقت التذكير', note: 'ملاحظة التذكير' }
    : { title: 'Reminder', date: 'Reminder date', time: 'Reminder time', note: 'Reminder note' };

  return fieldSection(labels.title, [
    inputField(labels.date, 'reminderDate', '2026-08-01', 'date'),
    inputField(labels.time, 'reminderTime', '18:30', 'time'),
    textAreaField(labels.note, 'reminderNote', 'Reminder details', true),
  ]);
}

function getReminderDetails() {
  if (!supportsReminders(state.selectedActivity)) {
    return undefined;
  }

  const date = sessionForm.querySelector('[name="reminderDate"]')?.value.trim() || '';
  const time = sessionForm.querySelector('[name="reminderTime"]')?.value.trim() || '';
  const note = sessionForm.querySelector('[name="reminderNote"]')?.value.trim() || '';

  return date || time || note ? { date, time, note } : undefined;
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

  customActivityForm.classList.toggle('collapsed', state.selectedCategory !== 'custom');

  const categories = [
    ...activitySections.map((section) => ({
      key: section.key,
      count: section.activities.length,
    })),
    { key: 'custom', count: state.customActivities.length },
  ];
  const selectedSection = activitySections.find((section) => section.key === state.selectedCategory);
  const selectedActivities = state.selectedCategory === 'custom'
    ? state.customActivities
    : selectedSection?.activities || [];

  activityGrid.innerHTML = `
    <section class="activity-section">
      <h2>${state.language === 'ar' ? 'أنواع الأنشطة' : 'Activity types'}</h2>
      <div class="activity-section-grid category-grid">
        ${categories
          .map(
            (category) => `
              <button class="activity-card category-card${state.selectedCategory === category.key ? ' active' : ''}" type="button" data-category="${category.key}">
                <strong>${translations[state.language].sections[category.key]}</strong>
                <span>${category.count} ${state.language === 'ar' ? category.count === 1 ? 'نشاط' : 'أنشطة' : category.count === 1 ? 'activity' : 'activities'}</span>
              </button>
            `
          )
          .join('')}
      </div>
    </section>
    ${state.selectedCategory ? renderActivitySection(state.selectedCategory, selectedActivities) : ''}
  `;
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
  resetStudyCandle();
  state.selectedActivity = activity;
  state.startTime = null;
  state.endTime = null;
  stopTimer();
  timerDisplay.textContent = '00:00:00';
  timerNote.textContent = text('timerNote');
  sessionMessage.textContent = '';
  trackerTitle.textContent = activityLabel(activity);
  trackerHelper.textContent = trackerHelperText(activity);
  trackerView.classList.toggle('vehicle-mode', isNonTimedActivity(activity));
  trackerView.classList.toggle('focus-mode', activity === 'Studying' || activity === 'Work');
  timerCard.hidden = isNonTimedActivity(activity) || activity === 'Studying' || activity === 'Work';
  activityFields.innerHTML = getFieldsForActivity(activity);
  bindConditionalFields();
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

  return unit === 'm' ? totalDistance / 1000 : totalDistance;
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
    return fieldGrid(
      getCustomTemplateFields(activity).map((field, index) =>
        inputField(escapeHtml(field), `customField${index}`, escapeHtml(field))
      )
    );
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

        <h2 class="gym-section-title">${gymText('currentExercise')}</h2>
        ${inputField(gymText('exerciseName'), 'gymExerciseName', gymText('exercisePlaceholder'))}

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
    const fields = [
      inputField('Laps', 'laps', '4', 'number'),
      inputField('Lap distance', 'lapDistance', activity === 'Cycling' ? '1' : '400', 'number'),
      selectField('Unit', 'lapDistanceUnit', ['m', 'km']),
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
        ${fieldSection(horseText('rideMetricsSection'), [
          inputField(horseText('rideDistance'), 'rideDistance', '4.2 km'),
          inputField(horseText('averageSpeed'), 'averageSpeed', '8.5 km/h'),
          inputField(horseText('leftTurns'), 'leftTurns', '12', 'number'),
          inputField(horseText('rightTurns'), 'rightTurns', '12', 'number'),
        ])}
        ${fieldSection(horseText('calendarSafetySection'), [
          inputField(horseText('rideDate'), 'rideDate', '17/07/2026'),
          textAreaField(horseText('calendarNote'), 'calendarNote', horseText('calendarNotePlaceholder'), true),
          inputField(horseText('safetyLocation'), 'safetyLocation', horseText('safetyLocationPlaceholder')),
          inputField(horseText('safetyContact'), 'safetyContact', horseText('safetyContactPlaceholder')),
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
          ${inputField(studyText('pomodoroPlan'), 'pomodoroPlan', studyText('pomodoroPlaceholder'))}
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

    control.addEventListener('change', updateVisibility);
    updateVisibility();
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
      rideMetricsSection: 'Ride Metrics',
      rideDistance: 'Ride distance',
      averageSpeed: 'Average speed',
      leftTurns: 'Left turns',
      rightTurns: 'Right turns',
      calendarSafetySection: 'Calendar and Safety',
      rideDate: 'Ride date',
      calendarNote: 'Calendar note',
      calendarNotePlaceholder: 'Farrier visit next week',
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
      rideMetricsSection: 'مقاييس الركوب',
      rideDistance: 'مسافة الركوب',
      averageSpeed: 'متوسط السرعة',
      leftTurns: 'اللفات يسار',
      rightTurns: 'اللفات يمين',
      calendarSafetySection: 'التقويم والسلامة',
      rideDate: 'تاريخ الركوب',
      calendarNote: 'ملاحظة التقويم',
      calendarNotePlaceholder: 'زيارة البيطار الأسبوع القادم',
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

async function saveSession(event) {
  event.preventDefault();

  const activity = state.selectedActivity;
  const isNonTimed = isNonTimedActivity(activity);

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
  if (activity === 'Studying' || activity === 'Work') {
    pauseStudyCandle();
  }

  try {
    await saveSessionToCloud(session);
    sessionMessage.textContent = 'Saved securely to your account.';
  } catch {
    sessionMessage.textContent = 'Saved on this device. Cloud sync will retry after you reconnect.';
  }
  renderHome();
  renderHistory();
}

function getSessionDetails() {
  if (state.selectedActivity === 'Personal Info') {
    return {
      personalInfo: {
        idNumberEnding: getSensitiveEnding(sessionForm.querySelector('[name="personalIdNumber"]')?.value),
        idExpirationDate: sessionForm.querySelector('[name="personalIdExpirationDate"]')?.value || '',
        drivingLicenseExpirationDate: sessionForm.querySelector('[name="personalDlExpirationDate"]')?.value || '',
        passportNumberEnding: getSensitiveEnding(sessionForm.querySelector('[name="personalPassportNumber"]')?.value),
        passportExpirationDate: sessionForm.querySelector('[name="personalPassportExpirationDate"]')?.value || '',
      },
    };
  }

  if (state.customActivities.includes(state.selectedActivity)) {
    return {
      customFields: getCustomTemplateFields(state.selectedActivity).map((label, index) => ({
        label,
        value: sessionForm.querySelector(`[name="customField${index}"]`)?.value.trim() || '',
      })),
    };
  }

  if (state.selectedActivity === 'Studying') {
    return {
      studying: {
        subject: sessionForm.querySelector('[name="subject"]').value.trim(),
        studyType: sessionForm.querySelector('[name="studyType"]').value.trim(),
        examDate: sessionForm.querySelector('[name="examDate"]').value.trim(),
        coursework: sessionForm.querySelector('[name="coursework"]').value.trim(),
        pomodoroPlan: sessionForm.querySelector('[name="pomodoroPlan"]').value.trim(),
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

  if (supportsReminders(state.selectedActivity)) {
    details.reminder = getReminderDetails();
    delete details.reminderDate;
    delete details.reminderTime;
    delete details.reminderNote;
  }

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

  const filteredSessions =
    historyFilter.value === 'All'
      ? state.sessions
      : state.sessions.filter((session) => session.activity === historyFilter.value);

  renderProgressDashboard();

  if (filteredSessions.length === 0) {
    historyList.innerHTML = `<div class="empty-state">${text('noSessions')}</div>`;
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
              <button class="button secondary" type="button" data-edit-session="${session.id}">${state.language === 'ar' ? 'تعديل' : 'Edit'}</button>
              <button class="button danger" type="button" data-delete-session="${session.id}">${text('delete')}</button>
            </div>
          </header>
          ${
            isNonTimedActivity(session.activity)
              ? `<p>${session.activity === 'Personal Info' ? text('personalRecord') : text('maintenanceRecord')}</p>`
              : `<p>${formatTime(session.start)} to ${formatTime(session.end)} - ${session.duration}</p>`
          }
          <div class="history-details">
            ${details || `<div><span>${text('details')}</span>${text('noDetails')}</div>`}
            ${renderReminderDetails(session)}
            ${renderHistoryNote(session)}
          </div>
        </article>
      `;
    })
    .join('');
}

function renderHistoryNote(session) {
  const note = session.details?.historyNote;

  if (!note) {
    return '';
  }

  return `<div><span>${state.language === 'ar' ? 'ملاحظة السجل' : 'History note'}</span>${escapeHtml(note)}</div>`;
}

async function editHistorySession(sessionId) {
  const session = state.sessions.find((item) => String(item.id) === String(sessionId));

  if (!session) {
    return;
  }

  const dateLabel = state.language === 'ar' ? 'تعديل تاريخ الجلسة' : 'Edit session date';
  const noteLabel = state.language === 'ar' ? 'تعديل ملاحظة السجل' : 'Edit history note';
  const nextDate = window.prompt(dateLabel, session.date || '');

  if (nextDate === null) {
    return;
  }

  const nextNote = window.prompt(noteLabel, session.details?.historyNote || '');

  if (nextNote === null) {
    return;
  }

  session.date = nextDate.trim() || session.date;
  session.details = {
    ...(session.details || {}),
    historyNote: nextNote.trim(),
  };
  writeJson(accountStorageKey(storageKeys.sessions), state.sessions);

  if (cloudClient && state.userId) {
    const { error } = await cloudClient
      .from('activity_sessions')
      .update({ session_date: session.date, details: session.details })
      .eq('user_id', state.userId)
      .eq('id', session.id);

    if (error) {
      window.alert(state.language === 'ar' ? 'حُفظ التعديل على هذا الجهاز، لكن فشل الحفظ السحابي.' : 'Saved on this device, but cloud update failed.');
    }
  }

  renderHome();
  renderHistory();
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
    return session.details.customFields
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
      <div><span>${studyText('pomodoroPlan')}</span>${escapeHtml(study.pomodoroPlan || text('noDetails'))}</div>
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

  state.sessions = [];
  writeJson(accountStorageKey(storageKeys.sessions), state.sessions);

  if (cloudClient && state.userId) {
    const { error } = await cloudClient
      .from('activity_sessions')
      .delete()
      .eq('user_id', state.userId);

    if (error) {
      sessionMessage.textContent = 'Local history cleared, but cloud deletion failed.';
    }
  }

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
  writeJson(storageKeys.customActivities, state.customActivities);
  writeJson(storageKeys.customTemplates, state.customTemplates);
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

document.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]');
  const activityButton = event.target.closest('[data-activity]');
  const categoryButton = event.target.closest('[data-category]');
  const editButton = event.target.closest('[data-edit-session]');
  const deleteButton = event.target.closest('[data-delete-session]');

  if (viewButton) {
    event.preventDefault();
    showView(viewButton.dataset.view);
  }

  if (activityButton) {
    openTracker(activityButton.dataset.activity);
  }

  if (categoryButton) {
    state.selectedCategory = categoryButton.dataset.category;
    renderHome();
  }

  if (editButton) {
    void editHistorySession(editButton.dataset.editSession);
  }

  if (deleteButton) {
    const sessionId = deleteButton.dataset.deleteSession;
    state.sessions = state.sessions.filter((session) => String(session.id) !== sessionId);
    writeJson(accountStorageKey(storageKeys.sessions), state.sessions);

    if (cloudClient && state.userId) {
      void cloudClient
        .from('activity_sessions')
        .delete()
        .eq('user_id', state.userId)
        .eq('id', Number(sessionId));
    }

    renderHome();
    renderHistory();
  }
});

customActivityForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(customActivityForm);
  const customActivity = String(formData.get('customActivity') || '').trim();
  const customFields = String(formData.get('customFields') || '')
    .split(',')
    .map((field) => field.trim())
    .filter((field, index, fields) => field && fields.indexOf(field) === index)
    .slice(0, 8);

  if (!customActivity || getActivities().includes(customActivity)) {
    return;
  }

  state.customActivities = [...state.customActivities, customActivity];
  state.customTemplates = {
    ...state.customTemplates,
    [customActivity]: customFields.length > 0 ? customFields : ['Session title', 'Notes'],
  };
  writeJson(storageKeys.customActivities, state.customActivities);
  writeJson(storageKeys.customTemplates, state.customTemplates);
  customActivityForm.reset();
  renderHome();
});

startButton.addEventListener('click', startTimer);
endButton.addEventListener('click', endTimer);
sessionForm.addEventListener('submit', saveSession);
historyFilter.addEventListener('change', renderHistory);
clearHistoryButton.addEventListener('click', clearHistory);
exportHistoryButton.addEventListener('click', exportHistory);
document.addEventListener('visibilitychange', syncStudyCandleWithClock);
window.addEventListener('focus', syncStudyCandleWithClock);
window.addEventListener('pageshow', syncStudyCandleWithClock);

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
