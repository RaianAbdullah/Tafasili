import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import BalootTracker from '../../components/BalootTracker';
import FootballTracker from '../../components/FootballTracker';
import GymTracker from '../../components/GymTracker';
import HorseRidingTracker from '../../components/HorseRidingTracker';
import LapTracker from '../../components/LapTracker';
import MatchTracker from '../../components/MatchTracker';
import {
  getSupabaseSession,
  signInWithSupabase,
  signOutFromSupabase,
  signUpWithSupabase,
} from '../../lib/authDatabase';
import {
  clearCloudSessions,
  deleteCloudSession,
  loadCloudSessions,
  saveCloudSession,
} from '../../lib/sessionDatabase';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  BalootScore,
  CustomFieldValue,
  GymExercise,
  GymSet,
  MatchRound,
  Session,
} from '../../types';

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

const lapActivities = ['Run', 'Walking', 'Cycling', 'Swimming'];
const movementActivities = ['Run', 'Walking', 'Cycling'];
const matchActivities = ['Padel', 'Tennis'];
const STUDY_CANDLE_DURATION_SECONDS = 3 * 60 * 60;
const arabicActivityNames: Record<string, string> = {
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

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupRepeatPassword, setSignupRepeatPassword] = useState('');
  const [activities, setActivities] = useState<string[]>(defaultActivities);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedActivityCategory, setSelectedActivityCategory] = useState<string | null>(null);

  const [showOtherModal, setShowOtherModal] = useState(false);
  const [otherActivityName, setOtherActivityName] = useState('');
  const [otherActivityFields, setOtherActivityFields] = useState('');
  const [customActivityTemplates, setCustomActivityTemplates] = useState<Record<string, string[]>>({});
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);

  const [footballTeamOneName, setFootballTeamOneName] = useState('');
  const [footballTeamTwoName, setFootballTeamTwoName] = useState('');
  const [footballTeamOneScore, setFootballTeamOneScore] = useState('');
  const [footballTeamTwoScore, setFootballTeamTwoScore] = useState('');

  const [gymWorkoutDay, setGymWorkoutDay] = useState('');
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
  const [horseSafetyLocation, setHorseSafetyLocation] = useState('');
  const [horseSafetyContact, setHorseSafetyContact] = useState('');

  const [horseHayGiven, setHorseHayGiven] = useState(false);
  const [horseWaterChecked, setHorseWaterChecked] = useState(false);
  const [horseFoodOilGiven, setHorseFoodOilGiven] = useState(false);
  const [horseShampooUsed, setHorseShampooUsed] = useState(false);
  const [horsePadsCleaningSuppliesUsed, setHorsePadsCleaningSuppliesUsed] = useState(false);
  const [horseHoofOilUsed, setHorseHoofOilUsed] = useState(false);

  const [horseReleveAmount, setHorseReleveAmount] = useState('');
  const [horseReleveBuyingDate, setHorseReleveBuyingDate] = useState('');

  const [horseEquiJewelAmount, setHorseEquiJewelAmount] = useState('');
  const [horseEquiJewelBuyingDate, setHorseEquiJewelBuyingDate] = useState('');

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
  const [personalIdNumber, setPersonalIdNumber] = useState('');
  const [personalIdExpirationDate, setPersonalIdExpirationDate] = useState('');
  const [personalDlExpirationDate, setPersonalDlExpirationDate] = useState('');
  const [personalPassportNumber, setPersonalPassportNumber] = useState('');
  const [personalPassportExpirationDate, setPersonalPassportExpirationDate] = useState('');

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
  };
  const autoSaveCompletedStudyCandleRef = useRef<() => void>(() => undefined);
  autoSaveCompletedStudyCandleRef.current = () => {
    void autoSaveCompletedStudyCandle();
  };

  useEffect(() => {
    void AsyncStorage.getItem('language').then((savedLanguage) => {
      if (savedLanguage === 'ar' || savedLanguage === 'en') {
        setLanguage(savedLanguage);
      }
    });
  }, []);

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

  const isArabic = language === 'ar';
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
      <View>
        <Text style={styles.brandEnglish}>Tafasili</Text>
      </View>
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
  if (loginUsername.trim() === '') {
    alert('Please enter username or phone number');
    return;
  }

  if (loginPassword.trim() === '') {
    alert('Please enter password');
    return;
  }

  try {
    if (isSupabaseConfigured) {
      const user = await signInWithSupabase(loginUsername.trim(), loginPassword);

      if (!user) {
        throw new Error('No account returned.');
      }

      setAuthUserId(user.id);
      await loadSavedData(user.id);
    }

    setIsLoggedIn(true);
  } catch {
    alert('Could not sign in. Check your email and password.');
  }
};
const signup = async () => {
  if (loginUsername.trim() === '') {
    alert('Please enter email or phone number');
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
      const result = await signUpWithSupabase(loginUsername.trim(), loginPassword);

      if (!result?.session || !result.user) {
        alert('Account created. Check your email to confirm it, then sign in.');
        setAuthMode('signin');
        return;
      }

      setAuthUserId(result.user.id);
      await loadSavedData(result.user.id);
    }

    setIsLoggedIn(true);
  } catch {
    alert('Could not create account. Use a valid email and try again.');
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
    const sessionsStorageKey = userId ? `sessions:${userId}` : 'sessions';

    try {
      const scopedSessions = await AsyncStorage.getItem(sessionsStorageKey);
      const legacySessions = userId && !scopedSessions
        ? await AsyncStorage.getItem('sessions')
        : null;
      const savedSessions = scopedSessions ?? legacySessions;
      const savedActivities = await AsyncStorage.getItem('activities');
      const savedCustomTemplates = await AsyncStorage.getItem('customActivityTemplates');

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
          setActivities([...new Set([...defaultActivities, ...savedActivityList])]);
        }
      }

      if (savedCustomTemplates) {
        const parsedTemplates = JSON.parse(savedCustomTemplates);
        if (parsedTemplates && typeof parsedTemplates === 'object') {
          setCustomActivityTemplates(parsedTemplates);
        }
      }

    } catch {
      alert('Error loading saved data');
      return;
    }

    try {
      const cloudSessions = await loadCloudSessions();

      if (Array.isArray(cloudSessions)) {
        const mergedSessions = new Map<number, Session>();

        localSessions.forEach((session) => mergedSessions.set(session.id, session));
        cloudSessions.forEach((session) => mergedSessions.set(session.id, session));

        const restoredSessions = [...mergedSessions.values()].sort((first, second) => second.id - first.id);
        setSessions(restoredSessions);
        await AsyncStorage.setItem(sessionsStorageKey, JSON.stringify(restoredSessions));

        if (userId) {
          await Promise.allSettled(localSessions.map((session) => saveCloudSession(session)));
        }
      }
    } catch {
      // Local history remains available when cloud sync is offline or not signed in.
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

  const saveActivitiesToStorage = async (newActivities: string[]) => {
    try {
      await AsyncStorage.setItem('activities', JSON.stringify(newActivities));
    } catch {
      alert('Error saving activity list');
    }
  };

  const saveCustomTemplatesToStorage = async (templates: Record<string, string[]>) => {
    try {
      await AsyncStorage.setItem('customActivityTemplates', JSON.stringify(templates));
    } catch {
      alert('Error saving custom activity fields');
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
    return customActivityTemplates[activity] || ['Session title', 'Notes'];
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
    return activity === 'Horse Riding';
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
    return Boolean(activity && ['Gym', 'Horse Riding', 'Studying', 'Work', 'Vehicle Maintenance'].includes(activity));
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
                pomodoroPlan: snapshot.pomodoroPlan.trim(),
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
    setGymExerciseName('');
    setGymSetReps('');
    setGymSetWeight('');
    setCurrentGymSets([]);
    setGymExercises([]);

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
    setPersonalIdNumber('');
    setPersonalIdExpirationDate('');
    setPersonalDlExpirationDate('');
    setPersonalPassportNumber('');
    setPersonalPassportExpirationDate('');
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
    setHorseSafetyLocation('');
    setHorseSafetyContact('');

    setHorseHayGiven(false);
    setHorseWaterChecked(false);
    setHorseFoodOilGiven(false);
    setHorseShampooUsed(false);
    setHorsePadsCleaningSuppliesUsed(false);
    setHorseHoofOilUsed(false);

    setHorseReleveAmount('');
    setHorseReleveBuyingDate('');

    setHorseEquiJewelAmount('');
    setHorseEquiJewelBuyingDate('');

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

  const openActivity = (activity: string) => {
    setSelectedActivity(activity);
    setStartTime(null);
    setEndTime(null);
    resetActivityFields();

    if (lapActivities.includes(activity)) {
      const defaultLap = getDefaultLapDistance(activity);
      setLapDistance(defaultLap.distance);
      setLapDistanceUnit(defaultLap.unit);
    }
  };

  const openOtherModal = () => {
    setOtherActivityName('');
    setOtherActivityFields('');
    setShowOtherModal(true);
  };

  const addOtherActivity = () => {
    const cleanName = otherActivityName.trim();

    if (cleanName === '') {
      alert('Please enter an activity name');
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
      [cleanName]: fields.length > 0 ? fields : ['Session title', 'Notes'],
    };

    setActivities(newActivities);
    saveActivitiesToStorage(newActivities);
    setCustomActivityTemplates(newTemplates);
    saveCustomTemplatesToStorage(newTemplates);

    setShowOtherModal(false);
    setSelectedActivity(cleanName);
    setStartTime(null);
    setEndTime(null);
    resetActivityFields();
  };

  const deleteActivity = (activityName: string) => {
    const newActivities = activities.filter((activity) => activity !== activityName);
    const newTemplates = { ...customActivityTemplates };
    delete newTemplates[activityName];

    setActivities(newActivities);
    saveActivitiesToStorage(newActivities);
    setCustomActivityTemplates(newTemplates);
    saveCustomTemplatesToStorage(newTemplates);
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
          onPress: () => deleteActivity(activityName),
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
          onPress: () => {
            setActivities(defaultActivities);
            saveActivitiesToStorage(defaultActivities);
            setCustomActivityTemplates({});
            saveCustomTemplatesToStorage({});
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

    return lapDistanceUnit === 'm' ? total / 1000 : total;
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

if (!isNonTimedActivity(selectedActivity) && (!startTime || !endTime)) {
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
  start: isNonTimedActivity(selectedActivity)
    ? 'Not timed'
    : startTime!.toLocaleTimeString(),
  end: isNonTimedActivity(selectedActivity)
    ? 'Not timed'
    : endTime!.toLocaleTimeString(),
  duration: isNonTimedActivity(selectedActivity)
    ? 'Not timed'
    : getDuration(),
  durationSeconds: isNonTimedActivity(selectedActivity)
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
          pomodoroPlan: studyPomodoroPlan.trim(),
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
          safetyLocation: horseSafetyLocation.trim(),
          safetyContact: horseSafetyContact.trim(),

          hayGiven: horseHayGiven,
          waterChecked: horseWaterChecked,
          foodOilGiven: horseFoodOilGiven,
          shampooUsed: horseShampooUsed,
          padsCleaningSuppliesUsed: horsePadsCleaningSuppliesUsed,
          hoofOilUsed: horseHoofOilUsed,

          releveAmount: horseReleveAmount.trim(),
          releveBuyingDate: horseReleveBuyingDate.trim(),

          equiJewelAmount: horseEquiJewelAmount.trim(),
          equiJewelBuyingDate: horseEquiJewelBuyingDate.trim(),

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

      newSession.details = { customFields };
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

    if (supportsReminders(selectedActivity) && (reminderDate.trim() || reminderTime.trim() || reminderNote.trim())) {
      newSession.details = {
        ...newSession.details,
        reminder: {
          date: reminderDate.trim(),
          time: reminderTime.trim(),
          note: reminderNote.trim(),
        },
      };
    }

    
    const newSessions = [newSession, ...sessions];

    setSessions(newSessions);
    await saveSessionsToStorage(newSessions);

    try {
      await saveCloudSession(newSession);
    } catch {
      alert('Saved on this device, but cloud sync failed.');
    }

    alert('Session saved successfully');

    setSelectedActivity(null);
    setStartTime(null);
    setEndTime(null);
    resetActivityFields();
  };

  const deleteSession = async (sessionId: number) => {
    const newSessions = sessions.filter((session) => session.id !== sessionId);

    setSessions(newSessions);
    await saveSessionsToStorage(newSessions);

    try {
      await deleteCloudSession(sessionId);
    } catch {
      alert('Deleted on this device, but cloud delete failed.');
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

  const renderActivityDeleteAction = (activityName: string) => {
    return (
      <TouchableOpacity
        style={styles.swipeDeleteAction}
        onPress={() => confirmDeleteActivity(activityName)}
      >
        <Text style={styles.swipeDeleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };
  const getActivityGroup = (activity: string) => {
  if (['Football', 'Padel', 'Tennis', 'Golf', 'Baloot'].includes(activity)) {
    return 'Sports and Games';
  }

  if (['Gym', 'Run', 'Cycling', 'Walking', 'Swimming'].includes(activity)) {
    return 'Fitness and Movement';
  }

  if (activity === 'Horse Riding') {
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
            Pomodoro: {study.pomodoroPlan || 'Not filled'}
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

          <Text style={styles.savedDetailsHeader}>Monthly Feed:</Text>
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

  if (!isLoggedIn) {
    const isSignupMode = authMode === 'signup';

    return (
    <GestureHandlerRootView style={styles.root}>
      <ScrollView contentContainerStyle={styles.loginContainer}>
        <View style={styles.authTopbar}>
          <View style={styles.topbarSpacer} />
          {renderBrand()}
          <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
            <Text style={styles.languageButtonText}>{isArabic ? 'English' : 'العربية'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.loginTagline, isArabic && styles.rtlText]}>
          {isArabic ? 'تتبع واحفظ تفاصيل حياتك ونشاطاتك.' : 'Track and save your life and activity details.'}
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
          onChangeText={setLoginUsername}
        />

        <TextInput
          style={styles.input}
          placeholder={isSignupMode
            ? isArabic ? 'كلمة مرور جديدة' : 'New password'
            : isArabic ? 'كلمة المرور' : 'Password'}
          placeholderTextColor="#050505"
          value={loginPassword}
          onChangeText={setLoginPassword}
          secureTextEntry
        />

        {isSignupMode && (
          <>
            <TextInput
              style={styles.input}
              placeholder={isArabic ? 'تأكيد كلمة المرور' : 'Confirm password'}
              placeholderTextColor="#050505"
              value={signupRepeatPassword}
              onChangeText={setSignupRepeatPassword}
              secureTextEntry
            />

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
          <TouchableOpacity style={styles.backButton} onPress={goBackToList}>
            <Text style={styles.backButtonText}>{isArabic ? 'رجوع →' : '← Back'}</Text>
          </TouchableOpacity>

          <Text style={[styles.title, isArabic && styles.rtlText]}>
            {activityDisplayName(selectedActivity)}
          </Text>
          <Text style={[styles.subtitle, isArabic && styles.rtlText]}>
            {isFocusActivity(selectedActivity)
              ? isArabic
                ? 'حدد التفاصيل واستخدم مؤقت الشمعة'
                : 'Set the details and use the candle timer'
              : isArabic
                ? 'سجل تفاصيل نشاطك'
                : 'Track your activity session'}
          </Text>
          {!isNonTimedActivity(selectedActivity) && !isFocusActivity(selectedActivity) && (
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
                placeholder="ID expiration date"
                placeholderTextColor="#050505"
                value={personalIdExpirationDate}
                onChangeText={setPersonalIdExpirationDate}
              />
              <TextInput
                style={styles.input}
                placeholder="Driving license expiration date"
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
                placeholder="Passport expiration date"
                placeholderTextColor="#050505"
                value={personalPassportExpirationDate}
                onChangeText={setPersonalPassportExpirationDate}
              />
            </View>
          )}

          {isCustomActivity(selectedActivity) && (
            <View style={styles.infoBox}>
              <Text style={styles.savedDetailsHeader}>Custom Details</Text>
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
  gymWorkoutDay={gymWorkoutDay}
  setGymWorkoutDay={setGymWorkoutDay}
  gymExerciseName={gymExerciseName}
  setGymExerciseName={setGymExerciseName}
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
      placeholder="Pomodoro plan, example: 25/5 x 4"
      placeholderTextColor="#050505"
      value={studyPomodoroPlan}
      onChangeText={setStudyPomodoroPlan}
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
  horseReleveAmount={horseReleveAmount}
  setHorseReleveAmount={setHorseReleveAmount}
  horseReleveBuyingDate={horseReleveBuyingDate}
  setHorseReleveBuyingDate={setHorseReleveBuyingDate}
  horseEquiJewelAmount={horseEquiJewelAmount}
  setHorseEquiJewelAmount={setHorseEquiJewelAmount}
  horseEquiJewelBuyingDate={horseEquiJewelBuyingDate}
  setHorseEquiJewelBuyingDate={setHorseEquiJewelBuyingDate}
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
      placeholder="Insurance expiration date"
      placeholderTextColor="#050505"
      value={vehicleInsuranceExpirationDate}
      onChangeText={setVehicleInsuranceExpirationDate}
    />

    <TextInput
      style={styles.input}
      placeholder="Registration end date"
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
              <Text style={styles.savedDetailsHeader}>Reminder</Text>
              <TextInput
                style={styles.input}
                placeholder="Reminder date, example: 2026-08-01"
                placeholderTextColor="#050505"
                value={reminderDate}
                onChangeText={setReminderDate}
              />
              <TextInput
                style={styles.input}
                placeholder="Reminder time, example: 18:30"
                placeholderTextColor="#050505"
                value={reminderTime}
                onChangeText={setReminderTime}
              />
              <TextInput
                style={styles.input}
                placeholder="What should Tafasili remind you about?"
                placeholderTextColor="#050505"
                value={reminderNote}
                onChangeText={setReminderNote}
                multiline
              />
            </View>
          )}

          {!isNonTimedActivity(selectedActivity) && !isFocusActivity(selectedActivity) && (
  <TouchableOpacity style={[styles.endButton, styles.timerActionButton]} onPress={endActivity}>
    <Text style={styles.timerActionText}>End Activity</Text>
  </TouchableOpacity>
)}

          {!isNonTimedActivity(selectedActivity) && !isFocusActivity(selectedActivity) && (
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


  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.homeTopbar}>
            <View style={styles.topbarSpacer} />
            {renderBrand()}
            <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
              <Text style={styles.languageButtonText}>{isArabic ? 'English' : 'العربية'}</Text>
            </TouchableOpacity>
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

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>{isArabic ? 'تسجيل الخروج' : 'Logout'}</Text>
          </TouchableOpacity>

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
            {getGroupedActivities().map((group) => (
              <TouchableOpacity
                key={group.groupName}
                style={[
                  styles.categoryButton,
                  selectedActivityCategory === group.groupName && styles.categoryButtonActive,
                  isArabic && styles.categoryButtonRtl,
                ]}
                onPress={() => setSelectedActivityCategory(group.groupName)}
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
              </TouchableOpacity>
            ))}

            {selectedActivityCategory && (
              <>
                <Text style={[styles.activityGroupTitle, isArabic && styles.rtlText]}>
                  {groupDisplayName(selectedActivityCategory)}
                </Text>

                {selectedActivityCategory === 'Custom Activities' && (
                  <TouchableOpacity style={styles.addButton} onPress={openOtherModal}>
                    <Text style={styles.smallActionText}>
                      {isArabic ? '+ إضافة نشاط مخصص' : '+ Add Custom Activity'}
                    </Text>
                  </TouchableOpacity>
                )}

                <Text style={[styles.hintText, isArabic && styles.rtlText]}>
                  {isArabic ? 'اسحب النشاط إلى اليسار لحذفه' : 'Swipe left on an activity to delete it'}
                </Text>

                {activities.filter((activity) => getActivityGroup(activity) === selectedActivityCategory).length === 0 ? (
                  <Text style={[styles.emptyHistory, isArabic && styles.rtlText]}>
                    {isArabic ? 'لا توجد أنشطة في هذه الفئة بعد.' : 'No activities in this category yet.'}
                  </Text>
                ) : (
                  activities
                    .filter((activity) => getActivityGroup(activity) === selectedActivityCategory)
                    .map((activity) => (
                    <Swipeable
                      key={activity}
                      renderRightActions={() =>
                        renderActivityDeleteAction(activity)
                      }
                    >
                      <TouchableOpacity
                        style={styles.activityButton}
                        onPress={() => openActivity(activity)}
                      >
                        <Text style={[styles.activityText, isArabic && styles.rtlText]}>
                          {activityDisplayName(activity)}
                        </Text>
                      </TouchableOpacity>
                    </Swipeable>
                    ))
                )}
              </>
            )}

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
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    color: '#050505',
    fontSize: 20,
    fontWeight: '600',
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
    width: 62,
    height: 78,
  },
  brandEnglish: {
    color: '#050505',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  languageButton: {
    minWidth: 76,
    minHeight: 42,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E9EE',
    backgroundColor: '#FFFFFF',
  },
  topbarSpacer: {
    width: 76,
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
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E7E9EE',
  padding: 12,
  borderRadius: 12,
  marginBottom: 20,
},
logoutButtonText: {
  color: '#050505',
  fontSize: 18,
  fontWeight: '700',
  textAlign: 'center',
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
});
