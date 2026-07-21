import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import BalootTracker from '../../components/BalootTracker';
import FootballTracker from '../../components/FootballTracker';
import GymTracker from '../../components/GymTracker';
import HorseRidingTracker from '../../components/HorseRidingTracker';
import LapTracker from '../../components/LapTracker';
import MatchTracker from '../../components/MatchTracker';
import {
  getSupabaseSession,
  sendPasswordReset,
  signInWithSupabase,
  signOutFromSupabase,
  signUpWithSupabase,
  signOutOtherSupabaseSessions,
} from '../../lib/authDatabase';
import {
  clearCloudCustomActivities,
  deleteCloudCustomActivity,
  loadCloudCustomActivities,
  saveCloudCustomActivity,
} from '../../lib/customActivityDatabase';
import {
  clearCloudSessions,
  deleteCloudSession,
  loadCloudSessions,
  saveCloudSession,
  subscribeToCloudSessions,
} from '../../lib/sessionDatabase';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  defaultTafasiliSettings,
  loadCloudSettings,
  loadLocalSettings,
  mergeSettings,
  saveCloudSettings,
  saveLocalSettings,
} from '../../lib/userPreferences';
import {
  authenticateForAppLock,
  scheduleSessionNotifications,
  setSecureAppLock,
  shareSessionsCsv,
} from '../../lib/deviceFeatures';
import { registerAndLoadDevices, removeOtherDeviceRecords } from '../../lib/deviceDatabase';
import {
  ActivityDraft,
  BalootScore,
  CustomFieldValue,
  ExpirationReminderDetails,
  GymExercise,
  GymSet,
  HorseCleaningSupplyEntry,
  HorseFeedEntry,
  MatchRound,
  Session,
  SyncStatus,
  TafasiliSettings,
  UserDevice,
} from '../../types';

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

const lapActivities = ['Run', 'Walking', 'Cycling', 'Swimming'];
const movementActivities = ['Run', 'Walking', 'Cycling'];
const matchActivities = ['Padel', 'Tennis'];
const horseActivities = ['Horse Riding', 'Daily Care', 'Supplies and Feed', 'Riding Test'];
const activityGroupChoices = [
  'Sports and Games',
  'Fitness and Movement',
  'Horse Activities',
  'Study and Work',
  'Life Tracking',
  'Vehicle and Maintenance',
];
const activityGroupCloudKeys: Record<string, string> = {
  'Sports and Games': 'sports',
  'Fitness and Movement': 'fitness',
  'Horse Activities': 'horse',
  'Study and Work': 'study',
  'Life Tracking': 'life',
  'Vehicle and Maintenance': 'vehicle',
};
const cloudKeyActivityGroups = Object.fromEntries(
  Object.entries(activityGroupCloudKeys).map(([group, key]) => [key, group])
) as Record<string, string>;
const STUDY_CANDLE_DURATION_SECONDS = 3 * 60 * 60;
const arabicActivityNames: Record<string, string> = {
  Football: 'كرة القدم',
  Gym: 'النادي',
  Run: 'الجري',
  Padel: 'بادل',
  Tennis: 'تنس',
  Golf: 'جولف',
  'Horse Riding': 'ركوب الخيل',
  'Daily Care': 'العناية اليومية بالخيل',
  'Supplies and Feed': 'مستلزمات وعلف الخيل',
  'Riding Test': 'اختبار الركوب',
  Cycling: 'الدراجات',
  Walking: 'المشي',
  Swimming: 'السباحة',
  Studying: 'الدراسة',
  Work: 'العمل',
  Baloot: 'بلوت',
  'Vehicle Maintenance': 'صيانة المركبة',
  'Personal Info': 'المعلومات الشخصية',
};
const arabicGroupNames: Record<string, string> = {
  'Sports and Games': 'الرياضات والألعاب',
  'Fitness and Movement': 'اللياقة والحركة',
  'Horse Activities': 'أنشطة الخيل',
  'Study and Work': 'الدراسة والعمل',
  'Life Tracking': 'تتبع الحياة',
  'Vehicle and Maintenance': 'المركبات والصيانة',
  'Custom Activities': 'أنشطة مخصصة',
};

