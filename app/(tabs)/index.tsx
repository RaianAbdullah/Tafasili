import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
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
  BalootScore,
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
  'Baloot',
  'Vehicle Maintenance',
];

const lapActivities = ['Run', 'Walking', 'Cycling', 'Swimming'];
const matchActivities = ['Padel', 'Tennis'];


export default function HomeScreen() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupRepeatPassword, setSignupRepeatPassword] = useState('');
  const [activities, setActivities] = useState<string[]>(defaultActivities);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const [showOtherModal, setShowOtherModal] = useState(false);
  const [otherActivityName, setOtherActivityName] = useState('');

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
  const [currentGymSets, setCurrentGymSets] = useState<GymSet[]>([]);
  const [gymExercises, setGymExercises] = useState<GymExercise[]>([]);

  const [lapCount, setLapCount] = useState(0);
  const [lapDistance, setLapDistance] = useState('');
  const [lapDistanceUnit, setLapDistanceUnit] = useState('m');

  const [matchTeamOneName, setMatchTeamOneName] = useState('');
  const [matchTeamTwoName, setMatchTeamTwoName] = useState('');
  const [matchTeamOneGames, setMatchTeamOneGames] = useState('');
  const [matchTeamTwoGames, setMatchTeamTwoGames] = useState('');
  const [matchRounds, setMatchRounds] = useState<MatchRound[]>([]);

  const [balootUsScore, setBalootUsScore] = useState('');
  const [balootThemScore, setBalootThemScore] = useState('');
  const [balootScores, setBalootScores] = useState<BalootScore[]>([]);
  const [balootDealerDirection, setBalootDealerDirection] = useState('↑');

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
const [vehicleServiceType, setVehicleServiceType] = useState('');
const [vehicleMileage, setVehicleMileage] = useState('');
  const [vehicleCost, setVehicleCost] = useState('');
  const [vehicleNotes, setVehicleNotes] = useState('');

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: isLoggedIn
        ? {
            backgroundColor: '#0f0f10',
            borderTopColor: '#1f1f22',
            borderTopWidth: 1,
            height: 85,
            paddingTop: 8,
            paddingBottom: 18,
          }
        : { display: 'none' },
    });
  }, [isLoggedIn, navigation]);

  useEffect(() => {
    loadSavedData();
  }, []);
  const login = () => {
  if (loginUsername.trim() === '') {
    alert('Please enter username or phone number');
    return;
  }

  if (loginPassword.trim() === '') {
    alert('Please enter password');
    return;
  }

  setIsLoggedIn(true);
};
const signup = () => {
  if (signupFirstName.trim() === '' || signupLastName.trim() === '') {
    alert('Please enter first and last name');
    return;
  }

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

  setIsLoggedIn(true);
};
const logout = () => {
  setIsLoggedIn(false);
  setLoginPassword('');
  setSignupRepeatPassword('');
};
  const loadSavedData = async () => {
    try {
      const savedSessions = await AsyncStorage.getItem('sessions');
      const savedActivities = await AsyncStorage.getItem('activities');

      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }

      if (savedActivities) {
        setActivities(JSON.parse(savedActivities));
      }
    } catch (error) {
      alert('Error loading saved data');
    }
  };

  const saveSessionsToStorage = async (newSessions: Session[]) => {
    try {
      await AsyncStorage.setItem('sessions', JSON.stringify(newSessions));
    } catch (error) {
      alert('Error saving session');
    }
  };

  const saveActivitiesToStorage = async (newActivities: string[]) => {
    try {
      await AsyncStorage.setItem('activities', JSON.stringify(newActivities));
    } catch (error) {
      alert('Error saving activity list');
    }
  };

  const isLapActivity = (activity: string | null) => {
    if (!activity) {
      return false;
    }

    return lapActivities.includes(activity);
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
    setCurrentGymSets([]);
    setGymExercises([]);

    setLapCount(0);
    setLapDistance('');
    setLapDistanceUnit('m');

    setMatchTeamOneName('');
    setMatchTeamTwoName('');
    setMatchTeamOneGames('');
    setMatchTeamTwoGames('');
    setMatchRounds([]);

    setBalootUsScore('');
    setBalootThemScore('');
    setBalootScores([]);
    setBalootDealerDirection('↑');

    setVehicleName('');
    setVehicleServiceType('');
    setVehicleMileage('');
    setVehicleCost('');
    setVehicleNotes('');

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

    setActivities(newActivities);
    saveActivitiesToStorage(newActivities);

    setShowOtherModal(false);
    setSelectedActivity(cleanName);
    setStartTime(null);
    setEndTime(null);
    resetActivityFields();
  };

  const deleteActivity = (activityName: string) => {
    const newActivities = activities.filter((activity) => activity !== activityName);

    setActivities(newActivities);
    saveActivitiesToStorage(newActivities);
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
    if (usTotal >= 152 && usTotal > themTotal) {
      return 'Us';
    }

    if (themTotal >= 152 && themTotal > usTotal) {
      return 'Them';
    }

    if (usTotal >= 152 && themTotal >= 152 && usTotal === themTotal) {
      return 'Tie - play one more hand';
    }

    return 'Not finished yet';
  };

  const saveSession = () => {
    if (!selectedActivity) {
  alert('Please choose an activity first');
  return;
}

if (!isVehicleMaintenanceActivity(selectedActivity) && (!startTime || !endTime)) {
  alert('Please start and end the activity first');
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
        const unfinishedRound: MatchRound = {
          id: Date.now(),
          teamOneGames: cleanTeamOneGames,
          teamTwoGames: cleanTeamTwoGames,
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
  start: isVehicleMaintenanceActivity(selectedActivity)
    ? 'Not timed'
    : startTime!.toLocaleTimeString(),
  end: isVehicleMaintenanceActivity(selectedActivity)
    ? 'Not timed'
    : endTime!.toLocaleTimeString(),
  duration: isVehicleMaintenanceActivity(selectedActivity)
    ? 'Not timed'
    : getDuration(),
  durationSeconds: isVehicleMaintenanceActivity(selectedActivity)
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
        balootUsTotal: usTotal,
        balootThemTotal: themTotal,
        balootWinner: getBalootWinner(usTotal, themTotal),
        balootDealerDirection: balootDealerDirection,
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
      serviceType: vehicleServiceType.trim(),
      mileage: vehicleMileage.trim(),
      cost: vehicleCost.trim(),
      notes: vehicleNotes.trim(),
    },
  };
}

    
    const newSessions = [newSession, ...sessions];

    setSessions(newSessions);
    saveSessionsToStorage(newSessions);

    alert('Session saved successfully');

    setSelectedActivity(null);
    setStartTime(null);
    setEndTime(null);
    resetActivityFields();
  };

  const deleteSession = (sessionId: number) => {
    const newSessions = sessions.filter((session) => session.id !== sessionId);

    setSessions(newSessions);
    saveSessionsToStorage(newSessions);
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
          onPress: () => deleteSession(sessionId),
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
          onPress: () => {
            setSessions([]);
            saveSessionsToStorage([]);
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
  if (['Football', 'Padel', 'Tennis', 'Golf'].includes(activity)) {
    return 'Sports';
  }

  if (['Gym', 'Run', 'Cycling', 'Walking', 'Swimming'].includes(activity)) {
    return 'Training';
  }

  if (activity === 'Horse Riding') {
    return 'Horse';
  }

  if (activity === 'Baloot') {
    return 'Games';
  }

  if (activity === 'Studying') {
    return 'Study';
  }

  return 'Other';
};

const getGroupedActivities = () => {
  const groupOrder = ['Sports', 'Training', 'Horse', 'Games', 'Study', 'Other'];

  return groupOrder
    .map((groupName) => {
      const groupActivities = activities.filter(
        (activity) => getActivityGroup(activity) === groupName
      );

      return {
        groupName,
        groupActivities,
      };
    })
    .filter((group) => group.groupActivities.length > 0);
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
                    Set {setIndex + 1}: {set.reps} reps
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
              <Text key={round.id} style={styles.savedDetailsText}>
                Round {index + 1}: {round.teamOneGames} - {round.teamTwoGames}
              </Text>
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
      return (
        <View style={styles.savedDetailsBox}>
          <Text style={styles.savedDetailsHeader}>Baloot Total:</Text>
          <Text style={styles.savedDetailsText}>
            Us: {session.details.balootUsTotal || 0}
          </Text>
          <Text style={styles.savedDetailsText}>
            Them: {session.details.balootThemTotal || 0}
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
                Hand {index + 1}: Us {score.us} - Them {score.them}
              </Text>
            ))
          )}
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
        Service: {vehicle.serviceType || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Mileage: {vehicle.mileage || 'Not filled'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Cost: {vehicle.cost || '0'}
      </Text>

      <Text style={styles.savedDetailsText}>
        Notes: {vehicle.notes || 'None'}
      </Text>
    </View>
  );
}

    return null;
  };
  if (!isLoggedIn) {
    const isSignupMode = authMode === 'signup';

    return (
    <GestureHandlerRootView style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.loginContainer,
          isSignupMode && styles.signupContainer,
        ]}
      >
        {isSignupMode && (
          <TouchableOpacity
            style={styles.signupCancelButton}
            onPress={() => setAuthMode('signin')}
          >
            <Text style={styles.signupCancelText}>Cancel</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.loginTitle, isSignupMode && styles.signupTitle]}>
          {isSignupMode ? 'Create an account' : 'ActiveTrack'}
        </Text>
        {!isSignupMode && (
          <Text style={styles.loginSubtitle}>Sign in to track your activities</Text>
        )}

        {!isSignupMode && (
          <View style={styles.authModeRow}>
            <TouchableOpacity
              style={[
                styles.authModeButton,
                authMode === 'signin' && styles.authModeButtonActive,
              ]}
              onPress={() => setAuthMode('signin')}
            >
              <Text style={styles.authModeText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.authModeButton}
              onPress={() => setAuthMode('signup')}
            >
              <Text style={styles.authModeText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}

        {isSignupMode && (
          <>
            <Text style={styles.signupLabel}>Name</Text>
            <View style={styles.signupNameRow}>
              <TextInput
                style={[styles.input, styles.signupInput, styles.signupNameInput]}
                placeholder="Raian"
                placeholderTextColor="#555252"
                value={signupFirstName}
                onChangeText={setSignupFirstName}
              />

              <TextInput
                style={[styles.input, styles.signupInput, styles.signupNameInput]}
                placeholder="Abutaleb"
                placeholderTextColor="#555252"
                value={signupLastName}
                onChangeText={setSignupLastName}
              />
            </View>
          </>
        )}

        {isSignupMode && <Text style={styles.signupLabel}>Email</Text>}
        <TextInput
          style={[styles.input, isSignupMode && styles.signupInput]}
          placeholder={isSignupMode ? 'raianabutaleb@outlook.sa' : 'Username or phone number'}
          placeholderTextColor={isSignupMode ? '#555252' : '#8f8f92'}
          value={loginUsername}
          onChangeText={setLoginUsername}
        />

        {isSignupMode && <Text style={styles.signupLabel}>Password</Text>}
        <TextInput
          style={[styles.input, isSignupMode && styles.signupInput]}
          placeholder="Password"
          placeholderTextColor={isSignupMode ? '#555252' : '#8f8f92'}
          value={loginPassword}
          onChangeText={setLoginPassword}
          secureTextEntry
        />

        {isSignupMode && (
          <>
            <Text style={styles.signupLabel}>Repeat password</Text>
            <TextInput
              style={[styles.input, styles.signupInput]}
              placeholder="Repeat password"
              placeholderTextColor="#555252"
              value={signupRepeatPassword}
              onChangeText={setSignupRepeatPassword}
              secureTextEntry
            />

            <Text style={styles.signupHelp}>
              Password must be at least 8 characters.
            </Text>
          </>
        )}

        <TouchableOpacity
          style={[styles.startButton, isSignupMode && styles.signupButton]}
          onPress={isSignupMode ? signup : login}
        >
          <Text style={styles.buttonText}>
            {isSignupMode ? 'Sign Up' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {isSignupMode ? (
          <>
            <Text style={styles.signupLegal}>
              By creating an ActiveTrack account, you agree to save your data on
              this device. We never share your data.
            </Text>

            <Text style={styles.signupDivider}>Or</Text>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => alert('Apple sign-up can be connected later')}
            >
              <Text style={styles.socialButtonText}>Sign up with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => alert('Facebook sign-up can be connected later')}
            >
              <Text style={styles.socialButtonText}>Sign up with Facebook</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => setAuthMode('signup')}>
            <Text style={styles.loginHint}>Create a new account</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
}
  if (selectedActivity) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <ScrollView style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={goBackToList}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{selectedActivity}</Text>
          <Text style={styles.subtitle}>Track your activity session</Text>
          {!isVehicleMaintenanceActivity(selectedActivity) && (
          <TouchableOpacity style={styles.startButton} onPress={startActivity}>
          <Text style={styles.buttonText}>Start Activity</Text>
        </TouchableOpacity>
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
  startTime={startTime}
  endTime={endTime}
/>
<MatchTracker
  selectedActivity={selectedActivity}
  matchTeamOneName={matchTeamOneName}
  setMatchTeamOneName={setMatchTeamOneName}
  matchTeamTwoName={matchTeamTwoName}
  setMatchTeamTwoName={setMatchTeamTwoName}
  matchTeamOneGames={matchTeamOneGames}
  setMatchTeamOneGames={setMatchTeamOneGames}
  matchTeamTwoGames={matchTeamTwoGames}
  setMatchTeamTwoGames={setMatchTeamTwoGames}
  matchRounds={matchRounds}
  setMatchRounds={setMatchRounds}
/>          
          <BalootTracker
  selectedActivity={selectedActivity}
  balootUsScore={balootUsScore}
  setBalootUsScore={setBalootUsScore}
  balootThemScore={balootThemScore}
  setBalootThemScore={setBalootThemScore}
  balootScores={balootScores}
  setBalootScores={setBalootScores}
  balootDealerDirection={balootDealerDirection}
  setBalootDealerDirection={setBalootDealerDirection}
/>
          
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
      placeholderTextColor="#8f8f92"
      value={vehicleName}
      onChangeText={setVehicleName}
    />

    <Text style={styles.savedDetailsText}>Service Type</Text>

    {['Tire Change', 'Battery', 'Oil Change', 'Other Service', 'Gas Filling'].map((service) => (
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
      placeholder="Mileage / KM"
      placeholderTextColor="#8f8f92"
      value={vehicleMileage}
      onChangeText={setVehicleMileage}
      keyboardType="numeric"
    />

    <TextInput
      style={styles.input}
      placeholder="Cost"
      placeholderTextColor="#8f8f92"
      value={vehicleCost}
      onChangeText={setVehicleCost}
      keyboardType="numeric"
    />

    <TextInput
      style={styles.input}
      placeholder="Notes"
      placeholderTextColor="#8f8f92"
      value={vehicleNotes}
      onChangeText={setVehicleNotes}
      multiline
    />
  </View>
)}

          {!isVehicleMaintenanceActivity(selectedActivity) && (
  <TouchableOpacity style={styles.endButton} onPress={endActivity}>
    <Text style={styles.buttonText}>End Activity</Text>
  </TouchableOpacity>
)}

          {!isVehicleMaintenanceActivity(selectedActivity) && (
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

  <TouchableOpacity style={styles.saveButton} onPress={saveSession}>
  <Text style={styles.buttonText}>
    {isVehicleMaintenanceActivity(selectedActivity) ? 'Save Maintenance' : 'Save Session'}
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
          <Text style={styles.title}>ActiveTrack</Text>
          <Text style={styles.subtitle}>Welcome, {loginUsername}</Text>

          <Text style={styles.homeDescription}>
            Track sports, training, horse riding, studying, and game sessions.
          </Text>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          <View style={styles.statsBox}>
            <Text style={styles.statsTitle}>Stats</Text>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Sessions</Text>
              <Text style={styles.statValue}>{sessions.length}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Time</Text>
              <Text style={styles.statValue}>{getTotalTime()}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Most Practiced</Text>
              <Text style={styles.statValue}>{getMostPracticedActivity()}</Text>
            </View>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity style={styles.addButton} onPress={openOtherModal}>
              <Text style={styles.smallActionText}>+ Add Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={resetActivityList}>
              <Text style={styles.smallActionText}>Reset List</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hintText}>
            Swipe left on an activity to delete it
          </Text>

          <View style={styles.activityList}>
            {activities.length === 0 ? (
              <Text style={styles.emptyHistory}>
                No activities available. Press Add Activity or Reset List.
              </Text>
            ) : (
              getGroupedActivities().map((group) => (
                <View key={group.groupName} style={styles.activityGroup}>
                  <Text style={styles.activityGroupTitle}>
                    {group.groupName}
                  </Text>

                  {group.groupActivities.map((activity) => (
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
                        <Text style={styles.activityText}>{activity}</Text>
                      </TouchableOpacity>
                    </Swipeable>
                  ))}
                </View>
              ))
            )}
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
                placeholderTextColor="#8f8f92"
                value={otherActivityName}
                onChangeText={setOtherActivityName}
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
    backgroundColor: '#0f0f10',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#0f0f10',
  },
  backButton: {
    marginTop: 55,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 60,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#b8b8bb',
    marginBottom: 24,
  },
  statsBox: {
    backgroundColor: '#1f1f22',
    padding: 18,
    borderRadius: 16,
    marginBottom: 22,
  },
  statsTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  statRow: {
    marginBottom: 12,
  },
  statLabel: {
    color: '#b8b8bb',
    fontSize: 15,
    marginBottom: 3,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  hintText: {
    color: '#a7a7aa',
    fontSize: 14,
    marginBottom: 12,
  },
  topActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#4a4a4d',
    padding: 14,
    borderRadius: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#3a3a3d',
    padding: 14,
    borderRadius: 12,
  },
  smallActionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  activityGroup: {
  marginBottom: 18,
},

activityGroupTitle: {
  color: '#ffffff',
  fontSize: 22,
  fontWeight: 'bold',
  marginBottom: 12,
},
  activityList: {
    gap: 12,
    paddingBottom: 30,
  },
  activityButton: {
    backgroundColor: '#4a4a4d',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  activityText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  swipeDeleteAction: {
    backgroundColor: '#3f3f42',
    justifyContent: 'center',
    alignItems: 'center',
    width: 95,
    borderRadius: 14,
    marginBottom: 12,
  },
  swipeDeleteText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  addExerciseButton: {
    backgroundColor: '#5a5a5d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 14,
  },
  deleteLastButton: {
    backgroundColor: '#3f3f42',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  resetLapButton: {
    backgroundColor: '#3a3a3d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  exerciseListBox: {
    backgroundColor: '#0f0f10',
    padding: 14,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  exerciseListTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#3a3a3d',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  exerciseDeleteButton: {
    backgroundColor: '#3f3f42',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  exerciseDeleteText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  balootTotalBox: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  balootTotalColumn: {
    flex: 1,
    backgroundColor: '#0f0f10',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  balootSideTitle: {
    color: '#b8b8bb',
    fontSize: 18,
    marginBottom: 8,
  },
  balootTotalNumber: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: 'bold',
  },
  winnerBox: {
    backgroundColor: '#0f0f10',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  winnerLabel: {
    color: '#b8b8bb',
    fontSize: 15,
    marginBottom: 4,
  },
  winnerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dealerBox: {
    backgroundColor: '#0f0f10',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  dealerTitle: {
    color: '#b8b8bb',
    fontSize: 16,
    marginBottom: 8,
  },
  dealerArrow: {
    color: '#ffffff',
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dealerHint: {
    color: '#a7a7aa',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#4a4a4d',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
  },
  endButton: {
    backgroundColor: '#3f3f42',
    padding: 18,
    borderRadius: 14,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#5a5a5d',
    padding: 18,
    borderRadius: 14,
    marginTop: 24,
    marginBottom: 60,
  },
  cancelButton: {
    backgroundColor: '#3f3f42',
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#1f1f22',
    padding: 18,
    borderRadius: 14,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 17,
    marginBottom: 10,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 20,
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
    backgroundColor: '#1f1f22',
    borderRadius: 18,
    padding: 24,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#b8b8bb',
    fontSize: 16,
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 12,
    color: '#000000',
  },
  historyFilterScroll: {
  marginBottom: 14,
},

historyFilterButton: {
  backgroundColor: '#1f1f22',
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 20,
  marginRight: 10,
  borderWidth: 1,
  borderColor: '#3a3a3d',
},

historyFilterButtonActive: {
  backgroundColor: '#4a4a4d',
  borderColor: '#4a4a4d',
},

historyFilterText: {
  color: '#b8b8bb',
  fontSize: 14,
  fontWeight: '600',
},

historyFilterTextActive: {
  color: '#ffffff',
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
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  clearHistoryButton: {
    backgroundColor: '#3f3f42',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  clearHistoryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyHistory: {
    color: '#b8b8bb',
    fontSize: 16,
  },
  sessionCard: {
    backgroundColor: '#1f1f22',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  sessionActivity: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sessionText: {
    color: '#d6d6d8',
    fontSize: 16,
    marginBottom: 4,
  },
  sessionDuration: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 6,
  },
  savedDetailsBox: {
    marginTop: 10,
    backgroundColor: '#0f0f10',
    padding: 12,
    borderRadius: 10,
  },
  savedDetailsHeader: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  savedDetailsText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 4,
  },
  savedSetText: {
    color: '#d6d6d8',
    fontSize: 15,
    marginLeft: 12,
    marginBottom: 3,
  },
  savedExerciseBlock: {
    marginBottom: 10,
  },
  loginContainer: {
  flexGrow: 1,
  backgroundColor: '#0f0f10',
  padding: 24,
  justifyContent: 'center',
},
signupContainer: {
  backgroundColor: '#ffffff',
  justifyContent: 'flex-start',
  paddingTop: 36,
},
loginTitle: {
  fontSize: 42,
  fontWeight: 'bold',
  color: '#ffffff',
  marginBottom: 8,
  textAlign: 'center',
},
signupTitle: {
  color: '#171717',
  fontSize: 38,
  textAlign: 'left',
  marginTop: 24,
  marginBottom: 30,
},
loginSubtitle: {
  fontSize: 18,
  color: '#b8b8bb',
  marginBottom: 30,
  textAlign: 'center',
},
loginHint: {
  color: '#a7a7aa',
  fontSize: 14,
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
  borderColor: '#3a3a3d',
  borderWidth: 1,
  borderRadius: 12,
  padding: 12,
},
authModeButtonActive: {
  backgroundColor: '#4a4a4d',
},
authModeText: {
  color: '#ffffff',
  fontWeight: '800',
  textAlign: 'center',
},
signupCancelButton: {
  alignSelf: 'flex-start',
  borderColor: '#d7d4cf',
  borderWidth: 1,
  borderRadius: 999,
  paddingVertical: 10,
  paddingHorizontal: 24,
},
signupCancelText: {
  color: '#171717',
  fontSize: 18,
  fontWeight: '500',
},
signupLabel: {
  color: '#6d6a6a',
  fontSize: 18,
  marginBottom: 8,
},
signupNameRow: {
  flexDirection: 'row',
  gap: 12,
  marginBottom: 12,
},
signupNameInput: {
  flex: 1,
},
signupInput: {
  backgroundColor: '#efedf2',
  color: '#171717',
  borderRadius: 12,
  marginBottom: 14,
},
signupHelp: {
  color: '#686464',
  fontSize: 14,
  marginBottom: 22,
},
signupButton: {
  backgroundColor: '#f26543',
  borderRadius: 999,
  marginBottom: 14,
},
signupLegal: {
  color: '#686464',
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 16,
},
signupDivider: {
  color: '#555252',
  fontSize: 18,
  textAlign: 'center',
  marginBottom: 16,
},
socialButton: {
  borderColor: '#9b9999',
  borderWidth: 1,
  borderRadius: 999,
  padding: 15,
  marginBottom: 12,
},
socialButtonText: {
  color: '#555252',
  fontSize: 18,
  fontWeight: '700',
  textAlign: 'center',
},
logoutButton: {
  backgroundColor: '#3a3a3d',
  padding: 12,
  borderRadius: 12,
  marginBottom: 20,
},
logoutButtonText: {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: '700',
  textAlign: 'center',
},
homeDescription: {
  color: '#a7a7aa',
  fontSize: 15,
  lineHeight: 22,
  marginBottom: 20,
},
sessionTopRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},

activityBadge: {
  backgroundColor: '#4a4a4d',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 999,
},

activityBadgeText: {
  color: '#ffffff',
  fontSize: 14,
  fontWeight: '700',
},

sessionDate: {
  color: '#b8b8bb',
  fontSize: 14,
  fontWeight: '600',
},

sessionDurationLarge: {
  color: '#ffffff',
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 10,
},

sessionTimeRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#0f0f10',
  padding: 12,
  borderRadius: 10,
  marginBottom: 8,
},

sessionTimeText: {
  color: '#d6d6d8',
  fontSize: 14,
  fontWeight: '600',
},
selectedOptionButton: {
  backgroundColor: '#5a5a5d',
},
});