const authErrorMessage = (error: unknown, isArabic: boolean, action: 'signin' | 'signup') => {
  const message = error instanceof Error ? error.message.toLowerCase() : '';

  if (message.includes('invalid login credentials')) {
    return isArabic ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Incorrect email or password.';
  }

  if (message.includes('email not confirmed')) {
    return isArabic ? 'أكد بريدك الإلكتروني قبل تسجيل الدخول.' : 'Confirm your email before signing in.';
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return isArabic ? 'تم إرسال طلبات كثيرة. انتظر قليلاً ثم حاول مرة أخرى.' : 'Too many requests. Wait a moment and try again.';
  }

  if (message.includes('network') || message.includes('fetch')) {
    return isArabic ? 'تعذر الاتصال بالخادم. تحقق من الإنترنت.' : 'Could not reach the server. Check your internet connection.';
  }

  return action === 'signin'
    ? isArabic ? 'تعذر تسجيل الدخول.' : 'Could not sign in.'
    : isArabic ? 'تعذر إنشاء الحساب.' : 'Could not create account.';
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [signupRepeatPassword, setSignupRepeatPassword] = useState('');
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [activities, setActivities] = useState<string[]>(defaultActivities);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedActivityCategory, setSelectedActivityCategory] = useState<string | null>(null);
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);

  const [showOtherModal, setShowOtherModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [settings, setSettings] = useState<TafasiliSettings>(defaultTafasiliSettings);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('saved');
  const [currentDraft, setCurrentDraft] = useState<ActivityDraft | null>(null);
  const [isAppUnlocked, setIsAppUnlocked] = useState(true);
  const [accountDevices, setAccountDevices] = useState<UserDevice[]>([]);
  const [otherActivityName, setOtherActivityName] = useState('');
  const [otherActivityFields, setOtherActivityFields] = useState('');
  const [otherActivityCategory, setOtherActivityCategory] = useState('');
  const [customActivityTemplates, setCustomActivityTemplates] = useState<Record<string, string[]>>({});
  const [customActivityGroups, setCustomActivityGroups] = useState<Record<string, string>>({});
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  const [customActivityUsesTimer, setCustomActivityUsesTimer] = useState(false);

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);

  const [footballTeamOneName, setFootballTeamOneName] = useState('');
  const [footballTeamTwoName, setFootballTeamTwoName] = useState('');
  const [footballTeamOneScore, setFootballTeamOneScore] = useState('');
  const [footballTeamTwoScore, setFootballTeamTwoScore] = useState('');

  const [gymWorkoutDay, setGymWorkoutDay] = useState('');
  const [gymCustomWorkout, setGymCustomWorkout] = useState('');
  const [gymExerciseName, setGymExerciseName] = useState('');
  const [gymSetReps, setGymSetReps] = useState('');
  const [gymSetWeight, setGymSetWeight] = useState('');
  const [currentGymSets, setCurrentGymSets] = useState<GymSet[]>([]);
  const [gymExercises, setGymExercises] = useState<GymExercise[]>([]);

  const [lapCount, setLapCount] = useState(0);
  const [lapDistance, setLapDistance] = useState('');
  const [lapDistanceUnit, setLapDistanceUnit] = useState('m');
  const [routeName, setRouteName] = useState('');
  const [elevationGain, setElevationGain] = useState('');
  const [splitNotes, setSplitNotes] = useState('');
  const [movementGoal, setMovementGoal] = useState('');
  const [personalRecord, setPersonalRecord] = useState('');

  const [matchTeamOneName, setMatchTeamOneName] = useState('');
  const [matchTeamTwoName, setMatchTeamTwoName] = useState('');
  const [matchSetNumber, setMatchSetNumber] = useState('');
  const [matchTeamOneGames, setMatchTeamOneGames] = useState('');
  const [matchTeamTwoGames, setMatchTeamTwoGames] = useState('');
  const [matchTeamOnePoints, setMatchTeamOnePoints] = useState('');
  const [matchTeamTwoPoints, setMatchTeamTwoPoints] = useState('');
  const [matchServer, setMatchServer] = useState('');
  const [matchTiebreakScore, setMatchTiebreakScore] = useState('');
  const [matchTeamOneWinners, setMatchTeamOneWinners] = useState('');
  const [matchTeamTwoWinners, setMatchTeamTwoWinners] = useState('');
  const [matchTeamOneErrors, setMatchTeamOneErrors] = useState('');
  const [matchTeamTwoErrors, setMatchTeamTwoErrors] = useState('');
  const [matchRounds, setMatchRounds] = useState<MatchRound[]>([]);

  const [balootUsName, setBalootUsName] = useState('');
  const [balootThemName, setBalootThemName] = useState('');
  const [balootUsScore, setBalootUsScore] = useState('');
  const [balootThemScore, setBalootThemScore] = useState('');
  const [balootScores, setBalootScores] = useState<BalootScore[]>([]);
  const [balootDealerDirection, setBalootDealerDirection] = useState('↑');

  const [studySubject, setStudySubject] = useState('');
  const [studyType, setStudyType] = useState('');
  const [studyExamDate, setStudyExamDate] = useState('');
  const [studyCoursework, setStudyCoursework] = useState('');
  const [studyPomodoroPlan, setStudyPomodoroPlan] = useState('');
  const [studyStreak, setStudyStreak] = useState('');
  const [studyTotalHours, setStudyTotalHours] = useState('');
  const [studyNotes, setStudyNotes] = useState('');
  const [studyCandleSeconds, setStudyCandleSeconds] = useState(0);
  const [studyCandleDurationSeconds, setStudyCandleDurationSeconds] = useState(
    STUDY_CANDLE_DURATION_SECONDS
  );
  const [isStudyCandleRunning, setIsStudyCandleRunning] = useState(false);
  const studyCandleStartedAtRef = useRef<number | null>(null);
  const studyCandleBaseSecondsRef = useRef(0);
  const studyCandleAutoSaveStartedRef = useRef(false);

  const [workProjectName, setWorkProjectName] = useState('');
  const [workCandleHours, setWorkCandleHours] = useState('3');
  const [workCandleMinutes, setWorkCandleMinutes] = useState('0');
  const [workNotes, setWorkNotes] = useState('');

  const [horseRiderName, setHorseRiderName] = useState('');
  const [horseName, setHorseName] = useState('');
  const [horseTrainingType, setHorseTrainingType] = useState('');
  const [horseTrainingIntensity, setHorseTrainingIntensity] = useState('');
  const [horseTrainingTime, setHorseTrainingTime] = useState('');
  const [horseRestDay, setHorseRestDay] = useState(false);
  const [horseWalkingMinutes, setHorseWalkingMinutes] = useState('');
  const [horseWalkMinutes, setHorseWalkMinutes] = useState('');
  const [horseTrotMinutes, setHorseTrotMinutes] = useState('');
  const [horseCanterMinutes, setHorseCanterMinutes] = useState('');
  const [horseRideDistance, setHorseRideDistance] = useState('');
  const [horseAverageSpeed, setHorseAverageSpeed] = useState('');
  const [horseLeftTurns, setHorseLeftTurns] = useState('');
  const [horseRightTurns, setHorseRightTurns] = useState('');
  const [horseRideDate, setHorseRideDate] = useState('');
  const [horseCalendarNote, setHorseCalendarNote] = useState('');
  const [horseFarrierVisit, setHorseFarrierVisit] = useState('');
  const [horseNextFarrierVisit, setHorseNextFarrierVisit] = useState('');
  const [horseSafetyLocation, setHorseSafetyLocation] = useState('');
  const [horseSafetyContact, setHorseSafetyContact] = useState('');

  const [horseHayGiven, setHorseHayGiven] = useState(false);
  const [horseWaterChecked, setHorseWaterChecked] = useState(false);
  const [horseFoodOilGiven, setHorseFoodOilGiven] = useState(false);
  const [horseShampooUsed, setHorseShampooUsed] = useState(false);
  const [horsePadsCleaningSuppliesUsed, setHorsePadsCleaningSuppliesUsed] = useState(false);
  const [horseHoofOilUsed, setHorseHoofOilUsed] = useState(false);

  const [horseFeedEntries, setHorseFeedEntries] = useState<HorseFeedEntry[]>([
    { amount: '', buyingDate: '' },
  ]);
  const [horseCustomCleaningSupplies, setHorseCustomCleaningSupplies] = useState<HorseCleaningSupplyEntry[]>([]);

  const [horseFoodOilBuyingDate, setHorseFoodOilBuyingDate] = useState('');
  const [horseShampooBuyingDate, setHorseShampooBuyingDate] = useState('');
  const [horsePadsCleaningSuppliesBuyingDate, setHorsePadsCleaningSuppliesBuyingDate] = useState('');
  const [horseHoofOilBuyingDate, setHorseHoofOilBuyingDate] = useState('');

  const [horseDressageTestDay, setHorseDressageTestDay] = useState(false);
  const [horseDressageTestName, setHorseDressageTestName] = useState('');
  const [horseDressageScore, setHorseDressageScore] = useState('');
  const [horseDressageNotes, setHorseDressageNotes] = useState('');

  const [horseJumpingDay, setHorseJumpingDay] = useState(false);
  const [horseFenceHeight, setHorseFenceHeight] = useState('');
  const [horseFenceCount, setHorseFenceCount] = useState('');
  const [horseJumpingNotes, setHorseJumpingNotes] = useState('');

  const [horseNotes, setHorseNotes] = useState('');

  const [vehicleName, setVehicleName] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [vehicleModelYear, setVehicleModelYear] = useState('');
  const [vehicleServiceType, setVehicleServiceType] = useState('');
  const [vehicleServiceDate, setVehicleServiceDate] = useState('');
  const [vehicleMileage, setVehicleMileage] = useState('');
  const [vehicleCost, setVehicleCost] = useState('');
  const [vehicleShopName, setVehicleShopName] = useState('');
  const [vehicleNextServiceDate, setVehicleNextServiceDate] = useState('');
  const [vehicleNextServiceMileage, setVehicleNextServiceMileage] = useState('');
  const [vehicleInsuranceExpirationDate, setVehicleInsuranceExpirationDate] = useState('');
  const [vehicleRegistrationEndDate, setVehicleRegistrationEndDate] = useState('');
  const [vehicleNotes, setVehicleNotes] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderNote, setReminderNote] = useState('');
  const [reminderNotificationEnabled, setReminderNotificationEnabled] = useState(false);
  const [personalIdNumber, setPersonalIdNumber] = useState('');
  const [personalIdExpirationDate, setPersonalIdExpirationDate] = useState('');
  const [personalDlExpirationDate, setPersonalDlExpirationDate] = useState('');
  const [personalPassportNumber, setPersonalPassportNumber] = useState('');
  const [personalPassportExpirationDate, setPersonalPassportExpirationDate] = useState('');
  const [expirationReminderLeadDays, setExpirationReminderLeadDays] = useState('30');

  const latestStudySessionRef = useRef({
    sessions,
    selectedActivity,
    startTime,
    subject: studySubject,
    studyType,
    examDate: studyExamDate,
    coursework: studyCoursework,
    pomodoroPlan: studyPomodoroPlan,
    streak: studyStreak,
    totalStudyHours: studyTotalHours,
    notes: studyNotes,
    candleDurationSeconds: studyCandleDurationSeconds,
    workProjectName,
    workNotes,
    reminderDate,
    reminderTime,
    reminderNote,
    reminderNotificationEnabled,
  });

  latestStudySessionRef.current = {
    sessions,
    selectedActivity,
    startTime,
    subject: studySubject,
    studyType,
    examDate: studyExamDate,
    coursework: studyCoursework,
    pomodoroPlan: studyPomodoroPlan,
    streak: studyStreak,
    totalStudyHours: studyTotalHours,
    notes: studyNotes,
    candleDurationSeconds: studyCandleDurationSeconds,
    workProjectName,
    workNotes,
    reminderDate,
    reminderTime,
    reminderNote,
    reminderNotificationEnabled,
  };
  const autoSaveCompletedStudyCandleRef = useRef<() => void>(() => undefined);
  autoSaveCompletedStudyCandleRef.current = () => {
    void autoSaveCompletedStudyCandle();
  };
  const isArabic = language === 'ar';
  const draftValuesRef = useRef<Record<string, string | number | boolean>>({});

  draftValuesRef.current = {
    footballTeamOneName, footballTeamTwoName, footballTeamOneScore, footballTeamTwoScore,
    gymWorkoutDay, gymCustomWorkout, gymExerciseName, customActivityUsesTimer, routeName, elevationGain, splitNotes, movementGoal, personalRecord,
    matchTeamOneName, matchTeamTwoName, balootUsName, balootThemName,
    studySubject, studyType, studyExamDate, studyCoursework, studyPomodoroPlan,
    studyStreak, studyTotalHours, studyNotes, workProjectName, workCandleHours,
    workCandleMinutes, workNotes, horseRiderName, horseName, horseTrainingType,
    horseTrainingIntensity, horseTrainingTime, horseWalkMinutes, horseTrotMinutes,
    horseCanterMinutes, horseRideDistance, horseAverageSpeed, horseRideDate,
    horseFarrierVisit, horseNextFarrierVisit, horseNotes, vehicleName,
    vehiclePlateNumber, vehicleServiceType, vehicleServiceDate, vehicleMileage,
    vehicleCost, vehicleInsuranceExpirationDate, vehicleRegistrationEndDate,
    vehicleNotes, reminderDate, reminderTime, reminderNote, reminderNotificationEnabled, personalIdNumber,
    personalIdExpirationDate, personalDlExpirationDate, personalPassportNumber,
    personalPassportExpirationDate, expirationReminderLeadDays,
  };

  useEffect(() => {
    void AsyncStorage.getItem('language').then((savedLanguage) => {
      if (savedLanguage === 'ar' || savedLanguage === 'en') {
        setLanguage(savedLanguage);
      }
    });
  }, []);

  useEffect(() => {
    if (!isLoggedIn || sessions.length === 0) {
      return;
    }

    const showDueReminders = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const dueReminders = sessions
        .flatMap((session) => session.details?.expirationReminders ?? [])
        .filter((reminder) => reminder.remindOn <= today && reminder.expirationDate >= today);
      const uniqueReminders = [...new Map(
        dueReminders.map((reminder) => [`${reminder.label}:${reminder.expirationDate}`, reminder])
      ).values()];

      if (uniqueReminders.length === 0) {
        return;
      }

      const alertKey = `expirationReminderAlert:${authUserId ?? 'local'}:${today}`;
      const alreadyShown = await AsyncStorage.getItem(alertKey);

      if (alreadyShown) {
        return;
      }

      await AsyncStorage.setItem(alertKey, 'true');
      Alert.alert(
        isArabic ? 'تذكيرات الانتهاء' : 'Expiration Reminders',
        uniqueReminders
          .map((reminder) => `${reminder.label}: ${reminder.expirationDate}`)
          .join('\n')
      );
    };

    void showDueReminders();
  }, [authUserId, isArabic, isLoggedIn, sessions]);

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: isLoggedIn
        ? {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E7E9EE',
            borderTopWidth: 1,
            height: 85,
            paddingTop: 8,
            paddingBottom: 18,
          }
        : { display: 'none' },
    });
  }, [isLoggedIn, navigation]);

  useEffect(() => {
    if (!isLoggedIn) return;
    let active = true;
    const loadUsabilitySettings = async () => {
      const local = await loadLocalSettings(authUserId);
      let cloud = null;
      try {
        cloud = await loadCloudSettings();
      } catch {
        setSyncStatus('offline');
      }
      const merged = mergeSettings(local, cloud);
      if (!active) return;
      setSettings(merged);
      setExpirationReminderLeadDays(String(merged.defaultReminderDays));
      setIsAppUnlocked(!merged.appLockEnabled);
      setShowOnboarding(!merged.onboardingComplete);
      await saveLocalSettings(authUserId, merged);
      try {
        if (authUserId) setAccountDevices(await registerAndLoadDevices());
      } catch {
        setAccountDevices([]);
      }
      const savedDraft = await AsyncStorage.getItem(`activity-draft:${authUserId ?? 'local'}`);
      if (active) setCurrentDraft(savedDraft ? JSON.parse(savedDraft) : null);
    };
    void loadUsabilitySettings();
    return () => { active = false; };
  }, [authUserId, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !settings.appLockEnabled) {
      setIsAppUnlocked(true);
      return;
    }
    const lockWhenBackgrounded = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') setIsAppUnlocked(false);
    });
    return () => lockWhenBackgrounded.remove();
  }, [isLoggedIn, settings.appLockEnabled]);

  useEffect(() => {
    if (!isLoggedIn || !authUserId) {
      return;
    }

    let active = true;
    const refreshCloudHistory = async () => {
      try {
        const cloudSessions = await loadCloudSessions();
        if (!active || !Array.isArray(cloudSessions)) {
          return;
        }

        setSessions(cloudSessions);
        await AsyncStorage.setItem(`sessions:${authUserId}`, JSON.stringify(cloudSessions));
        if (active) setSyncStatus('saved');
      } catch {
        if (active) setSyncStatus('offline');
      }
    };

    const unsubscribe = subscribeToCloudSessions(() => {
      void refreshCloudHistory();
    });
    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void refreshCloudHistory();
      }
    });

    void refreshCloudHistory();

    return () => {
      active = false;
      unsubscribe();
      appStateSubscription.remove();
    };
  }, [authUserId, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !selectedActivity) return;
    const draftKey = `activity-draft:${authUserId ?? 'local'}`;
    const saveDraft = async () => {
      const draft: ActivityDraft = {
        activity: selectedActivity,
        updatedAt: new Date().toISOString(),
        values: draftValuesRef.current,
      };
      await AsyncStorage.setItem(draftKey, JSON.stringify(draft));
      setCurrentDraft(draft);
    };
    const interval = setInterval(() => { void saveDraft(); }, 1500);
    return () => clearInterval(interval);
  }, [authUserId, isLoggedIn, selectedActivity]);

  const persistSettings = async (next: TafasiliSettings) => {
    setSettings(next);
    setSyncStatus('syncing');
    await saveLocalSettings(authUserId, next);
    try {
      await saveCloudSettings(next);
      setSyncStatus('saved');
    } catch {
      setSyncStatus('offline');
    }
  };

  const finishOnboarding = async () => {
    await persistSettings({ ...settings, onboardingComplete: true });
    setShowOnboarding(false);
    setOnboardingStep(0);
  };

  const toggleFavorite = async (activity: string) => {
    const favoriteActivities = settings.favoriteActivities.includes(activity)
      ? settings.favoriteActivities.filter((item) => item !== activity)
      : [...settings.favoriteActivities, activity];
    await persistSettings({ ...settings, favoriteActivities });
  };

  const updateRecentActivity = async (activity: string) => {
    const recentActivities = [activity, ...settings.recentActivities.filter((item) => item !== activity)].slice(0, 6);
    await persistSettings({ ...settings, recentActivities });
  };

  const unlockApp = async () => {
    const result = await authenticateForAppLock();
    if (result.success) setIsAppUnlocked(true);
    else if (result.unavailable) Alert.alert('Device lock unavailable', 'Set up Face ID, Touch ID, or fingerprint in your device settings first.');
  };

  const toggleAppLock = async (enabled: boolean) => {
    if (enabled) {
      const result = await authenticateForAppLock();
      if (!result.success) {
        Alert.alert('App lock not enabled', result.unavailable ? 'No device authentication is enrolled.' : 'Authentication was cancelled.');
        return;
      }
    }
    await setSecureAppLock(enabled);
    await persistSettings({ ...settings, appLockEnabled: enabled });
  };

  const toggleLanguage = async () => {
    const nextLanguage = isArabic ? 'en' : 'ar';
    setLanguage(nextLanguage);
    await AsyncStorage.setItem('language', nextLanguage);
  };
  const activityDisplayName = (activity: string) =>
    isArabic ? arabicActivityNames[activity] ?? activity : activity;
  const groupDisplayName = (groupName: string) =>
    isArabic ? arabicGroupNames[groupName] ?? groupName : groupName;
  const renderBrand = () => (
    <View style={[styles.brandLockup, isArabic && styles.brandLockupRtl]}>
      <Image
        source={require('../../assets/images/tafasili-logo.png')}
        style={styles.brandLogo}
        resizeMode="contain"
      />
    </View>
  );

  useEffect(() => {
    let isMounted = true;

    const restoreAccount = async () => {
      try {
        const session = await getSupabaseSession();

        if (isMounted && session?.user) {
          setAuthUserId(session.user.id);
          setIsLoggedIn(true);
          await loadSavedData(session.user.id);
        } else if (!isSupabaseConfigured) {
          await loadSavedData();
        }
      } catch {
        // The sign-in screen remains available if session restoration fails.
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    void restoreAccount();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isStudyCandleRunning) {
      return;
    }

    const updateCandle = () => {
      const startedAt = studyCandleStartedAtRef.current;

      if (!startedAt) {
        return;
      }

      const elapsedSinceStart = Math.floor((Date.now() - startedAt) / 1000);
      const elapsedSeconds = Math.min(
        studyCandleDurationSeconds,
        studyCandleBaseSecondsRef.current + elapsedSinceStart
      );

      setStudyCandleSeconds(elapsedSeconds);

      if (
        elapsedSeconds >= studyCandleDurationSeconds &&
        !studyCandleAutoSaveStartedRef.current
      ) {
        studyCandleAutoSaveStartedRef.current = true;
        setIsStudyCandleRunning(false);
        autoSaveCompletedStudyCandleRef.current();
      }
    };

    updateCandle();
    const intervalId = setInterval(updateCandle, 1000);

    return () => clearInterval(intervalId);
  }, [isStudyCandleRunning, studyCandleDurationSeconds]);

  const login = async () => {
  const email = loginUsername.trim().toLowerCase();

  if (email === '') {
    alert(isArabic ? 'أدخل بريدك الإلكتروني' : 'Please enter your email address');
    return;
  }

  if (loginPassword.trim() === '') {
    alert('Please enter password');
    return;
  }

  try {
    if (isSupabaseConfigured) {
      const user = await signInWithSupabase(email, loginPassword);

      if (!user) {
        throw new Error('No account returned.');
      }

      setAuthUserId(user.id);
      await loadSavedData(user.id);
    }

    setIsLoggedIn(true);
  } catch (error) {
    alert(authErrorMessage(error, isArabic, 'signin'));
    setLoginPassword('');
  }
};
const signup = async () => {
  const email = loginUsername.trim().toLowerCase();

  if (email === '') {
    alert(isArabic ? 'أدخل بريدك الإلكتروني' : 'Please enter your email address');
    return;
  }

  if (loginPassword.length < 8) {
    alert('Password must be at least 8 characters');
    return;
  }

  if (loginPassword !== signupRepeatPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    if (isSupabaseConfigured) {
      const result = await signUpWithSupabase(email, loginPassword);

      if (result?.user?.identities?.length === 0) {
        alert(isArabic
          ? 'هذا الحساب موجود بالفعل. سجل الدخول أو أعد تعيين كلمة المرور.'
          : 'This account already exists. Sign in or reset your password.');
        setAuthMode('signin');
        return;
      }

      if (!result?.session || !result.user) {
        alert(isArabic
          ? 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني للتأكيد ثم سجل الدخول.'
          : 'Account created. Check your email to confirm it, then sign in.');
        setAuthMode('signin');
        return;
      }

      setAuthUserId(result.user.id);
      await loadSavedData(result.user.id);
    }

    setIsLoggedIn(true);
  } catch (error) {
    alert(authErrorMessage(error, isArabic, 'signup'));
  }
};
const forgotPassword = async () => {
  const email = loginUsername.trim().toLowerCase();

  if (!email.includes('@')) {
    alert(isArabic ? 'أدخل بريدك الإلكتروني أولاً.' : 'Enter your email address first.');
    return;
  }

  try {
    await sendPasswordReset(email);
    alert(isArabic
      ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
      : 'Password reset instructions were sent to your email.');
  } catch (error) {
    alert(authErrorMessage(error, isArabic, 'signin'));
  }
};
const logout = async () => {
  await saveSessionsToStorage(sessions, authUserId);

  try {
    await signOutFromSupabase();
  } catch {
    alert('Could not sign out from the cloud account.');
  }

  setIsLoggedIn(false);
  setAuthUserId(null);
  setSessions([]);
  setLoginPassword('');
  setSignupRepeatPassword('');
};
  const loadSavedData = async (userId: string | null = null) => {
    let localSessions: Session[] = [];
    let localActivities = [...defaultActivities];
    let localTemplates: Record<string, string[]> = {};
    let localGroups: Record<string, string> = {};
    const sessionsStorageKey = userId ? `sessions:${userId}` : 'sessions';
    const activitiesStorageKey = userId ? `activities:${userId}` : 'activities';
    const templatesStorageKey = userId
      ? `customActivityTemplates:${userId}`
      : 'customActivityTemplates';
    const groupsStorageKey = userId ? `customActivityGroups:${userId}` : 'customActivityGroups';
    const historyMigrationKey = userId ? `historyCloudAuthoritativeV1:${userId}` : null;

    try {
      const scopedSessions = await AsyncStorage.getItem(sessionsStorageKey);
      const legacySessions = userId && !scopedSessions
        ? await AsyncStorage.getItem('sessions')
        : null;
      const savedSessions = scopedSessions ?? legacySessions;
      const scopedActivities = await AsyncStorage.getItem(activitiesStorageKey);
      const scopedTemplates = await AsyncStorage.getItem(templatesStorageKey);
      const scopedGroups = await AsyncStorage.getItem(groupsStorageKey);
      const savedActivities = scopedActivities
        ?? (userId ? await AsyncStorage.getItem('activities') : null);
      const savedCustomTemplates = scopedTemplates
        ?? (userId ? await AsyncStorage.getItem('customActivityTemplates') : null);
      const savedCustomGroups = scopedGroups
        ?? (userId ? await AsyncStorage.getItem('customActivityGroups') : null);

      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        if (Array.isArray(parsedSessions)) {
          localSessions = parsedSessions;
          setSessions(localSessions);
        }
      }

      if (savedActivities) {
        const savedActivityList = JSON.parse(savedActivities);
        if (Array.isArray(savedActivityList)) {
          localActivities = [...new Set([...defaultActivities, ...savedActivityList])];
        }
      }
      setActivities(localActivities);

      if (savedCustomTemplates) {
        const parsedTemplates = JSON.parse(savedCustomTemplates);
        if (parsedTemplates && typeof parsedTemplates === 'object') {
          localTemplates = parsedTemplates;
        }
      }
      setCustomActivityTemplates(localTemplates);

      if (savedCustomGroups) {
        const parsedGroups = JSON.parse(savedCustomGroups);
        if (parsedGroups && typeof parsedGroups === 'object') {
          localGroups = parsedGroups;
        }
      }
      setCustomActivityGroups(localGroups);

    } catch {
      alert('Error loading saved data');
      return;
    }

    try {
      let cloudSessions = await loadCloudSessions();

      if (Array.isArray(cloudSessions)) {
        const historyAlreadyMigrated = historyMigrationKey
          ? await AsyncStorage.getItem(historyMigrationKey)
          : 'true';

        if (!historyAlreadyMigrated && localSessions.length > 0) {
          await Promise.all(localSessions.map((session) => saveCloudSession(session)));
          const migratedCloudSessions = await loadCloudSessions();
          if (Array.isArray(migratedCloudSessions)) {
            cloudSessions = migratedCloudSessions;
          }
        }

        const authoritativeSessions = cloudSessions ?? [];
        setSessions(authoritativeSessions);
        await AsyncStorage.setItem(sessionsStorageKey, JSON.stringify(authoritativeSessions));
        if (historyMigrationKey) {
          await AsyncStorage.setItem(historyMigrationKey, 'true');
        }
      }
    } catch {
      // Local history remains available when cloud sync is offline or not signed in.
    }

    if (userId) {
      try {
        const cloudActivities = await loadCloudCustomActivities();
        const mergedActivities = new Map<string, { category: string; fields: string[] }>();

        localActivities
          .filter((activity) => !defaultActivities.includes(activity))
          .forEach((name) => {
            mergedActivities.set(name, {
              category: localGroups[name] ?? 'Life Tracking',
              fields: localTemplates[name] ?? [],
            });
          });

        (cloudActivities ?? []).forEach((activity) => {
          mergedActivities.set(activity.name, {
            category: cloudKeyActivityGroups[activity.category] ?? activity.category,
            fields: activity.fields,
          });
        });

        const mergedNames = [...mergedActivities.keys()];
        const mergedTemplates = Object.fromEntries(
          [...mergedActivities].map(([name, activity]) => [name, activity.fields])
        );
        const mergedGroups = Object.fromEntries(
          [...mergedActivities].map(([name, activity]) => [name, activity.category])
        );
        const mergedActivityList = [...defaultActivities, ...mergedNames];

        setActivities(mergedActivityList);
        setCustomActivityTemplates(mergedTemplates);
        setCustomActivityGroups(mergedGroups);
        await Promise.all([
          AsyncStorage.setItem(activitiesStorageKey, JSON.stringify(mergedActivityList)),
          AsyncStorage.setItem(templatesStorageKey, JSON.stringify(mergedTemplates)),
          AsyncStorage.setItem(groupsStorageKey, JSON.stringify(mergedGroups)),
        ]);

        await Promise.allSettled(
          [...mergedActivities].map(([name, activity]) =>
            saveCloudCustomActivity({
              name,
              category: activityGroupCloudKeys[activity.category] ?? activity.category,
              fields: activity.fields,
            })
          )
        );
      } catch {
        // Local custom activities remain available until cloud sync returns.
      }
    }
  };

  const saveSessionsToStorage = async (newSessions: Session[], userId = authUserId) => {
    try {
      const sessionsStorageKey = userId ? `sessions:${userId}` : 'sessions';
      await AsyncStorage.setItem(sessionsStorageKey, JSON.stringify(newSessions));
    } catch {
      alert('Error saving session');
    }
  };

  const saveActivitiesToStorage = async (newActivities: string[], userId = authUserId) => {
    try {
      const key = userId ? `activities:${userId}` : 'activities';
      await AsyncStorage.setItem(key, JSON.stringify(newActivities));
    } catch {
      alert('Error saving activity list');
    }
  };

  const saveCustomTemplatesToStorage = async (
    templates: Record<string, string[]>,
    userId = authUserId
  ) => {
    try {
      const key = userId ? `customActivityTemplates:${userId}` : 'customActivityTemplates';
      await AsyncStorage.setItem(key, JSON.stringify(templates));
    } catch {
      alert('Error saving custom activity fields');
    }
  };

  const saveCustomGroupsToStorage = async (groups: Record<string, string>, userId = authUserId) => {
    try {
      const key = userId ? `customActivityGroups:${userId}` : 'customActivityGroups';
      await AsyncStorage.setItem(key, JSON.stringify(groups));
    } catch {
      alert('Error saving custom activity category');
    }
  };

  const isLapActivity = (activity: string | null) => {
    if (!activity) {
      return false;
    }

    return lapActivities.includes(activity);
  };

  const isMovementActivity = (activity: string | null) => {
    if (!activity) {
      return false;
    }

    return movementActivities.includes(activity);
  };

  const isCustomActivity = (activity: string | null) => {
    return Boolean(activity && !defaultActivities.includes(activity));
  };

  const getCustomTemplateFields = (activity: string) => {
    return (customActivityTemplates[activity] || []).filter(
      (field) => !['session title', 'notes'].includes(field.trim().toLowerCase())
    );
  };

  const isMatchActivity = (activity: string | null) => {
    if (!activity) {
      return false;
    }

    return matchActivities.includes(activity);
  };

  const isBalootActivity = (activity: string | null) => {
    return activity === 'Baloot';
  };

  const isHorseRidingActivity = (activity: string | null) => {
    return Boolean(activity && horseActivities.includes(activity));
  };

  const isVehicleMaintenanceActivity = (activity: string | null) => {
  return activity === 'Vehicle Maintenance';
};

  const isPersonalInfoActivity = (activity: string | null) => {
    return activity === 'Personal Info';
  };

  const isNonTimedActivity = (activity: string | null) => {
    return isVehicleMaintenanceActivity(activity) || isPersonalInfoActivity(activity);
  };

  const isSelectedActivityNonTimed = (activity: string | null) => {
    return isNonTimedActivity(activity)
      || (isHorseRidingActivity(activity) && activity !== 'Horse Riding')
      || (isCustomActivity(activity) && !customActivityUsesTimer);
  };

  const getSensitiveEnding = (value: string) => {
    const cleanValue = value.trim();
    return cleanValue ? cleanValue.slice(-4) : '';
  };

  const isWorkActivity = (activity: string | null) => {
    return activity === 'Work';
  };

  const isStudyingActivity = (activity: string | null) => {
    return activity === 'Studying';
  };

  const isFocusActivity = (activity: string | null) => {
    return isStudyingActivity(activity) || isWorkActivity(activity);
  };

  const supportsReminders = (activity: string | null) => {
    return Boolean(activity && (isCustomActivity(activity) || ['Gym', 'Studying', 'Work', 'Vehicle Maintenance'].includes(activity) || horseActivities.includes(activity)));
  };

  const supportsExpirationReminders = (activity: string | null) => {
    return activity === 'Personal Info' || activity === 'Vehicle Maintenance';
  };

  const calculateReminderDate = (expirationDate: string, daysBefore: number) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)) {
      return '';
    }

    const expiration = new Date(`${expirationDate}T00:00:00Z`);

    if (Number.isNaN(expiration.getTime())) {
      return '';
    }

    expiration.setUTCDate(expiration.getUTCDate() - daysBefore);
    return expiration.toISOString().slice(0, 10);
  };

  const getExpirationReminders = (): ExpirationReminderDetails[] => {
    const daysBefore = Number(expirationReminderLeadDays);

    if (!supportsExpirationReminders(selectedActivity) || daysBefore <= 0) {
      return [];
    }

    const expirationFields = selectedActivity === 'Personal Info'
      ? [
          { label: 'ID expiration', date: personalIdExpirationDate.trim() },
          { label: 'Driving license expiration', date: personalDlExpirationDate.trim() },
          { label: 'Passport expiration', date: personalPassportExpirationDate.trim() },
        ]
      : [
          { label: 'Insurance expiration', date: vehicleInsuranceExpirationDate.trim() },
          { label: 'Registration expiration', date: vehicleRegistrationEndDate.trim() },
        ];

    return expirationFields.flatMap(({ label, date }) => {
      const remindOn = calculateReminderDate(date, daysBefore);
      return date && remindOn
        ? [{ label, expirationDate: date, remindOn, daysBefore }]
        : [];
    });
  };

  const formatStudyCandleDuration = (durationSeconds: number) => {
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatStudyCandleElapsedTime = () => {
    return formatStudyCandleDuration(studyCandleSeconds);
  };

  const formatStudyCandleRemainingTime = () => {
    return formatStudyCandleDuration(
      Math.max(0, studyCandleDurationSeconds - studyCandleSeconds)
    );
  };

  const getConfiguredWorkCandleSeconds = () => {
    const hours = Number(workCandleHours || 0);
    const minutes = Number(workCandleMinutes || 0);
    return Math.min(12 * 60 * 60, Math.max(0, Math.floor(hours * 60 * 60 + minutes * 60)));
  };

  const startAnotherStudyCandle = () => {
    const nextStartTime = new Date();
    const nextDurationSeconds = isWorkActivity(selectedActivity)
      ? getConfiguredWorkCandleSeconds() || STUDY_CANDLE_DURATION_SECONDS
      : STUDY_CANDLE_DURATION_SECONDS;

    studyCandleBaseSecondsRef.current = 0;
    studyCandleStartedAtRef.current = Date.now();
    studyCandleAutoSaveStartedRef.current = false;
    setStudyCandleSeconds(0);
    setStudyCandleDurationSeconds(nextDurationSeconds);
    setStartTime(nextStartTime);
    setEndTime(null);
    setIsStudyCandleRunning(true);
  };

  async function autoSaveCompletedStudyCandle() {
    const snapshot = latestStudySessionRef.current;
    const focusActivity = snapshot.selectedActivity === 'Work' ? 'Work' : 'Studying';
    const completedAt = new Date();
    const completedDurationSeconds = snapshot.candleDurationSeconds;
    const sessionStart = snapshot.startTime || new Date(
      completedAt.getTime() - completedDurationSeconds * 1000
    );
    const reminder = snapshot.reminderDate.trim() || snapshot.reminderTime.trim() || snapshot.reminderNote.trim()
      ? {
          date: snapshot.reminderDate.trim(),
          time: snapshot.reminderTime.trim(),
          note: snapshot.reminderNote.trim(),
          notificationEnabled: snapshot.reminderNotificationEnabled,
        }
      : undefined;
    const completedSession: Session = {
      id: Date.now(),
      activity: focusActivity,
      start: sessionStart.toLocaleTimeString(),
      end: completedAt.toLocaleTimeString(),
      duration: formatStudyCandleDuration(completedDurationSeconds),
      durationSeconds: completedDurationSeconds,
      date: completedAt.toLocaleDateString(),
      details: {
        ...(focusActivity === 'Work'
          ? {
              work: {
                projectName: snapshot.workProjectName.trim(),
                candleSeconds: completedDurationSeconds,
                candleTime: formatStudyCandleDuration(completedDurationSeconds),
                candleTargetSeconds: completedDurationSeconds,
                candleTargetTime: formatStudyCandleDuration(completedDurationSeconds),
                notes: snapshot.workNotes.trim(),
              },
            }
          : {
              studying: {
                subject: snapshot.subject.trim(),
                studyType: snapshot.studyType.trim(),
                examDate: snapshot.examDate.trim(),
                coursework: snapshot.coursework.trim(),
                streak: snapshot.streak.trim(),
                totalStudyHours: snapshot.totalStudyHours.trim(),
                candleSeconds: completedDurationSeconds,
                candleTime: formatStudyCandleDuration(completedDurationSeconds),
                notes: snapshot.notes.trim(),
              },
            }),
        ...(reminder ? { reminder } : {}),
      },
    };
    const updatedSessions = [completedSession, ...snapshot.sessions];

    studyCandleBaseSecondsRef.current = completedDurationSeconds;
    studyCandleStartedAtRef.current = null;
    setStudyCandleSeconds(completedDurationSeconds);
    setEndTime(completedAt);
    setSessions(updatedSessions);
    await saveSessionsToStorage(updatedSessions);

    let cloudMessage = '';

    try {
      await saveCloudSession(completedSession);
    } catch {
      cloudMessage = '\n\nSaved on this device, but cloud sync failed.';
    }

    Alert.alert(
      focusActivity === 'Work' ? 'Work candle complete' : 'Three-hour candle complete',
      focusActivity === 'Work'
        ? `Your work session was automatically saved to History. Continue working?${cloudMessage}`
        : `Your study session was automatically saved to History. Continue studying?${cloudMessage}`,
      [
        { text: 'Not now', style: 'cancel' },
        { text: 'Start another candle', onPress: startAnotherStudyCandle },
      ]
    );
  }

  const startStudyCandle = () => {
    if (selectedActivity === 'Work' && !workProjectName.trim()) {
      Alert.alert('Project name required', 'Enter the project name before starting the candle.');
      return;
    }

    if (selectedActivity === 'Work' && studyCandleSeconds === 0) {
      const configuredSeconds = getConfiguredWorkCandleSeconds();
      if (configuredSeconds < 60) {
        Alert.alert('Candle time required', 'Set a work candle time of at least one minute.');
        return;
      }
      setStudyCandleDurationSeconds(configuredSeconds);
    }

    if (studyCandleSeconds >= studyCandleDurationSeconds) {
      startAnotherStudyCandle();
      return;
    }

    if (!startTime) {
      setStartTime(new Date());
      setEndTime(null);
    }

    studyCandleBaseSecondsRef.current = studyCandleSeconds;
    studyCandleStartedAtRef.current = Date.now();
    studyCandleAutoSaveStartedRef.current = false;
    setIsStudyCandleRunning(true);
  };

  const pauseStudyCandle = () => {
    if (studyCandleStartedAtRef.current) {
      const elapsedSinceStart = Math.floor(
        (Date.now() - studyCandleStartedAtRef.current) / 1000
      );
      const pausedSeconds = Math.min(
        studyCandleDurationSeconds,
        studyCandleBaseSecondsRef.current + elapsedSinceStart
      );

      studyCandleBaseSecondsRef.current = pausedSeconds;
      setStudyCandleSeconds(pausedSeconds);
    }

    studyCandleStartedAtRef.current = null;
    setIsStudyCandleRunning(false);
  };

  const stopStudyCandle = () => {
    pauseStudyCandle();
    setEndTime(new Date());
  };

  const getDefaultLapDistance = (activity: string) => {
    if (settings.measurementSystem === 'imperial') {
      return activity === 'Swimming'
        ? { distance: '25', unit: 'yd' }
        : { distance: '1', unit: 'mi' };
    }
    if (activity === 'Cycling') {
      return {
        distance: '1',
        unit: 'km',
      };
    }

    if (activity === 'Swimming') {
      return {
        distance: '25',
        unit: 'm',
      };
    }

    return {
      distance: '400',
      unit: 'm',
    };
  };

  const resetActivityFields = () => {
    setFootballTeamOneName('');
    setFootballTeamTwoName('');
    setFootballTeamOneScore('');
    setFootballTeamTwoScore('');

    setGymWorkoutDay('');
    setGymCustomWorkout('');
    setGymExerciseName('');
    setGymSetReps('');
    setGymSetWeight('');
    setCurrentGymSets([]);
    setGymExercises([]);
    setCustomActivityUsesTimer(false);

    setLapCount(0);
    setLapDistance('');
    setLapDistanceUnit('m');
    setRouteName('');
    setElevationGain('');
    setSplitNotes('');
    setMovementGoal('');
    setPersonalRecord('');

    setMatchTeamOneName('');
    setMatchTeamTwoName('');
    setMatchSetNumber('');
    setMatchTeamOneGames('');
    setMatchTeamTwoGames('');
    setMatchTeamOnePoints('');
    setMatchTeamTwoPoints('');
    setMatchServer('');
    setMatchTiebreakScore('');
    setMatchTeamOneWinners('');
    setMatchTeamTwoWinners('');
    setMatchTeamOneErrors('');
    setMatchTeamTwoErrors('');
    setMatchRounds([]);

    setBalootUsName('');
    setBalootThemName('');
    setBalootUsScore('');
    setBalootThemScore('');
    setBalootScores([]);
    setBalootDealerDirection('↑');

    setStudySubject('');
    setStudyType('');
    setStudyExamDate('');
    setStudyCoursework('');
    setStudyPomodoroPlan('');
    setStudyStreak('');
    setStudyTotalHours('');
    setStudyNotes('');
    setStudyCandleSeconds(0);
    setStudyCandleDurationSeconds(STUDY_CANDLE_DURATION_SECONDS);
    setIsStudyCandleRunning(false);
    studyCandleStartedAtRef.current = null;
    studyCandleBaseSecondsRef.current = 0;
    studyCandleAutoSaveStartedRef.current = false;

    setWorkProjectName('');
    setWorkCandleHours('3');
    setWorkCandleMinutes('0');
    setWorkNotes('');

    setVehicleName('');
    setVehiclePlateNumber('');
    setVehicleModelYear('');
    setVehicleServiceType('');
    setVehicleServiceDate('');
    setVehicleMileage('');
    setVehicleCost('');
    setVehicleShopName('');
    setVehicleNextServiceDate('');
    setVehicleNextServiceMileage('');
    setVehicleInsuranceExpirationDate('');
    setVehicleRegistrationEndDate('');
    setVehicleNotes('');
    setReminderDate('');
    setReminderTime('');
    setReminderNote('');
    setReminderNotificationEnabled(false);
    setPersonalIdNumber('');
    setPersonalIdExpirationDate('');
    setPersonalDlExpirationDate('');
    setPersonalPassportNumber('');
    setPersonalPassportExpirationDate('');
    setExpirationReminderLeadDays(String(settings.defaultReminderDays));
    setCustomFieldValues({});

    setHorseRiderName('');
    setHorseName('');
    setHorseTrainingType('');
    setHorseTrainingIntensity('');
    setHorseTrainingTime('');
    setHorseRestDay(false);
    setHorseWalkingMinutes('');
    setHorseWalkMinutes('');
    setHorseTrotMinutes('');
    setHorseCanterMinutes('');
    setHorseRideDistance('');
    setHorseAverageSpeed('');
    setHorseLeftTurns('');
    setHorseRightTurns('');
    setHorseRideDate('');
    setHorseCalendarNote('');
    setHorseFarrierVisit('');
    setHorseNextFarrierVisit('');
    setHorseSafetyLocation('');
    setHorseSafetyContact('');

    setHorseHayGiven(false);
    setHorseWaterChecked(false);
    setHorseFoodOilGiven(false);
    setHorseShampooUsed(false);
    setHorsePadsCleaningSuppliesUsed(false);
    setHorseHoofOilUsed(false);

    setHorseFeedEntries([{ amount: '', buyingDate: '' }]);
    setHorseCustomCleaningSupplies([]);

    setHorseFoodOilBuyingDate('');
    setHorseShampooBuyingDate('');
    setHorsePadsCleaningSuppliesBuyingDate('');
    setHorseHoofOilBuyingDate('');

    setHorseDressageTestDay(false);
    setHorseDressageTestName('');
    setHorseDressageScore('');
    setHorseDressageNotes('');

    setHorseJumpingDay(false);
    setHorseFenceHeight('');
    setHorseFenceCount('');
    setHorseJumpingNotes('');

    setHorseNotes('');
  };

  const restoreDraftValues = (values: ActivityDraft['values']) => {
    const textValue = (key: string) => String(values[key] ?? '');
    setFootballTeamOneName(textValue('footballTeamOneName'));
    setFootballTeamTwoName(textValue('footballTeamTwoName'));
    setFootballTeamOneScore(textValue('footballTeamOneScore'));
    setFootballTeamTwoScore(textValue('footballTeamTwoScore'));
    setGymWorkoutDay(textValue('gymWorkoutDay'));
    setGymCustomWorkout(textValue('gymCustomWorkout'));
    setGymExerciseName(textValue('gymExerciseName'));
    setCustomActivityUsesTimer(values.customActivityUsesTimer === true || values.customActivityUsesTimer === 'true');
    setRouteName(textValue('routeName'));
    setElevationGain(textValue('elevationGain'));
    setSplitNotes(textValue('splitNotes'));
    setMovementGoal(textValue('movementGoal'));
    setPersonalRecord(textValue('personalRecord'));
    setMatchTeamOneName(textValue('matchTeamOneName'));
    setMatchTeamTwoName(textValue('matchTeamTwoName'));
    setBalootUsName(textValue('balootUsName'));
    setBalootThemName(textValue('balootThemName'));
    setStudySubject(textValue('studySubject'));
    setStudyType(textValue('studyType'));
    setStudyExamDate(textValue('studyExamDate'));
    setStudyCoursework(textValue('studyCoursework'));
    setStudyPomodoroPlan(textValue('studyPomodoroPlan'));
    setStudyStreak(textValue('studyStreak'));
    setStudyTotalHours(textValue('studyTotalHours'));
    setStudyNotes(textValue('studyNotes'));
    setWorkProjectName(textValue('workProjectName'));
    setWorkCandleHours(textValue('workCandleHours') || '3');
    setWorkCandleMinutes(textValue('workCandleMinutes') || '0');
    setWorkNotes(textValue('workNotes'));
    setHorseRiderName(textValue('horseRiderName'));
    setHorseName(textValue('horseName'));
    setHorseTrainingType(textValue('horseTrainingType'));
    setHorseTrainingIntensity(textValue('horseTrainingIntensity'));
    setHorseTrainingTime(textValue('horseTrainingTime'));
    setHorseWalkMinutes(textValue('horseWalkMinutes'));
    setHorseTrotMinutes(textValue('horseTrotMinutes'));
    setHorseCanterMinutes(textValue('horseCanterMinutes'));
    setHorseRideDistance(textValue('horseRideDistance'));
    setHorseAverageSpeed(textValue('horseAverageSpeed'));
    setHorseRideDate(textValue('horseRideDate'));
    setHorseFarrierVisit(textValue('horseFarrierVisit'));
    setHorseNextFarrierVisit(textValue('horseNextFarrierVisit'));
    setHorseNotes(textValue('horseNotes'));
    setVehicleName(textValue('vehicleName'));
    setVehiclePlateNumber(textValue('vehiclePlateNumber'));
    setVehicleServiceType(textValue('vehicleServiceType'));
    setVehicleServiceDate(textValue('vehicleServiceDate'));
    setVehicleMileage(textValue('vehicleMileage'));
    setVehicleCost(textValue('vehicleCost'));
    setVehicleInsuranceExpirationDate(textValue('vehicleInsuranceExpirationDate'));
    setVehicleRegistrationEndDate(textValue('vehicleRegistrationEndDate'));
    setVehicleNotes(textValue('vehicleNotes'));
    setReminderDate(textValue('reminderDate'));
    setReminderTime(textValue('reminderTime'));
    setReminderNote(textValue('reminderNote'));
    setReminderNotificationEnabled(
      values.reminderNotificationEnabled === true || values.reminderNotificationEnabled === 'true'
    );
    setPersonalIdNumber(textValue('personalIdNumber'));
    setPersonalIdExpirationDate(textValue('personalIdExpirationDate'));
    setPersonalDlExpirationDate(textValue('personalDlExpirationDate'));
    setPersonalPassportNumber(textValue('personalPassportNumber'));
    setPersonalPassportExpirationDate(textValue('personalPassportExpirationDate'));
    setExpirationReminderLeadDays(textValue('expirationReminderLeadDays') || String(settings.defaultReminderDays));
  };

  const openActivity = async (activity: string, restoreDraft = false) => {
    setSelectedActivity(activity);
    setStartTime(null);
    setEndTime(null);
    resetActivityFields();

    if (lapActivities.includes(activity)) {
      const defaultLap = getDefaultLapDistance(activity);
      setLapDistance(defaultLap.distance);
      setLapDistanceUnit(defaultLap.unit);
    }
    await updateRecentActivity(activity);
    if (restoreDraft) {
      const savedDraft = await AsyncStorage.getItem(`activity-draft:${authUserId ?? 'local'}`);
      const draft: ActivityDraft | null = savedDraft ? JSON.parse(savedDraft) : null;
      if (draft?.activity === activity) restoreDraftValues(draft.values);
    }
  };

  const openOtherModal = () => {
    setOtherActivityName('');
    setOtherActivityFields('');
    setOtherActivityCategory('');
    setShowOtherModal(true);
  };

  const repeatLastSession = async () => {
    const last = sessions[0];
    if (!last) return;
    const now = new Date().toISOString();
    const repeated: Session = {
      ...last,
      id: Date.now(),
      date: now,
      start: last.start ? now : '',
      end: last.end ? now : '',
      details: JSON.parse(JSON.stringify(last.details ?? {})),
    };
    const updated = [repeated, ...sessions];
    setSessions(updated);
    await saveSessionsToStorage(updated);
    try {
      setSyncStatus('syncing');
      await saveCloudSession(repeated);
      setSyncStatus('saved');
    } catch {
      setSyncStatus('offline');
    }
    Alert.alert(isArabic ? 'تم الحفظ' : 'Saved', isArabic ? 'تم تكرار آخر سجل.' : 'The last record was repeated in History.');
  };

  const confirmDeleteDraft = () => {
    Alert.alert(
      isArabic ? 'حذف المسودة؟' : 'Delete draft?',
      isArabic ? 'سيتم حذف المسودة غير المحفوظة فقط.' : 'Only this unfinished draft will be deleted.',
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isArabic ? 'حذف' : 'Delete',
          style: 'destructive',
          onPress: () => {
            void AsyncStorage.removeItem(`activity-draft:${authUserId ?? 'local'}`).then(() => {
              setCurrentDraft(null);
            });
          },
        },
      ]
    );
  };

  const addOtherActivity = async () => {
    const cleanName = otherActivityName.trim();

    if (cleanName === '') {
      alert('Please enter an activity name');
      return;
    }

    if (otherActivityCategory === '') {
      alert('Please choose an activity type');
      return;
    }

    const alreadyExists = activities.some(
      (activity) => activity.toLowerCase() === cleanName.toLowerCase()
    );

    if (alreadyExists) {
      alert('This activity already exists');
      return;
    }

    const newActivities = [...activities, cleanName];
    const fields = otherActivityFields
      .split(',')
      .map((field) => field.trim())
      .filter((field, index, list) => field !== '' && list.indexOf(field) === index)
      .slice(0, 8);
    const newTemplates = {
      ...customActivityTemplates,
      [cleanName]: fields,
    };
    const newGroups = {
      ...customActivityGroups,
      [cleanName]: otherActivityCategory,
    };

    setActivities(newActivities);
    saveActivitiesToStorage(newActivities);
    setCustomActivityTemplates(newTemplates);
    saveCustomTemplatesToStorage(newTemplates);
    setCustomActivityGroups(newGroups);
    saveCustomGroupsToStorage(newGroups);

    try {
      await saveCloudCustomActivity({
        name: cleanName,
        category: activityGroupCloudKeys[otherActivityCategory] ?? otherActivityCategory,
        fields: newTemplates[cleanName],
      });
    } catch {
      alert(isArabic
        ? 'تم الحفظ على هذا الجهاز، لكن تعذرت مزامنته الآن.'
        : 'Saved on this device, but cloud sync is currently unavailable.');
    }

    setShowOtherModal(false);
    setSelectedActivity(cleanName);
    setStartTime(null);
    setEndTime(null);
    resetActivityFields();
  };

  const deleteActivity = async (activityName: string) => {
    const newActivities = activities.filter((activity) => activity !== activityName);
    const newTemplates = { ...customActivityTemplates };
    const newGroups = { ...customActivityGroups };
    delete newTemplates[activityName];
    delete newGroups[activityName];

    setActivities(newActivities);
    saveActivitiesToStorage(newActivities);
    setCustomActivityTemplates(newTemplates);
    saveCustomTemplatesToStorage(newTemplates);
    setCustomActivityGroups(newGroups);
    saveCustomGroupsToStorage(newGroups);
    await persistSettings({
      ...settings,
      favoriteActivities: settings.favoriteActivities.filter((activity) => activity !== activityName),
      recentActivities: settings.recentActivities.filter((activity) => activity !== activityName),
    });

    try {
      await deleteCloudCustomActivity(activityName);
    } catch {
      alert(isArabic
        ? 'تم الحذف من هذا الجهاز، لكن تعذر حذفه من السحابة.'
        : 'Deleted on this device, but cloud deletion failed.');
    }
  };

  const confirmDeleteActivity = (activityName: string) => {
    Alert.alert(
      'Delete Activity',
      `Are you sure you want to delete ${activityName} from the activity list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => void deleteActivity(activityName),
        },
      ]
    );
  };

  const resetActivityList = () => {
    Alert.alert(
      'Reset Activity List',
      'This will restore the original activity list. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setActivities(defaultActivities);
            saveActivitiesToStorage(defaultActivities);
            setCustomActivityTemplates({});
            saveCustomTemplatesToStorage({});
            setCustomActivityGroups({});
            saveCustomGroupsToStorage({});
            try {
              await clearCloudCustomActivities();
            } catch {
              alert(isArabic
                ? 'تمت إعادة الضبط على هذا الجهاز، لكن تعذرت مزامنة الحذف.'
                : 'Reset on this device, but cloud deletion failed.');
            }
          },
        },
      ]
    );
  };

  const startActivity = () => {
    setStartTime(new Date());
    setEndTime(null);
  };

  const endActivity = () => {
    if (!startTime) {
      alert('Please start the activity first');
      return;
    }

    setEndTime(new Date());
  };

  const getTotalLapDistance = () => {
    const distanceNumber = Number(lapDistance);

    if (!distanceNumber || lapCount === 0) {
      return `0 ${lapDistanceUnit}`;
    }

    const total = distanceNumber * lapCount;

    if (lapDistanceUnit === 'm' && total >= 1000) {
      const kmTotal = total / 1000;
      return `${kmTotal.toFixed(2)} km`;
    }

    return `${total} ${lapDistanceUnit}`;
  };

  const getTotalDistanceInKm = () => {
    const distanceNumber = Number(lapDistance);

    if (!distanceNumber || lapCount === 0) {
      return 0;
    }

    const total = distanceNumber * lapCount;

    if (lapDistanceUnit === 'm') return total / 1000;
    if (lapDistanceUnit === 'yd') return total / 1093.613;
    if (lapDistanceUnit === 'mi') return total * 1.609344;
    return total;
  };

  const getDurationSeconds = () => {
    if (!startTime || !endTime) {
      return 0;
    }

    return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  };

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours} hr ${minutes} min ${seconds} sec`;
    }

    if (minutes > 0) {
      return `${minutes} min ${seconds} sec`;
    }

    return `${seconds} sec`;
  };

  const getDuration = () => {
    if (!startTime || !endTime) {
      return 'Not finished yet';
    }

    return formatDuration(getDurationSeconds());
  };

  const getAveragePace = () => {
    const totalKm = getTotalDistanceInKm();
    const durationSeconds = getDurationSeconds();

    if (!totalKm || !durationSeconds) {
      return 'Not calculated';
    }

    const secondsPerKm = durationSeconds / totalKm;
    const minutes = Math.floor(secondsPerKm / 60);
    const seconds = Math.round(secondsPerKm % 60);

    return `${minutes}:${String(seconds).padStart(2, '0')} min/km`;
  };

  const getAverageSpeed = () => {
    const totalKm = getTotalDistanceInKm();
    const durationSeconds = getDurationSeconds();

    if (!totalKm || !durationSeconds) {
      return 'Not calculated';
    }

    const hours = durationSeconds / 3600;

    return `${(totalKm / hours).toFixed(2)} km/h`;
  };
  
   
  const getBalootUsTotalFromScores = (scores: BalootScore[]) => {
    return scores.reduce((total, score) => {
      return total + Number(score.us || 0);
    }, 0);
  };

  const getBalootThemTotalFromScores = (scores: BalootScore[]) => {
    return scores.reduce((total, score) => {
      return total + Number(score.them || 0);
    }, 0);
  };

  const getBalootWinner = (usTotal: number, themTotal: number) => {
    const usName = balootUsName.trim() || 'Us';
    const themName = balootThemName.trim() || 'Them';

    if (usTotal >= 152 && usTotal > themTotal) {
      return usName;
    }

    if (themTotal >= 152 && themTotal > usTotal) {
      return themName;
    }

    if (usTotal >= 152 && themTotal >= 152 && usTotal === themTotal) {
      return 'Tie - play one more hand';
    }

    return 'Not finished yet';
  };

  const getBalootShareText = (scores: BalootScore[], usTotal: number, themTotal: number) => {
    const usName = balootUsName.trim() || 'Us';
    const themName = balootThemName.trim() || 'Them';
    const winner = getBalootWinner(usTotal, themTotal);

    return `Baloot result: ${usName} ${usTotal} - ${themName} ${themTotal}. Winner: ${winner}. Hands played: ${scores.length}.`;
  };

  const saveSession = async () => {
    if (!selectedActivity) {
  alert('Please choose an activity first');
  return;
}

if (!isSelectedActivityNonTimed(selectedActivity) && (!startTime || !endTime)) {
  alert('Please start and end the activity first');
  return;
}

    if (
      isFocusActivity(selectedActivity) &&
      studyCandleSeconds >= studyCandleDurationSeconds &&
      studyCandleAutoSaveStartedRef.current
    ) {
      alert('This candle session is already saved.');
      return;
    }

    if (selectedActivity === 'Gym' && gymWorkoutDay === '') {
      alert('Please choose workout day');
      return;
    }

    if (isLapActivity(selectedActivity) && lapDistance.trim() === '') {
      alert('Please enter lap distance');
      return;
    }

    if (isMatchActivity(selectedActivity)) {
      if (matchTeamOneName.trim() === '') {
        alert('Please enter Team 1 name');
        return;
      }

      if (matchTeamTwoName.trim() === '') {
        alert('Please enter Team 2 name');
        return;
      }
    }

    if (isWorkActivity(selectedActivity) && workProjectName.trim() === '') {
      alert('Please enter project name');
      return;
    }

    let finalGymExercises = gymExercises;

    if (selectedActivity === 'Gym') {
      const cleanExerciseName = gymExerciseName.trim();

      if (cleanExerciseName !== '' && currentGymSets.length > 0) {
        const unfinishedExercise: GymExercise = {
          id: Date.now(),
          name: cleanExerciseName,
          sets: currentGymSets,
        };

        finalGymExercises = [...gymExercises, unfinishedExercise];
      }
    }

    let finalMatchRounds = matchRounds;

    if (isMatchActivity(selectedActivity)) {
      const cleanTeamOneGames = matchTeamOneGames.trim();
      const cleanTeamTwoGames = matchTeamTwoGames.trim();

      if (cleanTeamOneGames !== '' && cleanTeamTwoGames !== '') {
        const teamOneGamesNumber = Number(cleanTeamOneGames);
        const teamTwoGamesNumber = Number(cleanTeamTwoGames);
        const unfinishedWinner =
          teamOneGamesNumber > teamTwoGamesNumber
            ? matchTeamOneName.trim() || 'Team 1'
            : teamTwoGamesNumber > teamOneGamesNumber
              ? matchTeamTwoName.trim() || 'Team 2'
              : 'Tie';

        const unfinishedRound: MatchRound = {
          id: Date.now(),
          setNumber: matchSetNumber.trim(),
          teamOneGames: cleanTeamOneGames,
          teamTwoGames: cleanTeamTwoGames,
          teamOnePoints: matchTeamOnePoints.trim(),
          teamTwoPoints: matchTeamTwoPoints.trim(),
          server: matchServer.trim(),
          tiebreakScore: matchTiebreakScore.trim(),
          winner: unfinishedWinner,
          teamOneWinners: matchTeamOneWinners.trim(),
          teamTwoWinners: matchTeamTwoWinners.trim(),
          teamOneErrors: matchTeamOneErrors.trim(),
          teamTwoErrors: matchTeamTwoErrors.trim(),
        };

        finalMatchRounds = [...matchRounds, unfinishedRound];
      }
    }

    let finalBalootScores = balootScores;

    if (isBalootActivity(selectedActivity)) {
      const cleanUsScore = balootUsScore.trim();
      const cleanThemScore = balootThemScore.trim();

      if (cleanUsScore !== '' && cleanThemScore !== '') {
        const unfinishedScore: BalootScore = {
          id: Date.now(),
          us: cleanUsScore,
          them: cleanThemScore,
        };

        finalBalootScores = [...balootScores, unfinishedScore];
      }
    }

    const newSession: Session = {
  id: Date.now(),
  activity: selectedActivity,
  start: isSelectedActivityNonTimed(selectedActivity)
    ? 'Not timed'
    : startTime!.toLocaleTimeString(),
  end: isSelectedActivityNonTimed(selectedActivity)
    ? 'Not timed'
    : endTime!.toLocaleTimeString(),
  duration: isSelectedActivityNonTimed(selectedActivity)
    ? 'Not timed'
    : getDuration(),
  durationSeconds: isSelectedActivityNonTimed(selectedActivity)
    ? 0
    : getDurationSeconds(),
  date: new Date().toLocaleDateString(),
};

    if (selectedActivity === 'Football') {
      newSession.details = {
        teamOneName: footballTeamOneName.trim(),
        teamTwoName: footballTeamTwoName.trim(),
        teamOneScore: footballTeamOneScore.trim(),
        teamTwoScore: footballTeamTwoScore.trim(),
      };
    }

    if (selectedActivity === 'Gym') {
      newSession.details = {
        gymWorkoutDay: gymWorkoutDay.trim(),
        gymCustomWorkout: gymCustomWorkout.trim(),
        gymExercises: finalGymExercises,
      };
    }

    if (isLapActivity(selectedActivity)) {
      newSession.details = {
        laps: lapCount,
        lapDistance: lapDistance.trim(),
        lapDistanceUnit: lapDistanceUnit,
        totalDistance: getTotalLapDistance(),
      };

      if (isMovementActivity(selectedActivity)) {
        newSession.details = {
          ...newSession.details,
          routeName: routeName.trim(),
          elevationGain: elevationGain.trim(),
          splits: splitNotes.trim(),
          goal: movementGoal.trim(),
          personalRecord: personalRecord.trim(),
          averagePace: getAveragePace(),
          averageSpeed: getAverageSpeed(),
        };
      }
    }

    if (isMatchActivity(selectedActivity)) {
      const teamOneTotal = finalMatchRounds.reduce((total, round) => {
        return total + Number(round.teamOneGames || 0);
      }, 0);

      const teamTwoTotal = finalMatchRounds.reduce((total, round) => {
        return total + Number(round.teamTwoGames || 0);
      }, 0);

      newSession.details = {
        matchTeamOneName: matchTeamOneName.trim(),
        matchTeamTwoName: matchTeamTwoName.trim(),
        matchRounds: finalMatchRounds,
        matchTeamOneTotal: teamOneTotal,
        matchTeamTwoTotal: teamTwoTotal,
      };
    }

    if (isBalootActivity(selectedActivity)) {
      const usTotal = getBalootUsTotalFromScores(finalBalootScores);
      const themTotal = getBalootThemTotalFromScores(finalBalootScores);

      newSession.details = {
        balootScores: finalBalootScores,
        balootUsName: balootUsName.trim(),
        balootThemName: balootThemName.trim(),
        balootUsTotal: usTotal,
        balootThemTotal: themTotal,
        balootWinner: getBalootWinner(usTotal, themTotal),
        balootDealerDirection: balootDealerDirection,
        balootShareText: getBalootShareText(finalBalootScores, usTotal, themTotal),
      };
    }

    if (isStudyingActivity(selectedActivity)) {
      newSession.details = {
        studying: {
          subject: studySubject.trim(),
          studyType: studyType.trim(),
          examDate: studyExamDate.trim(),
          coursework: studyCoursework.trim(),
          streak: studyStreak.trim(),
          totalStudyHours: studyTotalHours.trim(),
          candleSeconds: studyCandleSeconds,
          candleTime: formatStudyCandleElapsedTime(),
          notes: studyNotes.trim(),
        },
      };
    }

    if (isWorkActivity(selectedActivity)) {
      newSession.details = {
        work: {
          projectName: workProjectName.trim(),
          candleSeconds: studyCandleSeconds,
          candleTime: formatStudyCandleElapsedTime(),
          candleTargetSeconds: studyCandleDurationSeconds,
          candleTargetTime: formatStudyCandleDuration(studyCandleDurationSeconds),
          notes: workNotes.trim(),
        },
      };
    }

    if (isHorseRidingActivity(selectedActivity)) {
      newSession.details = {
        horseRiding: {
          logType: selectedActivity as 'Horse Riding' | 'Daily Care' | 'Supplies and Feed' | 'Riding Test',
          riderName: horseRiderName.trim(),
          horseName: horseName.trim(),
          trainingType: horseTrainingType.trim(),
          trainingIntensity: horseTrainingIntensity,
          trainingTime: horseTrainingTime.trim(),
          restDay: horseRestDay,
          walkingMinutes: horseWalkingMinutes.trim(),
          walkMinutes: horseWalkMinutes.trim(),
          trotMinutes: horseTrotMinutes.trim(),
          canterMinutes: horseCanterMinutes.trim(),
          rideDistance: horseRideDistance.trim(),
          averageSpeed: horseAverageSpeed.trim(),
          leftTurns: horseLeftTurns.trim(),
          rightTurns: horseRightTurns.trim(),
          rideDate: horseRideDate.trim(),
          calendarNote: horseCalendarNote.trim(),
          farrierVisit: horseFarrierVisit.trim(),
          nextFarrierVisit: horseNextFarrierVisit.trim(),
          safetyLocation: horseSafetyLocation.trim(),
          safetyContact: horseSafetyContact.trim(),

          hayGiven: horseHayGiven,
          waterChecked: horseWaterChecked,
          foodOilGiven: horseFoodOilGiven,
          shampooUsed: horseShampooUsed,
          padsCleaningSuppliesUsed: horsePadsCleaningSuppliesUsed,
          hoofOilUsed: horseHoofOilUsed,

          feedEntries: horseFeedEntries
            .map((feed) => ({
              amount: feed.amount.trim(),
              buyingDate: feed.buyingDate.trim(),
            }))
            .filter((feed) => feed.amount || feed.buyingDate),
          customCleaningSupplies: horseCustomCleaningSupplies
            .map((supply) => ({
              name: supply.name.trim(),
              buyingDate: supply.buyingDate.trim(),
            }))
            .filter((supply) => supply.name || supply.buyingDate),

          foodOilBuyingDate: horseFoodOilBuyingDate.trim(),
          shampooBuyingDate: horseShampooBuyingDate.trim(),
          padsCleaningSuppliesBuyingDate: horsePadsCleaningSuppliesBuyingDate.trim(),
          hoofOilBuyingDate: horseHoofOilBuyingDate.trim(),

          dressageTestDay: horseDressageTestDay,
          dressageTestName: horseDressageTestName.trim(),
          dressageScore: horseDressageScore.trim(),
          dressageNotes: horseDressageNotes.trim(),

          jumpingDay: horseJumpingDay,
          fenceHeight: horseFenceHeight.trim(),
          fenceCount: horseFenceCount.trim(),
          jumpingNotes: horseJumpingNotes.trim(),

          horseNotes: horseNotes.trim(),
        },
      };
    }
    if (isVehicleMaintenanceActivity(selectedActivity)) {
      newSession.details = {
    vehicleMaintenance: {
      vehicleName: vehicleName.trim(),
      plateNumber: vehiclePlateNumber.trim(),
      modelYear: vehicleModelYear.trim(),
      serviceType: vehicleServiceType.trim(),
      serviceDate: vehicleServiceDate.trim(),
      mileage: vehicleMileage.trim(),
      cost: vehicleCost.trim(),
      shopName: vehicleShopName.trim(),
      nextServiceDate: vehicleNextServiceDate.trim(),
      nextServiceMileage: vehicleNextServiceMileage.trim(),
      insuranceExpirationDate: vehicleInsuranceExpirationDate.trim(),
      registrationEndDate: vehicleRegistrationEndDate.trim(),
      notes: vehicleNotes.trim(),
    },
      };
    }

    if (isCustomActivity(selectedActivity)) {
      const customFields: CustomFieldValue[] = getCustomTemplateFields(selectedActivity).map((label) => ({
        label,
        value: customFieldValues[label]?.trim() || '',
      }));

      newSession.details = { customFields, customUsesTimer: customActivityUsesTimer };
    }

    if (isPersonalInfoActivity(selectedActivity)) {
      newSession.details = {
        personalInfo: {
          idNumberEnding: getSensitiveEnding(personalIdNumber),
          idExpirationDate: personalIdExpirationDate.trim(),
          drivingLicenseExpirationDate: personalDlExpirationDate.trim(),
          passportNumberEnding: getSensitiveEnding(personalPassportNumber),
          passportExpirationDate: personalPassportExpirationDate.trim(),
        },
      };
    }

    const expirationReminders = getExpirationReminders();

    if (expirationReminders.length > 0) {
      newSession.details = {
        ...newSession.details,
        expirationReminders,
      };
    }

    if (supportsReminders(selectedActivity) && (reminderDate.trim() || reminderTime.trim() || reminderNote.trim())) {
      newSession.details = {
        ...newSession.details,
        reminder: {
          date: reminderDate.trim(),
          time: reminderTime.trim(),
          note: reminderNote.trim(),
          notificationEnabled: reminderNotificationEnabled,
        },
      };
    }

    
    const newSessions = [newSession, ...sessions];

    setSessions(newSessions);
    await saveSessionsToStorage(newSessions);

    setSyncStatus('syncing');
    try {
      await saveCloudSession(newSession);
      setSyncStatus('saved');
    } catch {
      setSyncStatus('offline');
      alert('Saved on this device, but cloud sync failed.');
    }

    if (
      settings.notificationsEnabled
      || newSession.details?.reminder?.notificationEnabled
    ) {
      try {
        await scheduleSessionNotifications(
          selectedActivity,
          newSession.details?.reminder,
          newSession.details?.expirationReminders
        );
      } catch {
        // The record remains saved when notification permission is unavailable.
      }
    }

    await AsyncStorage.removeItem(`activity-draft:${authUserId ?? 'local'}`);
    setCurrentDraft(null);

    alert('Session saved successfully');

    setSelectedActivity(null);
    setStartTime(null);
    setEndTime(null);
    resetActivityFields();
  };

  const deleteSession = async (sessionId: number) => {
    const newSessions = sessions.filter((session) => session.id !== sessionId);

    try {
      await deleteCloudSession(sessionId);
      setSessions(newSessions);
      await saveSessionsToStorage(newSessions);
    } catch {
      alert(isArabic
        ? 'تعذر الحذف من السحابة. لم يتم حذف السجل، حاول مرة أخرى.'
        : 'Cloud delete failed. The session was not deleted; please try again.');
    }
  };

  const confirmDeleteSession = (sessionId: number) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSession(sessionId);
          },
        },
      ]
    );
  };

  const clearAllHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all saved sessions?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setSessions([]);
            await saveSessionsToStorage([]);

            try {
              await clearCloudSessions();
            } catch {
              alert('Cleared on this device, but cloud clear failed.');
            }
          },
        },
      ]
    );
  };

  const goBackToList = () => {
    setSelectedActivity(null);
    setStartTime(null);
    setEndTime(null);
    resetActivityFields();
  };
  const getTotalTime = () => {
    const totalSeconds = sessions.reduce((total, session) => {
      return total + (session.durationSeconds || 0);
    }, 0);

    return formatDuration(totalSeconds);
  };

  const getMostPracticedActivity = () => {
    if (sessions.length === 0) {
      return 'None yet';
    }

    const activityCounts: Record<string, number> = {};

    sessions.forEach((session) => {
      activityCounts[session.activity] = (activityCounts[session.activity] || 0) + 1;
    });

    let mostPracticed = sessions[0].activity;
    let highestCount = 0;

    Object.keys(activityCounts).forEach((activity) => {
      if (activityCounts[activity] > highestCount) {
        mostPracticed = activity;
        highestCount = activityCounts[activity];
      }
    });

    return `${mostPracticed} (${highestCount})`;
  };

  const getActivityGroup = (activity: string) => {
  if (!defaultActivities.includes(activity) && customActivityGroups[activity]) {
    return customActivityGroups[activity];
  }

  if (['Football', 'Padel', 'Tennis', 'Golf', 'Baloot'].includes(activity)) {
    return 'Sports and Games';
  }

  if (['Gym', 'Run', 'Cycling', 'Walking', 'Swimming'].includes(activity)) {
    return 'Fitness and Movement';
  }

  if (horseActivities.includes(activity)) {
    return 'Horse Activities';
  }

  if (activity === 'Studying' || activity === 'Work') {
    return 'Study and Work';
  }

  if (activity === 'Vehicle Maintenance') {
    return 'Vehicle and Maintenance';
  }

  if (activity === 'Personal Info') {
    return 'Life Tracking';
  }

  return 'Custom Activities';
};

const getGroupedActivities = () => {
  const groupOrder = [
    'Sports and Games',
    'Fitness and Movement',
    'Horse Activities',
    'Study and Work',
    'Life Tracking',
    'Vehicle and Maintenance',
    'Custom Activities',
  ];

  return groupOrder.map((groupName) => {
      const groupActivities = activities.filter(
        (activity) => getActivityGroup(activity) === groupName
      );

      return {
        groupName,
        groupActivities,
      };
    });
};

  const renderSessionDeleteAction = (sessionId: number) => {
    return (
      <TouchableOpacity
        style={styles.swipeDeleteAction}
        onPress={() => confirmDeleteSession(sessionId)}
      >
        <Text style={styles.swipeDeleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderSessionDetails = (session: Session) => {
    if (session.activity === 'Football' && session.details) {
      return (
        <View style={styles.savedDetailsBox}>
          <Text style={styles.savedDetailsText}>
            Team 1: {session.details.teamOneName || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Team 2: {session.details.teamTwoName || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Score: {session.details.teamOneScore || '0'} - {session.details.teamTwoScore || '0'}
          </Text>
        </View>
      );
    }

    if (session.activity === 'Gym' && session.details) {
      return (
        <View style={styles.savedDetailsBox}>
          <Text style={styles.savedDetailsText}>
            Workout Day: {session.details.gymWorkoutDay || 'Not filled'}
          </Text>

          {session.details.gymCustomWorkout ? (
            <Text style={styles.savedDetailsText}>
              Custom Workout: {session.details.gymCustomWorkout}
            </Text>
          ) : null}

          <Text style={styles.savedDetailsHeader}>Exercises:</Text>

          {!session.details.gymExercises || session.details.gymExercises.length === 0 ? (
            <Text style={styles.savedDetailsText}>No exercises saved</Text>
          ) : (
            session.details.gymExercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.savedExerciseBlock}>
                <Text style={styles.savedDetailsText}>
                  {index + 1}. {exercise.name}
                </Text>

                {exercise.sets.map((set, setIndex) => (
                  <Text key={set.id} style={styles.savedSetText}>
                    Set {setIndex + 1}: {set.weight ? `${set.weight} kg, ` : ''}{set.reps} reps
                  </Text>
                ))}
              </View>
            ))
          )}
        </View>
      );
    }

    if (isLapActivity(session.activity) && session.details) {
      return (
        <View style={styles.savedDetailsBox}>
          <Text style={styles.savedDetailsText}>
            Laps: {session.details.laps || 0}
          </Text>
          <Text style={styles.savedDetailsText}>
            Lap Distance: {session.details.lapDistance || '0'} {session.details.lapDistanceUnit || 'm'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Total Distance: {session.details.totalDistance || '0 m'}
          </Text>
          {isMovementActivity(session.activity) && (
            <>
              <Text style={styles.savedDetailsText}>
                Route: {session.details.routeName || 'Not filled'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Pace: {session.details.averagePace || 'Not calculated'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Speed: {session.details.averageSpeed || 'Not calculated'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Elevation: {session.details.elevationGain || 'Not filled'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Goal: {session.details.goal || 'Not filled'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Splits: {session.details.splits || 'Not filled'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Personal Record: {session.details.personalRecord || 'Not filled'}
              </Text>
            </>
          )}
        </View>
      );
    }

    if (isMatchActivity(session.activity) && session.details) {
      return (
        <View style={styles.savedDetailsBox}>
          <Text style={styles.savedDetailsText}>
            Team 1: {session.details.matchTeamOneName || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Team 2: {session.details.matchTeamTwoName || 'Not filled'}
          </Text>

          <Text style={styles.savedDetailsHeader}>Rounds:</Text>

          {!session.details.matchRounds || session.details.matchRounds.length === 0 ? (
            <Text style={styles.savedDetailsText}>No rounds saved</Text>
          ) : (
            session.details.matchRounds.map((round, index) => (
              <View key={round.id} style={styles.savedExerciseBlock}>
                <Text style={styles.savedDetailsText}>
                  Set {round.setNumber || index + 1}: {round.teamOneGames} - {round.teamTwoGames}
                </Text>
                <Text style={styles.savedSetText}>
                  Points: {round.teamOnePoints || '0'} - {round.teamTwoPoints || '0'}
                </Text>
                <Text style={styles.savedSetText}>
                  Server: {round.server || 'Not filled'}
                </Text>
                <Text style={styles.savedSetText}>
                  Winner: {round.winner || 'Not finished'}
                </Text>
                <Text style={styles.savedSetText}>
                  Tiebreak: {round.tiebreakScore || 'None'}
                </Text>
                <Text style={styles.savedSetText}>
                  Winners: {round.teamOneWinners || '0'} - {round.teamTwoWinners || '0'}
                </Text>
                <Text style={styles.savedSetText}>
                  Errors: {round.teamOneErrors || '0'} - {round.teamTwoErrors || '0'}
                </Text>
              </View>
            ))
          )}

          <Text style={styles.savedDetailsHeader}>Total Games:</Text>
          <Text style={styles.savedDetailsText}>
            {session.details.matchTeamOneName || 'Team 1'}: {session.details.matchTeamOneTotal || 0}
          </Text>
          <Text style={styles.savedDetailsText}>
            {session.details.matchTeamTwoName || 'Team 2'}: {session.details.matchTeamTwoTotal || 0}
          </Text>
        </View>
      );
    }

    if (isBalootActivity(session.activity) && session.details) {
      const usName = session.details.balootUsName || 'Us';
      const themName = session.details.balootThemName || 'Them';

      return (
        <View style={styles.savedDetailsBox}>
          <Text style={styles.savedDetailsHeader}>Baloot Total:</Text>
          <Text style={styles.savedDetailsText}>
            {usName}: {session.details.balootUsTotal || 0}
          </Text>
          <Text style={styles.savedDetailsText}>
            {themName}: {session.details.balootThemTotal || 0}
          </Text>
          <Text style={styles.savedDetailsText}>
            Winner: {session.details.balootWinner || 'Not finished yet'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Dealer Direction: {session.details.balootDealerDirection || '↑'}
          </Text>

          <Text style={styles.savedDetailsHeader}>Hands:</Text>

          {!session.details.balootScores || session.details.balootScores.length === 0 ? (
            <Text style={styles.savedDetailsText}>No scores saved</Text>
          ) : (
            session.details.balootScores.map((score, index) => (
              <Text key={score.id} style={styles.savedDetailsText}>
                Hand {index + 1}: {usName} {score.us} - {themName} {score.them}
              </Text>
            ))
          )}

          <Text style={styles.savedDetailsHeader}>Share Result:</Text>
          <Text style={styles.savedDetailsText}>
            {session.details.balootShareText || 'No share summary saved'}
          </Text>
        </View>
      );
    }

    if (session.activity === 'Studying' && session.details?.studying) {
      const study = session.details.studying;

      return (
        <View style={styles.savedDetailsBox}>
          <Text style={styles.savedDetailsHeader}>Studying:</Text>
          <Text style={styles.savedDetailsText}>
            Subject: {study.subject || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Type: {study.studyType || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Exam Date: {study.examDate || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Coursework: {study.coursework || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Streak: {study.streak || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Total Study Hours: {study.totalStudyHours || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Candle Timer: {study.candleTime || '00:00:00'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Notes: {study.notes || 'None'}
          </Text>
        </View>
      );
    }

    if (session.activity === 'Work' && session.details?.work) {
      const work = session.details.work;

      return (
        <View style={styles.savedDetailsBox}>
          <Text style={styles.savedDetailsHeader}>Work:</Text>
          <Text style={styles.savedDetailsText}>
            Project: {work.projectName || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Set Time: {work.candleTargetTime || 'Not set'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Candle Timer: {work.candleTime || '00:00:00'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Notes: {work.notes || 'None'}
          </Text>
        </View>
      );
    }

    if (isHorseRidingActivity(session.activity) && session.details?.horseRiding) {
      const horse = session.details.horseRiding;

      return (
        <View style={styles.savedDetailsBox}>
          <Text style={styles.savedDetailsHeader}>Horse Riding:</Text>

          <Text style={styles.savedDetailsText}>
            Rider: {horse.riderName || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Horse: {horse.horseName || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Training: {horse.trainingType || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Intensity: {horse.trainingIntensity || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Training Time: {horse.trainingTime || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Rest Day: {horse.restDay ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Walking Minutes: {horse.walkingMinutes || '0'}
          </Text>

          <Text style={styles.savedDetailsHeader}>Gait Tracking:</Text>
          <Text style={styles.savedDetailsText}>
            Walk: {horse.walkMinutes || '0'} min
          </Text>
          <Text style={styles.savedDetailsText}>
            Trot: {horse.trotMinutes || '0'} min
          </Text>
          <Text style={styles.savedDetailsText}>
            Canter: {horse.canterMinutes || '0'} min
          </Text>
          <Text style={styles.savedDetailsText}>
            Distance: {horse.rideDistance || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Average Speed: {horse.averageSpeed || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Turns: Left {horse.leftTurns || '0'} / Right {horse.rightTurns || '0'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Ride Date: {horse.rideDate || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Calendar Note: {horse.calendarNote || 'None'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Farrier Visit: {horse.farrierVisit || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Next Farrier Visit: {horse.nextFarrierVisit || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Safety Location: {horse.safetyLocation || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Safety Contact: {horse.safetyContact || 'Not filled'}
          </Text>

          <Text style={styles.savedDetailsHeader}>Daily Care:</Text>
          <Text style={styles.savedDetailsText}>Hay: {horse.hayGiven ? 'Yes' : 'No'}</Text>
          <Text style={styles.savedDetailsText}>Water: {horse.waterChecked ? 'Yes' : 'No'}</Text>
          <Text style={styles.savedDetailsText}>Food Oil: {horse.foodOilGiven ? 'Yes' : 'No'}</Text>
          <Text style={styles.savedDetailsText}>
            Food Oil Bought: {horse.foodOilBuyingDate || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>Hoof Oil: {horse.hoofOilUsed ? 'Yes' : 'No'}</Text>
          <Text style={styles.savedDetailsText}>
            Hoof Oil Bought: {horse.hoofOilBuyingDate || 'Not filled'}
          </Text>

          <Text style={styles.savedDetailsHeader}>Cleaning:</Text>
          <Text style={styles.savedDetailsText}>Shampoo: {horse.shampooUsed ? 'Yes' : 'No'}</Text>
          <Text style={styles.savedDetailsText}>
            Shampoo Bought: {horse.shampooBuyingDate || 'Not filled'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Pads Cleaning Supplies: {horse.padsCleaningSuppliesUsed ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.savedDetailsText}>
            Pads Supplies Bought: {horse.padsCleaningSuppliesBuyingDate || 'Not filled'}
          </Text>

          {horse.customCleaningSupplies?.map((supply, index) => (
            <View key={`saved-cleaning-supply-${index}`}>
              <Text style={styles.savedDetailsText}>
                Additional Supply {index + 1}: {supply.name || 'Not filled'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Bought: {supply.buyingDate || 'Not filled'}
              </Text>
            </View>
          ))}

          <Text style={styles.savedDetailsHeader}>Feed:</Text>
          {horse.feedEntries?.length ? (
            horse.feedEntries.map((feed, index) => (
              <View key={`saved-feed-${index}`}>
                <Text style={styles.savedDetailsText}>
                  Feed {index + 1} Amount: {feed.amount || 'Not filled'}
                </Text>
                <Text style={styles.savedDetailsText}>
                  Feed {index + 1} Bought: {feed.buyingDate || 'Not filled'}
                </Text>
              </View>
            ))
          ) : (
            <>
              <Text style={styles.savedDetailsText}>
                Re-Leve: {horse.releveAmount || 'Not filled'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Re-Leve Bought: {horse.releveBuyingDate || 'Not filled'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Equi Jewel: {horse.equiJewelAmount || 'Not filled'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Equi Jewel Bought: {horse.equiJewelBuyingDate || 'Not filled'}
              </Text>
            </>
          )}

          <Text style={styles.savedDetailsHeader}>Dressage:</Text>
          <Text style={styles.savedDetailsText}>
            Test Day: {horse.dressageTestDay ? 'Yes' : 'No'}
          </Text>

          {horse.dressageTestDay && (
            <>
              <Text style={styles.savedDetailsText}>
                Test Name: {horse.dressageTestName || 'Not filled'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Score: {horse.dressageScore || '0'}%
              </Text>
              <Text style={styles.savedDetailsText}>
                Notes: {horse.dressageNotes || 'None'}
              </Text>
            </>
          )}

          <Text style={styles.savedDetailsHeader}>Jumping:</Text>
          <Text style={styles.savedDetailsText}>
            Jumping Day: {horse.jumpingDay ? 'Yes' : 'No'}
          </Text>

          {horse.jumpingDay && (
            <>
              <Text style={styles.savedDetailsText}>
                Fence Height: {horse.fenceHeight || 'Not filled'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Fence Count: {horse.fenceCount || '0'}
              </Text>
              <Text style={styles.savedDetailsText}>
                Notes: {horse.jumpingNotes || 'None'}
              </Text>
            </>
          )}

          <Text style={styles.savedDetailsHeader}>Notes:</Text>
          <Text style={styles.savedDetailsText}>
            {horse.horseNotes || 'None'}
          </Text>
        </View>
      );
    }
    if (isVehicleMaintenanceActivity(session.activity) && session.details?.vehicleMaintenance) {
  const vehicle = session.details.vehicleMaintenance;

  return (
    <View style={styles.savedDetailsBox}>
      <Text style={styles.savedDetailsHeader}>Vehicle Maintenance:</Text>

      <Text style={styles.savedDetailsText}>
        Vehicle: {vehicle.vehicleName || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Plate: {vehicle.plateNumber || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Model / Year: {vehicle.modelYear || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Service: {vehicle.serviceType || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Service Date: {vehicle.serviceDate || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Mileage: {vehicle.mileage || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Cost: {vehicle.cost || '0'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Shop / Place: {vehicle.shopName || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsHeader}>Upcoming:</Text>

      <Text style={styles.savedDetailsText}>
        Next Service Date: {vehicle.nextServiceDate || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Next Service Mileage: {vehicle.nextServiceMileage || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Insurance Expiration: {vehicle.insuranceExpirationDate || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Registration End Date: {vehicle.registrationEndDate || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Notes: {vehicle.notes || 'None'}
      </Text>
    </View>
  );
}

    if (isCustomActivity(session.activity) && session.details?.customFields) {
      return (
        <View style={styles.savedDetailsBox}>
          <Text style={styles.savedDetailsHeader}>Custom Details:</Text>
          <Text style={styles.savedDetailsText}>
            Timer: {session.details.customUsesTimer ? 'Used' : 'Not used'}
          </Text>
          {session.details.customFields.map((field, index) => (
            <Text key={`${field.label}-${index}`} style={styles.savedDetailsText}>
              {field.label}: {field.value || 'Not filled'}
            </Text>
          ))}
        </View>
      );
    }

    return null;
  };
  if (isAuthLoading) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.loginContainer}>
          {renderBrand()}
          <Text style={[styles.loginSubtitle, isArabic && styles.rtlText]}>
            {isArabic ? 'جارٍ استعادة حسابك الآمن...' : 'Restoring your secure account...'}
          </Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  if (isLoggedIn && settings.appLockEnabled && !isAppUnlocked) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.lockScreen}>
          {renderBrand()}
          <Ionicons name="lock-closed-outline" size={42} color="#050505" />
          <Text style={styles.lockTitle}>{isArabic ? 'تفاصيلي مقفل' : 'Tafasili is locked'}</Text>
          <TouchableOpacity style={styles.lockButton} onPress={unlockApp}>
            <Text style={styles.lockButtonText}>{isArabic ? 'فتح بالبصمة' : 'Unlock with Face ID / device lock'}</Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    );
  }

  if (!isLoggedIn) {
    const isSignupMode = authMode === 'signup';

    return (
    <GestureHandlerRootView style={styles.root}>
      <ScrollView contentContainerStyle={styles.loginContainer}>
        <View style={styles.authTopbar}>
          <View style={styles.topbarSpacer} />
          {renderBrand()}
          <TouchableOpacity
            style={styles.languageButton}
            onPress={toggleLanguage}
            accessibilityRole="button"
            accessibilityLabel={isArabic ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
          >
            <Text style={styles.languageButtonText}>{isArabic ? 'EN' : 'AR'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.loginTagline, isArabic && styles.rtlText]}>
          {isArabic ? 'كل تفاصيلك في مكان واحد' : 'Your life, Organized.'}
        </Text>
        <Text style={[styles.loginSubtitle, isArabic && styles.rtlText]}>
          {isSignupMode
            ? isArabic ? 'أنشئ حسابك' : 'Create your account'
            : isArabic ? 'سجل الدخول لمتابعة نشاطاتك' : 'Sign in to track your activities'}
        </Text>

        <View style={styles.authModeRow}>
          <TouchableOpacity
            style={[
              styles.authModeButton,
              authMode === 'signin' && styles.authModeButtonActive,
            ]}
            onPress={() => setAuthMode('signin')}
          >
            <Text style={styles.authModeText}>{isArabic ? 'تسجيل الدخول' : 'Sign In'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.authModeButton,
              authMode === 'signup' && styles.authModeButtonActive,
            ]}
            onPress={() => setAuthMode('signup')}
          >
            <Text style={styles.authModeText}>{isArabic ? 'إنشاء حساب' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder={isArabic ? 'البريد الإلكتروني' : 'Email'}
          placeholderTextColor="#050505"
          value={loginUsername}
          onChangeText={(value) => setLoginUsername(value.replace(/\s/g, ''))}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <View style={styles.passwordInputRow}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder={isSignupMode
              ? isArabic ? 'كلمة مرور جديدة' : 'New password'
              : isArabic ? 'كلمة المرور' : 'Password'}
            placeholderTextColor="#050505"
            value={loginPassword}
            onChangeText={setLoginPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={isSignupMode ? 'new-password' : 'current-password'}
            textContentType={isSignupMode ? 'newPassword' : 'password'}
            secureTextEntry={!showLoginPassword}
          />
          <TouchableOpacity
            style={styles.passwordVisibilityButton}
            onPress={() => setShowLoginPassword((isVisible) => !isVisible)}
            accessibilityRole="button"
            accessibilityLabel={showLoginPassword
              ? isArabic ? 'إخفاء كلمة المرور' : 'Hide password'
              : isArabic ? 'إظهار كلمة المرور' : 'Show password'}
          >
            <Text style={styles.passwordVisibilityText}>
              {showLoginPassword
                ? isArabic ? 'إخفاء' : 'Hide'
                : isArabic ? 'إظهار' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {isSignupMode && (
          <>
            <View style={styles.passwordInputRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder={isArabic ? 'تأكيد كلمة المرور' : 'Confirm password'}
                placeholderTextColor="#050505"
                value={signupRepeatPassword}
                onChangeText={setSignupRepeatPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                secureTextEntry={!showRepeatPassword}
              />
              <TouchableOpacity
                style={styles.passwordVisibilityButton}
                onPress={() => setShowRepeatPassword((isVisible) => !isVisible)}
                accessibilityRole="button"
                accessibilityLabel={showRepeatPassword
                  ? isArabic ? 'إخفاء تأكيد كلمة المرور' : 'Hide confirmed password'
                  : isArabic ? 'إظهار تأكيد كلمة المرور' : 'Show confirmed password'}
              >
                <Text style={styles.passwordVisibilityText}>
                  {showRepeatPassword
                    ? isArabic ? 'إخفاء' : 'Hide'
                    : isArabic ? 'إظهار' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.signupHelp}>
              {isArabic ? 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.' : 'Password must be at least 8 characters.'}
            </Text>
          </>
        )}

        <TouchableOpacity
          style={[styles.startButton, styles.authSubmitButton]}
          onPress={isSignupMode ? signup : login}
        >
          <Text style={styles.authSubmitText}>
            {isSignupMode
              ? isArabic ? 'إنشاء حساب' : 'Sign Up'
              : isArabic ? 'تسجيل الدخول' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {!isSignupMode && (
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={forgotPassword}>
            <Text style={styles.forgotPasswordText}>
              {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.secondaryAuthButton}
          onPress={() => alert('Face ID / passkey can be connected later')}
        >
          <Text style={styles.secondaryAuthButtonText}>
            {isArabic ? 'Face ID / مفتاح المرور' : 'Face ID / Passkey'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.signupDivider}>{isArabic ? 'أو' : 'Or'}</Text>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() =>
            alert(isSignupMode ? 'Apple sign-up can be connected later' : 'Apple login can be connected later')
          }
        >
          <Text style={styles.socialButtonText}>
            {isSignupMode
              ? isArabic ? 'إنشاء حساب باستخدام Apple' : 'Sign up with Apple'
              : isArabic ? 'تسجيل الدخول باستخدام Apple' : 'Log in with Apple'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() =>
            alert(isSignupMode ? 'Facebook sign-up can be connected later' : 'Facebook login can be connected later')
          }
        >
          <Text style={styles.socialButtonText}>
            {isSignupMode
              ? isArabic ? 'إنشاء حساب باستخدام Facebook' : 'Sign up with Facebook'
              : isArabic ? 'تسجيل الدخول باستخدام Facebook' : 'Log in with Facebook'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
  if (selectedActivity) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <ScrollView style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToList}
            accessibilityRole="button"
            accessibilityLabel={isArabic ? 'رجوع' : 'Back'}
          >
            <Ionicons name={isArabic ? 'arrow-forward' : 'arrow-back'} size={27} color="#050505" />
          </TouchableOpacity>

          <Text style={[styles.title, isArabic && styles.rtlText]}>
            {activityDisplayName(selectedActivity)}
          </Text>
          <Text style={[styles.subtitle, isArabic && styles.rtlText]}>
            {isFocusActivity(selectedActivity)
              ? isArabic
                ? 'حدد التفاصيل واستخدم مؤقت الشمعة'
                : 'Set the details and use the candle timer'
              : isCustomActivity(selectedActivity)
                ? isArabic
                  ? 'أدخل التفاصيل واحفظها. استخدام المؤقت اختياري.'
                  : 'Enter the details and save. The timer is optional.'
                : isArabic
                  ? 'سجل تفاصيل نشاطك'
                  : 'Track your activity session'}
          </Text>
          {!isSelectedActivityNonTimed(selectedActivity) && !isFocusActivity(selectedActivity) && (
          <TouchableOpacity style={[styles.startButton, styles.timerActionButton]} onPress={startActivity}>
          <Text style={styles.timerActionText}>{isArabic ? 'بدء النشاط' : 'Start Activity'}</Text>
        </TouchableOpacity>
)}

          {isPersonalInfoActivity(selectedActivity) && (
            <View style={styles.infoBox}>
              <Text style={styles.savedDetailsHeader}>Personal Info</Text>
              <Text style={styles.candleHint}>
                For privacy, only the last four characters of document numbers are saved.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="ID number"
                placeholderTextColor="#050505"
                value={personalIdNumber}
                onChangeText={setPersonalIdNumber}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="ID expiration date (YYYY-MM-DD)"
                placeholderTextColor="#050505"
                value={personalIdExpirationDate}
                onChangeText={setPersonalIdExpirationDate}
              />
              <TextInput
                style={styles.input}
                placeholder="Driving license expiration date (YYYY-MM-DD)"
                placeholderTextColor="#050505"
                value={personalDlExpirationDate}
                onChangeText={setPersonalDlExpirationDate}
              />
              <TextInput
                style={styles.input}
                placeholder="Passport number"
                placeholderTextColor="#050505"
                value={personalPassportNumber}
                onChangeText={setPersonalPassportNumber}
                secureTextEntry
                autoCapitalize="characters"
              />
              <TextInput
                style={styles.input}
                placeholder="Passport expiration date (YYYY-MM-DD)"
                placeholderTextColor="#050505"
                value={personalPassportExpirationDate}
                onChangeText={setPersonalPassportExpirationDate}
              />
            </View>
          )}

          {isCustomActivity(selectedActivity) && (
            <View style={styles.infoBox}>
              <View style={styles.customTimerRow}>
                <View style={styles.customTimerCopy}>
                  <Text style={[styles.savedDetailsHeader, isArabic && styles.rtlText]}>
                    {isArabic ? 'استخدام المؤقت' : 'Use timer'}
                  </Text>
                  <Text style={[styles.candleHint, isArabic && styles.rtlText]}>
                    {isArabic ? 'اختياري. يمكنك حفظ النشاط بدون وقت.' : 'Optional. You can save this activity without timing it.'}
                  </Text>
                </View>
                <Switch
                  value={customActivityUsesTimer}
                  onValueChange={(enabled) => {
                    setCustomActivityUsesTimer(enabled);
                    if (!enabled) {
                      setStartTime(null);
                      setEndTime(null);
                    }
                  }}
                />
              </View>
              {getCustomTemplateFields(selectedActivity).length > 0 && (
                <>
                  <Text style={[styles.savedDetailsHeader, isArabic && styles.rtlText]}>
                    {isArabic ? 'تفاصيل مخصصة' : 'Custom Details'}
                  </Text>
                  {getCustomTemplateFields(selectedActivity).map((field) => (
                    <TextInput
                      key={field}
                      style={styles.input}
                      placeholder={field}
                      placeholderTextColor="#050505"
                      value={customFieldValues[field] || ''}
                      onChangeText={(value) =>
                        setCustomFieldValues((currentValues) => ({
                          ...currentValues,
                          [field]: value,
                        }))
                      }
                      multiline={field.toLowerCase().includes('note')}
                    />
                  ))}
                </>
              )}
            </View>
          )}

          <FootballTracker
  selectedActivity={selectedActivity}
  footballTeamOneName={footballTeamOneName}
  setFootballTeamOneName={setFootballTeamOneName}
  footballTeamTwoName={footballTeamTwoName}
  setFootballTeamTwoName={setFootballTeamTwoName}
  footballTeamOneScore={footballTeamOneScore}
  setFootballTeamOneScore={setFootballTeamOneScore}
  footballTeamTwoScore={footballTeamTwoScore}
  setFootballTeamTwoScore={setFootballTeamTwoScore}
/>

          <GymTracker
  selectedActivity={selectedActivity}
  isArabic={isArabic}
  gymWorkoutDay={gymWorkoutDay}
  setGymWorkoutDay={setGymWorkoutDay}
  gymCustomWorkout={gymCustomWorkout}
  setGymCustomWorkout={setGymCustomWorkout}
  gymExerciseName={gymExerciseName}
  setGymExerciseName={setGymExerciseName}
  gymExerciseOptions={[...new Map(
    [...sessions.flatMap((session) => session.activity === 'Gym' ? session.details?.gymExercises ?? [] : []), ...gymExercises]
      .filter((exercise) => exercise.name.trim())
      .map((exercise) => [exercise.name.trim().toLowerCase(), exercise.name.trim()])
  ).values()].sort((a, b) => a.localeCompare(b))}
  gymSetReps={gymSetReps}
  setGymSetReps={setGymSetReps}
  gymSetWeight={gymSetWeight}
  setGymSetWeight={setGymSetWeight}
  currentGymSets={currentGymSets}
  setCurrentGymSets={setCurrentGymSets}
  gymExercises={gymExercises}
  setGymExercises={setGymExercises}
/>
<LapTracker
  selectedActivity={selectedActivity}
  lapCount={lapCount}
  setLapCount={setLapCount}
  lapDistance={lapDistance}
  setLapDistance={setLapDistance}
  lapDistanceUnit={lapDistanceUnit}
  setLapDistanceUnit={setLapDistanceUnit}
  routeName={routeName}
  setRouteName={setRouteName}
  elevationGain={elevationGain}
  setElevationGain={setElevationGain}
  splitNotes={splitNotes}
  setSplitNotes={setSplitNotes}
  movementGoal={movementGoal}
  setMovementGoal={setMovementGoal}
  personalRecord={personalRecord}
  setPersonalRecord={setPersonalRecord}
  startTime={startTime}
  endTime={endTime}
/>
<MatchTracker
  selectedActivity={selectedActivity}
  matchTeamOneName={matchTeamOneName}
  setMatchTeamOneName={setMatchTeamOneName}
  matchTeamTwoName={matchTeamTwoName}
  setMatchTeamTwoName={setMatchTeamTwoName}
  matchSetNumber={matchSetNumber}
  setMatchSetNumber={setMatchSetNumber}
  matchTeamOneGames={matchTeamOneGames}
  setMatchTeamOneGames={setMatchTeamOneGames}
  matchTeamTwoGames={matchTeamTwoGames}
  setMatchTeamTwoGames={setMatchTeamTwoGames}
  matchTeamOnePoints={matchTeamOnePoints}
  setMatchTeamOnePoints={setMatchTeamOnePoints}
  matchTeamTwoPoints={matchTeamTwoPoints}
  setMatchTeamTwoPoints={setMatchTeamTwoPoints}
  matchServer={matchServer}
  setMatchServer={setMatchServer}
  matchTiebreakScore={matchTiebreakScore}
  setMatchTiebreakScore={setMatchTiebreakScore}
  matchTeamOneWinners={matchTeamOneWinners}
  setMatchTeamOneWinners={setMatchTeamOneWinners}
  matchTeamTwoWinners={matchTeamTwoWinners}
  setMatchTeamTwoWinners={setMatchTeamTwoWinners}
  matchTeamOneErrors={matchTeamOneErrors}
  setMatchTeamOneErrors={setMatchTeamOneErrors}
  matchTeamTwoErrors={matchTeamTwoErrors}
  setMatchTeamTwoErrors={setMatchTeamTwoErrors}
  matchRounds={matchRounds}
  setMatchRounds={setMatchRounds}
/>          
<BalootTracker
  selectedActivity={selectedActivity}
  balootUsName={balootUsName}
  setBalootUsName={setBalootUsName}
  balootThemName={balootThemName}
  setBalootThemName={setBalootThemName}
  balootUsScore={balootUsScore}
  setBalootUsScore={setBalootUsScore}
  balootThemScore={balootThemScore}
  setBalootThemScore={setBalootThemScore}
  balootScores={balootScores}
  setBalootScores={setBalootScores}
  balootDealerDirection={balootDealerDirection}
  setBalootDealerDirection={setBalootDealerDirection}
/>

{isStudyingActivity(selectedActivity) && (
  <View style={styles.infoBox}>
    <Text style={styles.savedDetailsHeader}>Study Focus</Text>

    <TextInput
      style={styles.input}
      placeholder="Subject, example: Math"
      placeholderTextColor="#050505"
      value={studySubject}
      onChangeText={setStudySubject}
    />

    <TextInput
      style={styles.input}
      placeholder="Study type, example: Exam, coursework, review"
      placeholderTextColor="#050505"
      value={studyType}
      onChangeText={setStudyType}
    />

    <TextInput
      style={styles.input}
      placeholder="Exam date, example: 20/08/2026"
      placeholderTextColor="#050505"
      value={studyExamDate}
      onChangeText={setStudyExamDate}
    />

    <TextInput
      style={styles.input}
      placeholder="Coursework, example: Chapter 4 assignment"
      placeholderTextColor="#050505"
      value={studyCoursework}
      onChangeText={setStudyCoursework}
    />

    <TextInput
      style={styles.input}
      placeholder="Study streak, example: 5 days"
      placeholderTextColor="#050505"
      value={studyStreak}
      onChangeText={setStudyStreak}
    />

    <TextInput
      style={styles.input}
      placeholder="Total study hours"
      placeholderTextColor="#050505"
      value={studyTotalHours}
      onChangeText={setStudyTotalHours}
      keyboardType="decimal-pad"
    />

    <View style={styles.candleBox}>
      <View style={styles.candleVisual}>
        {studyCandleSeconds < studyCandleDurationSeconds && (
          <View style={[styles.candleFlame, isStudyCandleRunning && styles.candleFlameActive]}>
            <View style={styles.candleFlameCore} />
          </View>
        )}
        <View
          style={[
            styles.candleBody,
            {
              height: Math.max(
                3,
                82 * (1 - studyCandleSeconds / Math.max(1, studyCandleDurationSeconds))
              ),
            },
          ]}
        >
          {studyCandleSeconds < studyCandleDurationSeconds && (
            <>
              <View style={styles.candleWick} />
              <View style={styles.candleWaxLip} />
              <View style={styles.candleWaxDrip} />
            </>
          )}
        </View>
      </View>
      <Text style={styles.candleTime}>{formatStudyCandleRemainingTime()}</Text>
      <Text style={styles.candleHint}>Three-hour study focus</Text>
      <View style={styles.candleProgressTrack}>
        <View
          style={[
            styles.candleProgressFill,
            { width: `${Math.min(100, (studyCandleSeconds / Math.max(1, studyCandleDurationSeconds)) * 100)}%` },
          ]}
        />
      </View>
    </View>

    <View style={styles.candleButtonRow}>
      <TouchableOpacity style={styles.candleButton} onPress={startStudyCandle}>
        <Text style={styles.smallActionText}>Start</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.candleButton} onPress={pauseStudyCandle}>
        <Text style={styles.smallActionText}>Pause</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.candleButton} onPress={stopStudyCandle}>
        <Text style={styles.smallActionText}>Stop</Text>
      </TouchableOpacity>
    </View>

    <TextInput
      style={styles.input}
      placeholder="Study notes"
      placeholderTextColor="#050505"
      value={studyNotes}
      onChangeText={setStudyNotes}
      multiline
    />
  </View>
)}

{isWorkActivity(selectedActivity) && (
  <View style={styles.infoBox}>
    <Text style={styles.savedDetailsHeader}>{isArabic ? 'العمل' : 'Work'}</Text>

    <TextInput
      style={styles.input}
      placeholder={isArabic ? 'اسم المشروع' : 'Project name'}
      placeholderTextColor="#050505"
      value={workProjectName}
      onChangeText={setWorkProjectName}
    />

    <View style={styles.candleTimeSettingRow}>
      <View style={styles.candleTimeSettingField}>
        <Text style={styles.candleTimeSettingLabel}>{isArabic ? 'الساعات' : 'Hours'}</Text>
        <TextInput
          style={[styles.input, styles.candleTimeSettingInput]}
          placeholder="0"
          placeholderTextColor="#050505"
          value={workCandleHours}
          onChangeText={setWorkCandleHours}
          keyboardType="number-pad"
          editable={!isStudyCandleRunning && studyCandleSeconds === 0}
        />
      </View>
      <View style={styles.candleTimeSettingField}>
        <Text style={styles.candleTimeSettingLabel}>{isArabic ? 'الدقائق' : 'Minutes'}</Text>
        <TextInput
          style={[styles.input, styles.candleTimeSettingInput]}
          placeholder="0"
          placeholderTextColor="#050505"
          value={workCandleMinutes}
          onChangeText={setWorkCandleMinutes}
          keyboardType="number-pad"
          editable={!isStudyCandleRunning && studyCandleSeconds === 0}
        />
      </View>
    </View>

    <View style={styles.candleBox}>
      <View style={styles.candleVisual}>
        {studyCandleSeconds < studyCandleDurationSeconds && (
          <View style={[styles.candleFlame, isStudyCandleRunning && styles.candleFlameActive]}>
            <View style={styles.candleFlameCore} />
          </View>
        )}
        <View
          style={[
            styles.candleBody,
            {
              height: Math.max(
                3,
                82 * (1 - studyCandleSeconds / Math.max(1, studyCandleDurationSeconds))
              ),
            },
          ]}
        >
          {studyCandleSeconds < studyCandleDurationSeconds && (
            <>
              <View style={styles.candleWick} />
              <View style={styles.candleWaxLip} />
              <View style={styles.candleWaxDrip} />
            </>
          )}
        </View>
      </View>
      <Text style={styles.candleTime}>{formatStudyCandleRemainingTime()}</Text>
      <Text style={styles.candleHint}>
        {isArabic ? 'حدد وقت العمل ثم ابدأ الشمعة' : 'Set the work time, then start the candle'}
      </Text>
      <View style={styles.candleProgressTrack}>
        <View
          style={[
            styles.candleProgressFill,
            { width: `${Math.min(100, (studyCandleSeconds / Math.max(1, studyCandleDurationSeconds)) * 100)}%` },
          ]}
        />
      </View>
    </View>

    <View style={styles.candleButtonRow}>
      <TouchableOpacity style={styles.candleButton} onPress={startStudyCandle}>
        <Text style={styles.smallActionText}>{isArabic ? 'بدء' : 'Start'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.candleButton} onPress={pauseStudyCandle}>
        <Text style={styles.smallActionText}>{isArabic ? 'إيقاف مؤقت' : 'Pause'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.candleButton} onPress={stopStudyCandle}>
        <Text style={styles.smallActionText}>{isArabic ? 'إيقاف' : 'Stop'}</Text>
      </TouchableOpacity>
    </View>

    <TextInput
      style={styles.input}
      placeholder={isArabic ? 'ملاحظات العمل' : 'Work notes'}
      placeholderTextColor="#050505"
      value={workNotes}
      onChangeText={setWorkNotes}
      multiline
    />
  </View>
)}
          
          <HorseRidingTracker
  selectedActivity={selectedActivity}
  horseRiderName={horseRiderName}
  setHorseRiderName={setHorseRiderName}
  horseName={horseName}
  setHorseName={setHorseName}
  horseTrainingType={horseTrainingType}
  setHorseTrainingType={setHorseTrainingType}
  horseTrainingIntensity={horseTrainingIntensity}
  setHorseTrainingIntensity={setHorseTrainingIntensity}
  horseTrainingTime={horseTrainingTime}
  setHorseTrainingTime={setHorseTrainingTime}
  horseRestDay={horseRestDay}
  setHorseRestDay={setHorseRestDay}
  horseWalkingMinutes={horseWalkingMinutes}
  setHorseWalkingMinutes={setHorseWalkingMinutes}
  horseWalkMinutes={horseWalkMinutes}
  setHorseWalkMinutes={setHorseWalkMinutes}
  horseTrotMinutes={horseTrotMinutes}
  setHorseTrotMinutes={setHorseTrotMinutes}
  horseCanterMinutes={horseCanterMinutes}
  setHorseCanterMinutes={setHorseCanterMinutes}
  horseRideDistance={horseRideDistance}
  setHorseRideDistance={setHorseRideDistance}
  horseAverageSpeed={horseAverageSpeed}
  setHorseAverageSpeed={setHorseAverageSpeed}
  horseLeftTurns={horseLeftTurns}
  setHorseLeftTurns={setHorseLeftTurns}
  horseRightTurns={horseRightTurns}
  setHorseRightTurns={setHorseRightTurns}
  horseRideDate={horseRideDate}
  setHorseRideDate={setHorseRideDate}
  horseCalendarNote={horseCalendarNote}
  setHorseCalendarNote={setHorseCalendarNote}
  horseFarrierVisit={horseFarrierVisit}
  setHorseFarrierVisit={setHorseFarrierVisit}
  horseNextFarrierVisit={horseNextFarrierVisit}
  setHorseNextFarrierVisit={setHorseNextFarrierVisit}
  horseSafetyLocation={horseSafetyLocation}
  setHorseSafetyLocation={setHorseSafetyLocation}
  horseSafetyContact={horseSafetyContact}
  setHorseSafetyContact={setHorseSafetyContact}
  horseHayGiven={horseHayGiven}
  setHorseHayGiven={setHorseHayGiven}
  horseWaterChecked={horseWaterChecked}
  setHorseWaterChecked={setHorseWaterChecked}
  horseFoodOilGiven={horseFoodOilGiven}
  setHorseFoodOilGiven={setHorseFoodOilGiven}
  horseShampooUsed={horseShampooUsed}
  setHorseShampooUsed={setHorseShampooUsed}
  horsePadsCleaningSuppliesUsed={horsePadsCleaningSuppliesUsed}
  setHorsePadsCleaningSuppliesUsed={setHorsePadsCleaningSuppliesUsed}
  horseHoofOilUsed={horseHoofOilUsed}
  setHorseHoofOilUsed={setHorseHoofOilUsed}
  horseFeedEntries={horseFeedEntries}
  setHorseFeedEntries={setHorseFeedEntries}
  horseCustomCleaningSupplies={horseCustomCleaningSupplies}
  setHorseCustomCleaningSupplies={setHorseCustomCleaningSupplies}
  horseFoodOilBuyingDate={horseFoodOilBuyingDate}
  setHorseFoodOilBuyingDate={setHorseFoodOilBuyingDate}
  horseShampooBuyingDate={horseShampooBuyingDate}
  setHorseShampooBuyingDate={setHorseShampooBuyingDate}
  horsePadsCleaningSuppliesBuyingDate={horsePadsCleaningSuppliesBuyingDate}
  setHorsePadsCleaningSuppliesBuyingDate={setHorsePadsCleaningSuppliesBuyingDate}
  horseHoofOilBuyingDate={horseHoofOilBuyingDate}
  setHorseHoofOilBuyingDate={setHorseHoofOilBuyingDate}
  horseDressageTestDay={horseDressageTestDay}
  setHorseDressageTestDay={setHorseDressageTestDay}
  horseDressageTestName={horseDressageTestName}
  setHorseDressageTestName={setHorseDressageTestName}
  horseDressageScore={horseDressageScore}
  setHorseDressageScore={setHorseDressageScore}
  horseDressageNotes={horseDressageNotes}
  setHorseDressageNotes={setHorseDressageNotes}
  horseJumpingDay={horseJumpingDay}
  setHorseJumpingDay={setHorseJumpingDay}
  horseFenceHeight={horseFenceHeight}
  setHorseFenceHeight={setHorseFenceHeight}
  horseFenceCount={horseFenceCount}
  setHorseFenceCount={setHorseFenceCount}
  horseJumpingNotes={horseJumpingNotes}
  setHorseJumpingNotes={setHorseJumpingNotes}
  horseNotes={horseNotes}
  setHorseNotes={setHorseNotes}
/>
{isVehicleMaintenanceActivity(selectedActivity) && (
  <View style={styles.infoBox}>
    <Text style={styles.savedDetailsHeader}>Vehicle Maintenance</Text>

    <TextInput
      style={styles.input}
      placeholder="Vehicle name, example: Indian Motorcycle"
      placeholderTextColor="#050505"
      value={vehicleName}
      onChangeText={setVehicleName}
    />

    <TextInput
      style={styles.input}
      placeholder="Plate number"
      placeholderTextColor="#050505"
      value={vehiclePlateNumber}
      onChangeText={setVehiclePlateNumber}
    />

    <TextInput
      style={styles.input}
      placeholder="Model / Year, example: Camry 2022"
      placeholderTextColor="#050505"
      value={vehicleModelYear}
      onChangeText={setVehicleModelYear}
    />

    <Text style={styles.savedDetailsText}>Service Type</Text>

    {['Tire Change', 'Battery', 'Oil Change', 'Gas Filling', 'Insurance', 'Registration', 'Repair', 'Other Service'].map((service) => (
      <TouchableOpacity
        key={service}
        style={[
          styles.activityButton,
          vehicleServiceType === service && styles.selectedOptionButton,
        ]}
        onPress={() => setVehicleServiceType(service)}
      >
        <Text style={styles.activityText}>{service}</Text>
      </TouchableOpacity>
    ))}

    <TextInput
      style={styles.input}
      placeholder="Service date, example: 2026-07-17"
      placeholderTextColor="#050505"
      value={vehicleServiceDate}
      onChangeText={setVehicleServiceDate}
    />

    <TextInput
      style={styles.input}
      placeholder="Mileage / KM"
      placeholderTextColor="#050505"
      value={vehicleMileage}
      onChangeText={setVehicleMileage}
      keyboardType="numeric"
    />

    <TextInput
      style={styles.input}
      placeholder="Cost"
      placeholderTextColor="#050505"
      value={vehicleCost}
      onChangeText={setVehicleCost}
      keyboardType="numeric"
    />

    <TextInput
      style={styles.input}
      placeholder="Shop / place name"
      placeholderTextColor="#050505"
      value={vehicleShopName}
      onChangeText={setVehicleShopName}
    />

    <Text style={styles.savedDetailsText}>Upcoming reminders</Text>

    <TextInput
      style={styles.input}
      placeholder="Next service date"
      placeholderTextColor="#050505"
      value={vehicleNextServiceDate}
      onChangeText={setVehicleNextServiceDate}
    />

    <TextInput
      style={styles.input}
      placeholder="Next service mileage / KM"
      placeholderTextColor="#050505"
      value={vehicleNextServiceMileage}
      onChangeText={setVehicleNextServiceMileage}
      keyboardType="numeric"
    />

    <TextInput
      style={styles.input}
      placeholder="Insurance expiration date (YYYY-MM-DD)"
      placeholderTextColor="#050505"
      value={vehicleInsuranceExpirationDate}
      onChangeText={setVehicleInsuranceExpirationDate}
    />

    <TextInput
      style={styles.input}
      placeholder="Registration end date (YYYY-MM-DD)"
      placeholderTextColor="#050505"
      value={vehicleRegistrationEndDate}
      onChangeText={setVehicleRegistrationEndDate}
    />

    <TextInput
      style={styles.input}
      placeholder="Notes"
      placeholderTextColor="#050505"
      value={vehicleNotes}
      onChangeText={setVehicleNotes}
      multiline
    />
  </View>
)}

          {supportsReminders(selectedActivity) && (
            <View style={styles.infoBox}>
              <Text style={[styles.savedDetailsHeader, isArabic && styles.rtlText]}>
                {isArabic ? 'التذكير' : 'Reminder'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={isArabic ? 'ملاحظة التذكير' : 'Reminder note'}
                placeholderTextColor="#050505"
                value={reminderNote}
                onChangeText={setReminderNote}
                multiline
              />
              <View style={styles.customTimerRow}>
                <View style={styles.customTimerCopy}>
                  <Text style={[styles.savedDetailsHeader, isArabic && styles.rtlText]}>
                    {isArabic ? 'إرسال إشعار' : 'Send notification'}
                  </Text>
                  <Text style={[styles.candleHint, isArabic && styles.rtlText]}>
                    {isArabic ? 'اختياري. اختر التاريخ والوقت.' : 'Optional. Choose when you want to be notified.'}
                  </Text>
                </View>
                <Switch
                  value={reminderNotificationEnabled}
                  onValueChange={setReminderNotificationEnabled}
                />
              </View>
              {reminderNotificationEnabled && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder={isArabic ? 'تاريخ التذكير، مثال: 2026-08-01' : 'Reminder date, example: 2026-08-01'}
                    placeholderTextColor="#050505"
                    value={reminderDate}
                    onChangeText={setReminderDate}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={isArabic ? 'وقت التذكير، مثال: 18:30' : 'Reminder time, example: 18:30'}
                    placeholderTextColor="#050505"
                    value={reminderTime}
                    onChangeText={setReminderTime}
                  />
                </>
              )}
            </View>
          )}

          {supportsExpirationReminders(selectedActivity) && (
            <View style={styles.infoBox}>
              <Text style={[styles.savedDetailsHeader, isArabic && styles.rtlText]}>
                {isArabic ? 'تذكير تلقائي بالانتهاء' : 'Automatic Expiration Reminder'}
              </Text>
              <Text style={[styles.candleHint, isArabic && styles.rtlText]}>
                {isArabic
                  ? 'يتم إنشاء تذكير لكل تاريخ انتهاء تم إدخاله.'
                  : 'A reminder is created for every expiration date you enter.'}
              </Text>
              <View style={styles.categoryChoiceGrid}>
                {[
                  { value: '0', en: 'Off', ar: 'إيقاف' },
                  { value: '7', en: '1 week before', ar: 'قبل أسبوع' },
                  { value: '30', en: '1 month before', ar: 'قبل شهر' },
                  { value: '90', en: '3 months before', ar: 'قبل 3 أشهر' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.categoryChoiceButton,
                      expirationReminderLeadDays === option.value && styles.selectedOptionButton,
                    ]}
                    onPress={() => setExpirationReminderLeadDays(option.value)}
                  >
                    <Text style={[styles.categoryChoiceText, isArabic && styles.rtlText]}>
                      {isArabic ? option.ar : option.en}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {!isSelectedActivityNonTimed(selectedActivity) && !isFocusActivity(selectedActivity) && (
  <TouchableOpacity style={[styles.endButton, styles.timerActionButton]} onPress={endActivity}>
    <Text style={styles.timerActionText}>End Activity</Text>
  </TouchableOpacity>
)}

          {!isSelectedActivityNonTimed(selectedActivity) && !isFocusActivity(selectedActivity) && (
  <View style={styles.infoBox}>
    <Text style={styles.infoText}>
      Start: {startTime ? startTime.toLocaleTimeString() : 'Not started'}
    </Text>

    <Text style={styles.infoText}>
      End: {endTime ? endTime.toLocaleTimeString() : 'Not ended'}
    </Text>

    <Text style={styles.durationText}>Duration: {getDuration()}</Text>
  </View>
)}

  <TouchableOpacity style={[styles.saveButton, styles.timerActionButton]} onPress={saveSession}>
  <Text style={styles.timerActionText}>
    {isVehicleMaintenanceActivity(selectedActivity)
      ? 'Save Maintenance'
      : isPersonalInfoActivity(selectedActivity)
        ? 'Save Personal Info'
        : 'Save Session'}
  </Text>
</TouchableOpacity>

        </ScrollView>
      </GestureHandlerRootView>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayReminders = sessions.flatMap((session) => {
    const scheduled = session.details?.reminder?.date === today
      ? [{ label: session.activity, date: session.details.reminder.date, note: session.details.reminder.note }]
      : [];
    const expirations = (session.details?.expirationReminders ?? [])
      .filter((reminder) => reminder.remindOn <= today && reminder.expirationDate >= today)
      .map((reminder) => ({ label: reminder.label, date: reminder.expirationDate, note: 'Expiration' }));
    return [...scheduled, ...expirations];
  });
  const syncLabel = syncStatus === 'syncing'
    ? isArabic ? 'جارٍ المزامنة' : 'Syncing'
    : syncStatus === 'saved'
      ? isArabic ? 'محفوظ' : 'Saved'
      : syncStatus === 'offline'
        ? isArabic ? 'دون اتصال' : 'Offline'
        : isArabic ? 'فشلت المزامنة' : 'Sync failed';

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.homeTopbar}>
            <TouchableOpacity
              style={styles.logoutButtonTop}
              onPress={logout}
              accessibilityLabel={isArabic ? 'تسجيل الخروج' : 'Log out'}
            >
              <Ionicons name="power-outline" size={26} color="#050505" />
            </TouchableOpacity>
            {renderBrand()}
            <View style={styles.homeTopActions}>
              <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
                <Text style={styles.languageButtonText}>{isArabic ? 'EN' : 'AR'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.languageButton} onPress={() => setShowSettingsModal(true)} accessibilityLabel="Settings">
                <Ionicons name="settings-outline" size={23} color="#050505" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.homeHeading, isArabic && styles.rtlText]}>
            {isArabic ? 'ماذا تريد أن تتتبع؟' : 'What do you want to track?'}
          </Text>
          <Text style={[styles.subtitle, styles.homeWelcome, isArabic && styles.rtlText]}>
            {isArabic ? `مرحباً، ${loginUsername}` : `Welcome, ${loginUsername}`}
          </Text>

          <Text style={[styles.homeDescription, isArabic && styles.rtlText]}>
            {isArabic
              ? 'اختر نوع النشاط، ثم احفظ تفاصيله في سجلك.'
              : 'Choose an activity type, then save its details to your history.'}
          </Text>

          <View style={styles.syncRow}>
            <View style={[styles.syncDot, syncStatus === 'saved' ? styles.syncSaved : styles.syncOffline]} />
            <Text style={styles.syncText}>{syncLabel}</Text>
          </View>

          <View style={styles.todaySection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.statsTitle, isArabic && styles.rtlText]}>{isArabic ? 'اليوم' : 'Today'}</Text>
              {sessions.length > 0 && (
                <TouchableOpacity style={styles.compactAction} onPress={repeatLastSession}>
                  <Ionicons name="repeat-outline" size={18} color="#050505" />
                  <Text style={styles.compactActionText}>{isArabic ? 'تكرار الأخير' : 'Repeat last'}</Text>
                </TouchableOpacity>
              )}
            </View>
            {todayReminders.length === 0 ? (
              <Text style={styles.todayEmpty}>{isArabic ? 'لا توجد تذكيرات مستحقة اليوم.' : 'No reminders are due today.'}</Text>
            ) : todayReminders.slice(0, 4).map((reminder, index) => (
              <View key={`${reminder.label}-${index}`} style={styles.todayReminderRow}>
                <Ionicons name="notifications-outline" size={19} color="#050505" />
                <Text style={styles.todayReminderText}>{reminder.label}: {reminder.date}</Text>
              </View>
            ))}
            {currentDraft && (
              <View style={styles.draftBanner}>
                <TouchableOpacity
                  style={styles.draftContinueButton}
                  onPress={() => openActivity(currentDraft.activity, true)}
                >
                  <Ionicons name="document-text-outline" size={21} color="#050505" />
                  <View style={styles.draftTextBox}>
                    <Text style={styles.draftTitle}>{isArabic ? 'متابعة المسودة' : 'Continue draft'}</Text>
                    <Text style={styles.draftMeta}>{activityDisplayName(currentDraft.activity)}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.draftDeleteButton}
                  onPress={confirmDeleteDraft}
                  accessibilityRole="button"
                  accessibilityLabel={isArabic ? 'حذف المسودة' : 'Delete draft'}
                >
                  <Text style={styles.draftDeleteText}>−</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {settings.favoriteActivities.length > 0 && (
            <View style={styles.quickSection}>
              <Text style={[styles.statsTitle, isArabic && styles.rtlText]}>{isArabic ? 'المفضلة' : 'Favorites'}</Text>
              <View style={styles.quickActivityRow}>
                {settings.favoriteActivities.map((activity) => (
                  <TouchableOpacity key={activity} style={styles.quickActivityButton} onPress={() => openActivity(activity)}>
                    <Ionicons name="star" size={16} color="#050505" />
                    <Text style={styles.quickActivityText}>{activityDisplayName(activity)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.statsBox}>
            <Text style={[styles.statsTitle, isArabic && styles.rtlText]}>
              {isArabic ? 'الإحصاءات' : 'Stats'}
            </Text>

            <View style={styles.statRow}>
              <Text style={[styles.statLabel, isArabic && styles.rtlText]}>
                {isArabic ? 'إجمالي الجلسات' : 'Total Sessions'}
              </Text>
              <Text style={styles.statValue}>{sessions.length}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={[styles.statLabel, isArabic && styles.rtlText]}>
                {isArabic ? 'إجمالي الوقت' : 'Total Time'}
              </Text>
              <Text style={styles.statValue}>{getTotalTime()}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={[styles.statLabel, isArabic && styles.rtlText]}>
                {isArabic ? 'الأكثر ممارسة' : 'Most Practiced'}
              </Text>
              <Text style={[styles.statValue, isArabic && styles.rtlText]}>
                {activityDisplayName(getMostPracticedActivity())}
              </Text>
            </View>
          </View>

          <View style={styles.activityList}>
            <Text style={[styles.activityGroupTitle, isArabic && styles.rtlText]}>
              {isArabic ? 'أنواع الأنشطة' : 'Activity Types'}
            </Text>
            {getGroupedActivities().map((group) => {
              const groupIsSelected = selectedActivityCategory === group.groupName;

              return (
                <View key={group.groupName} style={styles.categoryGroup}>
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      groupIsSelected && styles.categoryButtonActive,
                      isArabic && styles.categoryButtonRtl,
                    ]}
                    onPress={() => {
                      if (groupIsSelected) {
                        setIsActivityDropdownOpen((isOpen) => !isOpen);
                      } else {
                        setSelectedActivityCategory(group.groupName);
                        setIsActivityDropdownOpen(true);
                      }
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: groupIsSelected && isActivityDropdownOpen }}
                  >
                    <View>
                      <Text style={[styles.activityText, isArabic && styles.rtlText]}>
                        {groupDisplayName(group.groupName)}
                      </Text>
                      <Text style={[styles.categoryCount, isArabic && styles.rtlText]}>
                        {group.groupActivities.length}{' '}
                        {isArabic
                          ? group.groupActivities.length === 1 ? 'نشاط' : 'أنشطة'
                          : group.groupActivities.length === 1 ? 'activity' : 'activities'}
                      </Text>
                    </View>
                    <Text style={styles.activityDropdownChevron}>
                      {groupIsSelected && isActivityDropdownOpen ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>

                  {groupIsSelected && isActivityDropdownOpen && (
                    <View style={styles.activityDropdownMenu}>
                      {group.groupName === 'Custom Activities' && (
                        <TouchableOpacity style={styles.activityDropdownOption} onPress={openOtherModal}>
                          <Text style={[styles.activityDropdownOptionText, isArabic && styles.rtlText]}>
                            {isArabic ? '+ إضافة نشاط مخصص' : '+ Add Custom Activity'}
                          </Text>
                        </TouchableOpacity>
                      )}

                      {group.groupActivities.length === 0 ? (
                        <Text style={[styles.emptyHistory, isArabic && styles.rtlText]}>
                          {isArabic ? 'لا توجد أنشطة في هذه الفئة بعد.' : 'No activities in this category yet.'}
                        </Text>
                      ) : (
                        group.groupActivities.map((activity) => (
                          <View key={activity} style={styles.activityDropdownOptionRow}>
                            <TouchableOpacity
                              style={styles.favoriteButton}
                              onPress={() => toggleFavorite(activity)}
                              accessibilityLabel={`${settings.favoriteActivities.includes(activity) ? 'Remove' : 'Add'} favorite ${activityDisplayName(activity)}`}
                            >
                              <Ionicons
                                name={settings.favoriteActivities.includes(activity) ? 'star' : 'star-outline'}
                                size={21}
                                color="#050505"
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.activityDropdownOption}
                              onPress={() => {
                                setIsActivityDropdownOpen(false);
                                openActivity(activity);
                              }}
                            >
                              <Text style={[styles.activityDropdownOptionText, isArabic && styles.rtlText]}>
                                {activityDisplayName(activity)}
                              </Text>
                            </TouchableOpacity>
                            {isCustomActivity(activity) && (
                              <TouchableOpacity
                                style={styles.activityDropdownDelete}
                                onPress={() => confirmDeleteActivity(activity)}
                                accessibilityRole="button"
                                accessibilityLabel={`${isArabic ? 'حذف' : 'Delete'} ${activityDisplayName(activity)}`}
                              >
                                <Ionicons name="trash-outline" size={20} color="#050505" />
                              </TouchableOpacity>
                            )}
                          </View>
                        ))
                      )}
                    </View>
                  )}
                </View>
              );
            })}

            <TouchableOpacity style={styles.resetButton} onPress={resetActivityList}>
              <Text style={styles.smallActionText}>
                {isArabic ? 'إعادة ضبط قائمة الأنشطة' : 'Reset Activity List'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <Modal visible={showOtherModal} transparent animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Add Activity</Text>
              <Text style={styles.modalSubtitle}>Enter activity name</Text>

              <TextInput
                style={styles.input}
                placeholder="Example: Boxing"
                placeholderTextColor="#050505"
                value={otherActivityName}
                onChangeText={setOtherActivityName}
              />

              <Text style={styles.modalSubtitle}>
                Add reusable field names, separated by commas
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Example: Location, Score, Notes"
                placeholderTextColor="#050505"
                value={otherActivityFields}
                onChangeText={setOtherActivityFields}
                multiline
              />

              <Text style={styles.modalSubtitle}>Choose an Activity Type</Text>
              <View style={styles.categoryChoiceGrid}>
                {activityGroupChoices.map((groupName) => (
                  <TouchableOpacity
                    key={groupName}
                    style={[
                      styles.categoryChoiceButton,
                      otherActivityCategory === groupName && styles.categoryButtonActive,
                    ]}
                    onPress={() => setOtherActivityCategory(groupName)}
                  >
                    <Text style={[styles.categoryChoiceText, isArabic && styles.rtlText]}>
                      {groupDisplayName(groupName)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={addOtherActivity}
              >
                <Text style={styles.buttonText}>Save and Start</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowOtherModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showSettingsModal} transparent animationType="slide" onRequestClose={() => setShowSettingsModal(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.settingsModal}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.modalTitle}>{isArabic ? 'الإعدادات والخصوصية' : 'Settings & Privacy'}</Text>
                <TouchableOpacity onPress={() => setShowSettingsModal(false)} accessibilityLabel="Close settings">
                  <Ionicons name="close" size={26} color="#050505" />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.settingsLabel}>{isArabic ? 'تنسيق التاريخ' : 'Date format'}</Text>
                <View style={styles.settingChoiceRow}>
                  {(['day-first', 'month-first'] as const).map((format) => (
                    <TouchableOpacity
                      key={format}
                      style={[styles.settingChoice, settings.dateFormat === format && styles.settingChoiceActive]}
                      onPress={() => persistSettings({ ...settings, dateFormat: format })}
                    >
                      <Text style={styles.settingChoiceText}>{format === 'day-first' ? 'DD/MM/YYYY' : 'MM/DD/YYYY'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.settingsLabel}>{isArabic ? 'وحدات القياس' : 'Measurement units'}</Text>
                <View style={styles.settingChoiceRow}>
                  {(['metric', 'imperial'] as const).map((system) => (
                    <TouchableOpacity
                      key={system}
                      style={[styles.settingChoice, settings.measurementSystem === system && styles.settingChoiceActive]}
                      onPress={() => persistSettings({ ...settings, measurementSystem: system })}
                    >
                      <Text style={styles.settingChoiceText}>{system === 'metric' ? 'Metric' : 'Imperial'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.settingsLabel}>{isArabic ? 'التذكير الافتراضي' : 'Default expiration reminder'}</Text>
                <View style={styles.settingChoiceRow}>
                  {[7, 30, 90].map((days) => (
                    <TouchableOpacity
                      key={days}
                      style={[styles.settingChoice, settings.defaultReminderDays === days && styles.settingChoiceActive]}
                      onPress={() => persistSettings({ ...settings, defaultReminderDays: days })}
                    >
                      <Text style={styles.settingChoiceText}>{days} {isArabic ? 'يوم' : 'days'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.settingToggleRow}>
                  <View style={styles.settingToggleText}>
                    <Text style={styles.settingsLabel}>{isArabic ? 'إشعارات الجهاز' : 'Device notifications'}</Text>
                    <Text style={styles.settingsHelp}>{isArabic ? 'تنبيهات التذكيرات والانتهاء.' : 'Reminder and expiration alerts.'}</Text>
                  </View>
                  <Switch
                    value={settings.notificationsEnabled}
                    onValueChange={(notificationsEnabled) => persistSettings({ ...settings, notificationsEnabled })}
                  />
                </View>

                <View style={styles.settingToggleRow}>
                  <View style={styles.settingToggleText}>
                    <Text style={styles.settingsLabel}>{isArabic ? 'قفل التطبيق' : 'Face ID / device lock'}</Text>
                    <Text style={styles.settingsHelp}>{isArabic ? 'احمِ سجلاتك عند العودة للتطبيق.' : 'Protect records when returning to the app.'}</Text>
                  </View>
                  <Switch value={settings.appLockEnabled} onValueChange={toggleAppLock} />
                </View>

                <TouchableOpacity style={styles.settingsAction} onPress={() => shareSessionsCsv(sessions)}>
                  <Ionicons name="download-outline" size={21} color="#050505" />
                  <Text style={styles.settingsActionText}>{isArabic ? 'تصدير CSV' : 'Export history as CSV'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsAction} onPress={async () => {
                  try {
                    await signOutOtherSupabaseSessions();
                    await removeOtherDeviceRecords();
                    setAccountDevices(await registerAndLoadDevices());
                    Alert.alert('Done', 'Other signed-in devices were signed out.');
                  } catch {
                    Alert.alert('Could not sign out other devices');
                  }
                }}>
                  <Ionicons name="phone-portrait-outline" size={21} color="#050505" />
                  <Text style={styles.settingsActionText}>{isArabic ? 'تسجيل الخروج من الأجهزة الأخرى' : 'Sign out other devices'}</Text>
                </TouchableOpacity>
                <Text style={styles.settingsLabel}>{isArabic ? 'الأجهزة المسجلة' : 'Signed-in devices'}</Text>
                {accountDevices.length === 0 ? (
                  <Text style={styles.settingsHelp}>{isArabic ? 'ستظهر الأجهزة بعد تحديث قاعدة البيانات.' : 'Devices appear after the database update is applied.'}</Text>
                ) : accountDevices.map((device) => (
                  <View key={device.deviceId} style={styles.deviceRow}>
                    <Ionicons name={device.platform === 'web' ? 'globe-outline' : 'phone-portrait-outline'} size={20} color="#050505" />
                    <View style={styles.settingToggleText}>
                      <Text style={styles.settingsActionText}>{device.label}{device.current ? ' (This device)' : ''}</Text>
                      <Text style={styles.settingsHelp}>{new Date(device.lastSeen).toLocaleString()}</Text>
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={styles.settingsAction} onPress={() => { setShowSettingsModal(false); clearAllHistory(); }}>
                  <Ionicons name="trash-outline" size={21} color="#050505" />
                  <Text style={styles.settingsActionText}>{isArabic ? 'حذف كل بيانات السجل' : 'Delete all history data'}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal visible={showOnboarding} transparent animationType="fade" onRequestClose={finishOnboarding}>
          <View style={styles.modalBackground}>
            <View style={styles.onboardingModal}>
              <Ionicons
                name={onboardingStep === 0 ? 'today-outline' : onboardingStep === 1 ? 'star-outline' : 'cloud-done-outline'}
                size={44}
                color="#050505"
              />
              <Text style={styles.onboardingTitle}>
                {onboardingStep === 0
                  ? isArabic ? 'كل ما يهمك اليوم' : 'Everything important today'
                  : onboardingStep === 1
                    ? isArabic ? 'وصول أسرع' : 'Faster access'
                    : isArabic ? 'محفوظ ومتزامن' : 'Saved and synchronized'}
              </Text>
              <Text style={styles.onboardingText}>
                {onboardingStep === 0
                  ? isArabic ? 'شاهد التذكيرات والمسودات من الرئيسية.' : 'See reminders and unfinished drafts on Home.'
                  : onboardingStep === 1
                    ? isArabic ? 'ثبّت الأنشطة المفضلة وكرر آخر سجل.' : 'Pin favorites and repeat your latest record in one tap.'
                    : isArabic ? 'تظهر حالة المزامنة وتتيح الإعدادات قفل التطبيق.' : 'Sync status stays visible, with optional Face ID protection.'}
              </Text>
              <View style={styles.onboardingDots}>
                {[0, 1, 2].map((step) => <View key={step} style={[styles.onboardingDot, onboardingStep === step && styles.onboardingDotActive]} />)}
              </View>
              <TouchableOpacity
                style={styles.lockButton}
                onPress={() => onboardingStep < 2 ? setOnboardingStep(onboardingStep + 1) : finishOnboarding()}
              >
                <Text style={styles.lockButtonText}>{onboardingStep < 2 ? (isArabic ? 'التالي' : 'Next') : (isArabic ? 'ابدأ' : 'Get started')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={finishOnboarding}>
                <Text style={styles.skipText}>{isArabic ? 'تخطٍ' : 'Skip'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    backgroundColor: '#F6F7F9',
  },
  backButton: {
    marginTop: 55,
    marginBottom: 20,
    alignSelf: 'flex-start',
    minHeight: 44,
    width: 44,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#050505',
    marginTop: 60,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#050505',
    marginBottom: 14,
  },
  homeTopbar: {
    marginTop: 42,
    marginBottom: 30,
    minHeight: 98,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeHeading: {
    color: '#050505',
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    marginBottom: 8,
  },
  authTopbar: {
    width: '100%',
    marginBottom: 34,
    minHeight: 98,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandLockup: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  brandLockupRtl: {
    flexDirection: 'column',
  },
  brandLogo: {
    width: 168,
    height: 168,
  },
  languageButton: {
    width: 44,
    minHeight: 42,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  topbarSpacer: {
    width: 44,
  },
  languageButtonText: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '800',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  statsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    padding: 18,
    borderRadius: 16,
    marginBottom: 22,
  },
  statsTitle: {
    color: '#050505',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  statRow: {
    marginBottom: 12,
  },
  statLabel: {
    color: '#050505',
    fontSize: 17,
    marginBottom: 3,
  },
  statValue: {
    color: '#050505',
    fontSize: 22,
    fontWeight: '700',
  },
  hintText: {
    color: '#050505',
    fontSize: 18,
    marginBottom: 12,
  },
  topActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    padding: 14,
    borderRadius: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#E7E9EE',
    padding: 14,
    borderRadius: 12,
  },
  smallActionText: {
    color: '#050505',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  activityGroup: {
  marginBottom: 18,
},

activityGroupTitle: {
  color: '#050505',
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 12,
},
  activityList: {
    gap: 12,
    paddingBottom: 30,
  },
  categoryGroup: {
    gap: 8,
  },
  categoryButton: {
    minHeight: 82,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryButtonRtl: {
    flexDirection: 'row-reverse',
  },
  categoryButtonActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  categoryCount: {
    color: '#050505',
    fontSize: 16,
    marginTop: 5,
  },
  activityDropdown: {
    marginBottom: 8,
  },
  activityDropdownTrigger: {
    minHeight: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityDropdownTriggerText: {
    flex: 1,
    color: '#050505',
    fontSize: 18,
    fontWeight: '600',
  },
  activityDropdownChevron: {
    color: '#050505',
    fontSize: 14,
    marginLeft: 12,
  },
  activityDropdownMenu: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
  },
  activityDropdownGroupTitle: {
    color: '#050505',
    backgroundColor: '#F2F4F7',
    fontSize: 16,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activityDropdownAddOption: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E9EE',
  },
  activityDropdownOptionRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E9EE',
  },
  activityDropdownOption: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activityDropdownOptionText: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '600',
  },
  activityDropdownDelete: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityDropdownDeleteText: {
    color: '#050505',
    fontSize: 26,
    fontWeight: '500',
  },
  activityButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  activityText: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '600',
  },
  swipeDeleteAction: {
    backgroundColor: '#E7E9EE',
    justifyContent: 'center',
    alignItems: 'center',
    width: 95,
    borderRadius: 14,
    marginBottom: 12,
  },
  swipeDeleteText: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '700',
  },
  addExerciseButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 14,
  },
  deleteLastButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  resetLapButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  exerciseListBox: {
    backgroundColor: '#F6F7F9',
    padding: 14,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  exerciseListTitle: {
    color: '#050505',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#E7E9EE',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: '#050505',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 4,
  },
  exerciseDeleteButton: {
    backgroundColor: '#E7E9EE',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  exerciseDeleteText: {
    color: '#050505',
    fontWeight: 'bold',
    fontSize: 17,
  },

  balootTotalBox: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  balootTotalColumn: {
    flex: 1,
    backgroundColor: '#F6F7F9',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  balootSideTitle: {
    color: '#050505',
    fontSize: 20,
    marginBottom: 8,
  },
  balootTotalNumber: {
    color: '#050505',
    fontSize: 44,
    fontWeight: 'bold',
  },
  winnerBox: {
    backgroundColor: '#F6F7F9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  winnerLabel: {
    color: '#050505',
    fontSize: 17,
    marginBottom: 4,
  },
  winnerText: {
    color: '#050505',
    fontSize: 22,
    fontWeight: 'bold',
  },
  dealerBox: {
    backgroundColor: '#F6F7F9',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  dealerTitle: {
    color: '#050505',
    fontSize: 18,
    marginBottom: 8,
  },
  dealerArrow: {
    color: '#050505',
    fontSize: 66,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dealerHint: {
    color: '#050505',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#2563EB',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
  },
  endButton: {
    backgroundColor: '#2563EB',
    padding: 18,
    borderRadius: 14,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#2563EB',
    padding: 18,
    borderRadius: 14,
    marginTop: 24,
    marginBottom: 60,
  },
  timerActionButton: {
    backgroundColor: '#E7E9EE',
    borderWidth: 1,
    borderColor: '#D0D5DD',
  },
  timerActionText: {
    color: '#050505',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#050505',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
  },
  customTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 18,
  },
  customTimerCopy: {
    flex: 1,
  },
  infoText: {
    color: '#050505',
    fontSize: 19,
    marginBottom: 10,
  },
  durationText: {
    color: '#050505',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    borderRadius: 18,
    padding: 24,
  },
  modalTitle: {
    color: '#050505',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#050505',
    fontSize: 18,
    marginBottom: 18,
  },
  categoryChoiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryChoiceButton: {
    width: '48%',
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    padding: 10,
  },
  categoryChoiceText: {
    color: '#050505',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    marginBottom: 12,
    color: '#050505',
  },
  passwordInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
    paddingRight: 84,
  },
  passwordVisibilityButton: {
    position: 'absolute',
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  passwordVisibilityText: {
    color: '#050505',
    fontSize: 16,
    fontWeight: '700',
  },
  candleBox: {
    alignItems: 'center',
    backgroundColor: '#F6F7F9',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  },
  candleTimeSettingRow: {
    flexDirection: 'row',
    gap: 10,
  },
  candleTimeSettingField: {
    flex: 1,
  },
  candleTimeSettingLabel: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  candleTimeSettingInput: {
    width: '100%',
  },
  candleVisual: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 126,
    width: 90,
    marginBottom: 10,
  },
  candleFlame: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 31,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 4,
    backgroundColor: '#7a5a2d',
    marginBottom: 5,
    transform: [{ rotate: '-8deg' }],
  },
  candleFlameActive: {
    backgroundColor: '#f5a623',
    shadowColor: '#f6c177',
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  candleFlameCore: {
    width: 7,
    height: 14,
    borderRadius: 6,
    backgroundColor: '#fff7d6',
  },
  candleBody: {
    alignItems: 'center',
    width: 48,
    minHeight: 3,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#f3ead7',
    overflow: 'visible',
  },
  candleWick: {
    position: 'absolute',
    top: -8,
    width: 3,
    height: 9,
    borderRadius: 2,
    backgroundColor: '#26201b',
  },
  candleWaxLip: {
    width: 48,
    height: 8,
    borderRadius: 7,
    backgroundColor: '#fffaf0',
  },
  candleWaxDrip: {
    position: 'absolute',
    top: 4,
    right: 7,
    width: 7,
    height: 18,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#fffaf0',
  },
  candleTime: {
    color: '#050505',
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  candleHint: {
    color: '#050505',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  candleProgressTrack: {
    width: '100%',
    height: 6,
    marginTop: 12,
    borderRadius: 3,
    backgroundColor: '#E7E9EE',
    overflow: 'hidden',
  },
  candleProgressFill: {
    height: '100%',
    backgroundColor: '#f6c177',
  },
  candleButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  candleButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 14,
  },
  historyFilterScroll: {
  marginBottom: 14,
},

historyFilterButton: {
  backgroundColor: '#FFFFFF',
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 20,
  marginRight: 10,
  borderWidth: 1,
  borderColor: '#E7E9EE',
},

historyFilterButtonActive: {
  backgroundColor: '#2563EB',
  borderColor: '#2563EB',
},

historyFilterText: {
  color: '#050505',
  fontSize: 16,
  fontWeight: '600',
},

historyFilterTextActive: {
  color: '#050505',
},
  historySection: {
    marginTop: 10,
    paddingBottom: 60,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    color: '#050505',
    fontSize: 26,
    fontWeight: 'bold',
  },
  clearHistoryButton: {
    backgroundColor: '#E7E9EE',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  clearHistoryText: {
    color: '#050505',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyHistory: {
    color: '#050505',
    fontSize: 18,
  },
  sessionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  sessionActivity: {
    color: '#050505',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sessionText: {
    color: '#050505',
    fontSize: 18,
    marginBottom: 4,
  },
  sessionDuration: {
    color: '#050505',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 6,
  },
  savedDetailsBox: {
    marginTop: 10,
    backgroundColor: '#F6F7F9',
    padding: 12,
    borderRadius: 10,
  },
  savedDetailsHeader: {
    color: '#050505',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  savedDetailsText: {
    color: '#050505',
    fontSize: 18,
    marginBottom: 4,
  },
  savedSetText: {
    color: '#050505',
    fontSize: 17,
    marginLeft: 12,
    marginBottom: 3,
  },
  savedExerciseBlock: {
    marginBottom: 10,
  },
  loginContainer: {
  flexGrow: 1,
  backgroundColor: '#F6F7F9',
  padding: 24,
  justifyContent: 'center',
},
loginTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#050505',
  marginBottom: 8,
  textAlign: 'center',
},
loginTagline: {
  fontSize: 18,
  color: '#050505',
  fontWeight: '800',
  lineHeight: 24,
  marginBottom: 12,
  textAlign: 'center',
},
loginSubtitle: {
  fontSize: 20,
  color: '#050505',
  marginBottom: 30,
  textAlign: 'center',
},
loginHint: {
  color: '#050505',
  fontSize: 16,
  textAlign: 'center',
  marginTop: 12,
},
authModeRow: {
  flexDirection: 'row',
  width: '100%',
  gap: 10,
  marginBottom: 18,
},
authModeButton: {
  flex: 1,
  borderColor: '#E7E9EE',
  borderWidth: 1,
  borderRadius: 12,
  padding: 12,
},
authModeButtonActive: {
  backgroundColor: '#E7E9EE',
  borderColor: '#D0D5DD',
},
authModeText: {
  color: '#050505',
  fontWeight: '800',
  textAlign: 'center',
},
forgotPasswordButton: {
  alignSelf: 'center',
  paddingHorizontal: 12,
  paddingVertical: 10,
},
forgotPasswordText: {
  color: '#050505',
  fontSize: 18,
  fontWeight: '700',
  textDecorationLine: 'underline',
},
authSubmitButton: {
  backgroundColor: '#E7E9EE',
  borderWidth: 1,
  borderColor: '#D0D5DD',
},
authSubmitText: {
  color: '#050505',
  fontSize: 20,
  fontWeight: '700',
  textAlign: 'center',
},
signupHelp: {
  color: '#050505',
  fontSize: 16,
  marginBottom: 22,
},
signupDivider: {
  color: '#050505',
  fontSize: 18,
  textAlign: 'center',
  marginBottom: 12,
},
secondaryAuthButton: {
  borderColor: '#E7E9EE',
  borderWidth: 1,
  borderRadius: 12,
  padding: 15,
  marginTop: 2,
  marginBottom: 12,
},
secondaryAuthButtonText: {
  color: '#050505',
  fontSize: 18,
  fontWeight: '800',
  textAlign: 'center',
},
socialButton: {
  borderColor: '#E7E9EE',
  borderWidth: 1,
  borderRadius: 12,
  padding: 15,
  marginBottom: 12,
},
socialButtonText: {
  color: '#050505',
  fontSize: 18,
  fontWeight: '800',
  textAlign: 'center',
},
logoutButton: {
  width: 44,
  minHeight: 44,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  borderWidth: 0,
  padding: 0,
  borderRadius: 8,
  marginBottom: 20,
  alignSelf: 'flex-start',
},
homeDescription: {
  color: '#050505',
  fontSize: 16,
  lineHeight: 24,
  marginBottom: 20,
},
homeWelcome: {
  color: '#050505',
  fontSize: 16,
},
sessionTopRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},

activityBadge: {
  backgroundColor: '#2563EB',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 999,
},

activityBadgeText: {
  color: '#050505',
  fontSize: 16,
  fontWeight: '700',
},

sessionDate: {
  color: '#050505',
  fontSize: 16,
  fontWeight: '600',
},

sessionDurationLarge: {
  color: '#050505',
  fontSize: 26,
  fontWeight: 'bold',
  marginBottom: 10,
},

sessionTimeRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#F6F7F9',
  padding: 12,
  borderRadius: 10,
  marginBottom: 8,
},

sessionTimeText: {
  color: '#050505',
  fontSize: 16,
  fontWeight: '600',
},
selectedOptionButton: {
  backgroundColor: '#DDE7FC',
  borderColor: '#2563EB',
},
lockScreen: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 18,
  padding: 28,
  backgroundColor: '#F6F7F9',
},
lockTitle: {
  color: '#050505',
  fontSize: 22,
  fontWeight: '900',
},
lockButton: {
  minHeight: 48,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 18,
  borderRadius: 8,
  backgroundColor: '#E7E9EE',
},
lockButtonText: {
  color: '#050505',
  fontSize: 16,
  fontWeight: '900',
},
homeTopActions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
},
logoutButtonTop: {
  width: 44,
  minHeight: 44,
  alignItems: 'center',
  justifyContent: 'center',
},
syncRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 7,
  marginBottom: 14,
},
syncDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
},
syncSaved: {
  backgroundColor: '#17805C',
},
syncOffline: {
  backgroundColor: '#667085',
},
syncText: {
  color: '#050505',
  fontSize: 14,
  fontWeight: '700',
},
todaySection: {
  marginBottom: 16,
  padding: 16,
  borderWidth: 1,
  borderColor: '#E7E9EE',
  borderRadius: 8,
  backgroundColor: 'rgba(255,255,255,0.34)',
},
sectionHeaderRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
},
compactAction: {
  minHeight: 38,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  paddingHorizontal: 10,
  borderRadius: 8,
  backgroundColor: '#E7E9EE',
},
compactActionText: {
  color: '#050505',
  fontSize: 13,
  fontWeight: '800',
},
todayEmpty: {
  marginTop: 8,
  color: '#050505',
  fontSize: 15,
},
todayReminderRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginTop: 9,
},
todayReminderText: {
  flex: 1,
  color: '#050505',
  fontSize: 15,
},
draftBanner: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 14,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: '#E7E9EE',
},
draftContinueButton: {
  flex: 1,
  minHeight: 44,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
draftDeleteButton: {
  width: 44,
  height: 44,
  alignItems: 'center',
  justifyContent: 'center',
},
draftDeleteText: {
  color: '#050505',
  fontSize: 28,
  fontWeight: '700',
},
draftTextBox: {
  flex: 1,
},
draftTitle: {
  color: '#050505',
  fontSize: 15,
  fontWeight: '900',
},
draftMeta: {
  color: '#050505',
  fontSize: 14,
},
quickSection: {
  marginBottom: 16,
},
quickActivityRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 8,
},
quickActivityButton: {
  minHeight: 42,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: '#E7E9EE',
  borderRadius: 8,
  backgroundColor: 'rgba(255,255,255,0.32)',
},
quickActivityText: {
  color: '#050505',
  fontSize: 14,
  fontWeight: '800',
},
favoriteButton: {
  width: 42,
  minHeight: 42,
  alignItems: 'center',
  justifyContent: 'center',
},
settingsModal: {
  width: '92%',
  maxHeight: '88%',
  padding: 20,
  borderRadius: 8,
  backgroundColor: '#F6F7F9',
},
settingsLabel: {
  marginTop: 16,
  marginBottom: 8,
  color: '#050505',
  fontSize: 16,
  fontWeight: '900',
},
settingsHelp: {
  color: '#050505',
  fontSize: 13,
},
settingChoiceRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
},
settingChoice: {
  minHeight: 42,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: '#E7E9EE',
  borderRadius: 8,
},
settingChoiceActive: {
  backgroundColor: '#E7E9EE',
  borderColor: '#667085',
},
settingChoiceText: {
  color: '#050505',
  fontSize: 14,
  fontWeight: '800',
},
settingToggleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
},
settingToggleText: {
  flex: 1,
},
settingsAction: {
  minHeight: 48,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  marginTop: 12,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: '#E7E9EE',
  borderRadius: 8,
},
settingsActionText: {
  flex: 1,
  color: '#050505',
  fontSize: 15,
  fontWeight: '800',
},
deviceRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  minHeight: 48,
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#E7E9EE',
},
onboardingModal: {
  width: '88%',
  alignItems: 'center',
  gap: 16,
  padding: 24,
  borderRadius: 8,
  backgroundColor: '#F6F7F9',
},
onboardingTitle: {
  color: '#050505',
  fontSize: 22,
  fontWeight: '900',
  textAlign: 'center',
},
onboardingText: {
  color: '#050505',
  fontSize: 16,
  lineHeight: 23,
  textAlign: 'center',
},
onboardingDots: {
  flexDirection: 'row',
  gap: 7,
},
onboardingDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#B8BEC8',
},
onboardingDotActive: {
  backgroundColor: '#050505',
},
skipText: {
  color: '#050505',
  fontSize: 15,
  textDecorationLine: 'underline',
},
});
