import AsyncStorage from '@react-native-async-storage/async-storage';
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
];

const gymWorkoutDays = [
  'Chest',
  'Back',
  'Legs',
  'Shoulder',
  'Arms',
  'Abs',
  'Rest',
];

const lapActivities = ['Run', 'Walking', 'Cycling', 'Swimming'];
const matchActivities = ['Padel', 'Tennis'];

type GymSet = {
  id: number;
  reps: string;
};

type GymExercise = {
  id: number;
  name: string;
  sets: GymSet[];
};

type MatchRound = {
  id: number;
  teamOneGames: string;
  teamTwoGames: string;
};

type SessionDetails = {
  teamOneName?: string;
  teamTwoName?: string;
  teamOneScore?: string;
  teamTwoScore?: string;

  gymWorkoutDay?: string;
  gymExercises?: GymExercise[];

  laps?: number;
  lapDistance?: string;
  lapDistanceUnit?: string;
  totalDistance?: string;

  matchTeamOneName?: string;
  matchTeamTwoName?: string;
  matchRounds?: MatchRound[];
  matchTeamOneTotal?: number;
  matchTeamTwoTotal?: number;
};

type Session = {
  id: number;
  activity: string;
  start: string;
  end: string;
  duration: string;
  durationSeconds?: number;
  date: string;
  details?: SessionDetails;
};

export default function HomeScreen() {
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

  useEffect(() => {
    loadSavedData();
  }, []);

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

  const addLap = () => {
    if (!startTime) {
      alert('Please start the activity first');
      return;
    }

    if (endTime) {
      alert('Activity already ended');
      return;
    }

    setLapCount(lapCount + 1);
  };

  const resetLaps = () => {
    setLapCount(0);
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

  const addGymSet = () => {
    const cleanReps = gymSetReps.trim();

    if (cleanReps === '') {
      alert('Please enter reps for this set');
      return;
    }

    const newSet: GymSet = {
      id: Date.now(),
      reps: cleanReps,
    };

    setCurrentGymSets([...currentGymSets, newSet]);
    setGymSetReps('');
  };

  const deleteCurrentGymSet = (setId: number) => {
    const newSets = currentGymSets.filter((set) => set.id !== setId);
    setCurrentGymSets(newSets);
  };

  const saveGymExercise = () => {
    const cleanExerciseName = gymExerciseName.trim();

    if (cleanExerciseName === '') {
      alert('Please enter exercise name');
      return;
    }

    if (currentGymSets.length === 0) {
      alert('Please add at least one set');
      return;
    }

    const newExercise: GymExercise = {
      id: Date.now(),
      name: cleanExerciseName,
      sets: currentGymSets,
    };

    setGymExercises([...gymExercises, newExercise]);

    setGymExerciseName('');
    setGymSetReps('');
    setCurrentGymSets([]);
  };

  const deleteGymExercise = (exerciseId: number) => {
    const newExercises = gymExercises.filter((exercise) => exercise.id !== exerciseId);
    setGymExercises(newExercises);
  };

  const addMatchRound = () => {
    const cleanTeamOneGames = matchTeamOneGames.trim();
    const cleanTeamTwoGames = matchTeamTwoGames.trim();

    if (cleanTeamOneGames === '') {
      alert('Please enter Team 1 games');
      return;
    }

    if (cleanTeamTwoGames === '') {
      alert('Please enter Team 2 games');
      return;
    }

    const teamOneNumber = Number(cleanTeamOneGames);
    const teamTwoNumber = Number(cleanTeamTwoGames);

    if (Number.isNaN(teamOneNumber) || Number.isNaN(teamTwoNumber)) {
      alert('Games must be numbers');
      return;
    }

    if (teamOneNumber > 6 || teamTwoNumber > 6) {
      alert('Each round should be 6 games or less');
      return;
    }

    const newRound: MatchRound = {
      id: Date.now(),
      teamOneGames: cleanTeamOneGames,
      teamTwoGames: cleanTeamTwoGames,
    };

    setMatchRounds([...matchRounds, newRound]);
    setMatchTeamOneGames('');
    setMatchTeamTwoGames('');
  };

  const deleteMatchRound = (roundId: number) => {
    const newRounds = matchRounds.filter((round) => round.id !== roundId);
    setMatchRounds(newRounds);
  };

  const getMatchTeamOneTotal = () => {
    return matchRounds.reduce((total, round) => {
      return total + Number(round.teamOneGames || 0);
    }, 0);
  };

  const getMatchTeamTwoTotal = () => {
    return matchRounds.reduce((total, round) => {
      return total + Number(round.teamTwoGames || 0);
    }, 0);
  };

  const saveSession = () => {
    if (!selectedActivity || !startTime || !endTime) {
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

    const newSession: Session = {
      id: Date.now(),
      activity: selectedActivity,
      start: startTime.toLocaleTimeString(),
      end: endTime.toLocaleTimeString(),
      duration: getDuration(),
      durationSeconds: getDurationSeconds(),
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

  const renderFootballFields = () => {
    if (selectedActivity !== 'Football') {
      return null;
    }

    return (
      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Football Details</Text>

        <TextInput
          style={styles.input}
          placeholder="Team 1 name"
          placeholderTextColor="#888"
          value={footballTeamOneName}
          onChangeText={setFootballTeamOneName}
        />

        <TextInput
          style={styles.input}
          placeholder="Team 2 name"
          placeholderTextColor="#888"
          value={footballTeamTwoName}
          onChangeText={setFootballTeamTwoName}
        />

        <View style={styles.scoreRow}>
          <TextInput
            style={styles.scoreInput}
            placeholder="Team 1 score"
            placeholderTextColor="#888"
            value={footballTeamOneScore}
            onChangeText={setFootballTeamOneScore}
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.scoreInput}
            placeholder="Team 2 score"
            placeholderTextColor="#888"
            value={footballTeamTwoScore}
            onChangeText={setFootballTeamTwoScore}
            keyboardType="number-pad"
          />
        </View>
      </View>
    );
  };

  const renderGymFields = () => {
    if (selectedActivity !== 'Gym') {
      return null;
    }

    return (
      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Gym Workout</Text>
        <Text style={styles.detailsSubtitle}>Choose workout day</Text>

        <View style={styles.workoutGrid}>
          {gymWorkoutDays.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.workoutButton,
                gymWorkoutDay === day && styles.selectedWorkoutButton,
              ]}
              onPress={() => setGymWorkoutDay(day)}
            >
              <Text
                style={[
                  styles.workoutButtonText,
                  gymWorkoutDay === day && styles.selectedWorkoutButtonText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.detailsSubtitle}>Current Exercise</Text>

        <TextInput
          style={styles.input}
          placeholder="Exercise name, example: Bench Press"
          placeholderTextColor="#888"
          value={gymExerciseName}
          onChangeText={setGymExerciseName}
        />

        <View style={styles.scoreRow}>
          <TextInput
            style={styles.scoreInput}
            placeholder="Set reps"
            placeholderTextColor="#888"
            value={gymSetReps}
            onChangeText={setGymSetReps}
            keyboardType="number-pad"
          />

          <TouchableOpacity style={styles.addSetButton} onPress={addGymSet}>
            <Text style={styles.addSetText}>+ Set</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.exerciseListBox}>
          <Text style={styles.exerciseListTitle}>Sets for This Exercise</Text>

          {currentGymSets.length === 0 ? (
            <Text style={styles.emptyHistory}>No sets added yet</Text>
          ) : (
            currentGymSets.map((set, index) => (
              <View key={set.id} style={styles.exerciseRow}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>
                    Set {index + 1}: {set.reps} reps
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.exerciseDeleteButton}
                  onPress={() => deleteCurrentGymSet(set.id)}
                >
                  <Text style={styles.exerciseDeleteText}>X</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.addExerciseButton} onPress={saveGymExercise}>
          <Text style={styles.buttonText}>Save Exercise</Text>
        </TouchableOpacity>

        <View style={styles.exerciseListBox}>
          <Text style={styles.exerciseListTitle}>Exercises Added</Text>

          {gymExercises.length === 0 ? (
            <Text style={styles.emptyHistory}>No exercises saved yet</Text>
          ) : (
            gymExercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseRow}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>
                    {index + 1}. {exercise.name}
                  </Text>

                  {exercise.sets.map((set, setIndex) => (
                    <Text key={set.id} style={styles.exerciseDetails}>
                      Set {setIndex + 1}: {set.reps} reps
                    </Text>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.exerciseDeleteButton}
                  onPress={() => deleteGymExercise(exercise.id)}
                >
                  <Text style={styles.exerciseDeleteText}>X</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>
    );
  };

  const renderLapFields = () => {
    if (!isLapActivity(selectedActivity)) {
      return null;
    }

    return (
      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>{selectedActivity} Laps</Text>

        <Text style={styles.detailsSubtitle}>Lap distance</Text>

        <View style={styles.scoreRow}>
          <TextInput
            style={styles.scoreInput}
            placeholder="Lap distance"
            placeholderTextColor="#888"
            value={lapDistance}
            onChangeText={setLapDistance}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity
            style={[
              styles.unitButton,
              lapDistanceUnit === 'm' && styles.selectedUnitButton,
            ]}
            onPress={() => setLapDistanceUnit('m')}
          >
            <Text style={styles.unitButtonText}>m</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.unitButton,
              lapDistanceUnit === 'km' && styles.selectedUnitButton,
            ]}
            onPress={() => setLapDistanceUnit('km')}
          >
            <Text style={styles.unitButtonText}>km</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lapBox}>
          <Text style={styles.lapNumber}>{lapCount}</Text>
          <Text style={styles.lapLabel}>laps completed</Text>
          <Text style={styles.totalDistanceText}>
            Total distance: {getTotalLapDistance()}
          </Text>
        </View>

        <TouchableOpacity style={styles.addExerciseButton} onPress={addLap}>
          <Text style={styles.buttonText}>+ Add Lap</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetLapButton} onPress={resetLaps}>
          <Text style={styles.buttonText}>Reset Laps</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMatchFields = () => {
    if (!isMatchActivity(selectedActivity)) {
      return null;
    }

    return (
      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>{selectedActivity} Match</Text>

        <TextInput
          style={styles.input}
          placeholder="Team 1 name"
          placeholderTextColor="#888"
          value={matchTeamOneName}
          onChangeText={setMatchTeamOneName}
        />

        <TextInput
          style={styles.input}
          placeholder="Team 2 name"
          placeholderTextColor="#888"
          value={matchTeamTwoName}
          onChangeText={setMatchTeamTwoName}
        />

        <Text style={styles.detailsSubtitle}>Add round score</Text>

        <View style={styles.scoreRow}>
          <TextInput
            style={styles.scoreInput}
            placeholder="Team 1 games"
            placeholderTextColor="#888"
            value={matchTeamOneGames}
            onChangeText={setMatchTeamOneGames}
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.scoreInput}
            placeholder="Team 2 games"
            placeholderTextColor="#888"
            value={matchTeamTwoGames}
            onChangeText={setMatchTeamTwoGames}
            keyboardType="number-pad"
          />
        </View>

        <TouchableOpacity style={styles.addExerciseButton} onPress={addMatchRound}>
          <Text style={styles.buttonText}>+ Add Round</Text>
        </TouchableOpacity>

        <View style={styles.exerciseListBox}>
          <Text style={styles.exerciseListTitle}>Rounds Added</Text>

          {matchRounds.length === 0 ? (
            <Text style={styles.emptyHistory}>No rounds added yet</Text>
          ) : (
            matchRounds.map((round, index) => (
              <View key={round.id} style={styles.exerciseRow}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>
                    Round {index + 1}: {round.teamOneGames} - {round.teamTwoGames}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.exerciseDeleteButton}
                  onPress={() => deleteMatchRound(round.id)}
                >
                  <Text style={styles.exerciseDeleteText}>X</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={styles.matchTotalBox}>
          <Text style={styles.matchTotalTitle}>Total Games</Text>
          <Text style={styles.matchTotalText}>
            {matchTeamOneName || 'Team 1'}: {getMatchTeamOneTotal()}
          </Text>
          <Text style={styles.matchTotalText}>
            {matchTeamTwoName || 'Team 2'}: {getMatchTeamTwoTotal()}
          </Text>
        </View>
      </View>
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

    return null;
  };

  if (selectedActivity) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <ScrollView style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={goBackToList}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{selectedActivity}</Text>
          <Text style={styles.subtitle}>Track your activity session</Text>

          {renderFootballFields()}
          {renderGymFields()}
          {renderLapFields()}
          {renderMatchFields()}

          <TouchableOpacity style={styles.startButton} onPress={startActivity}>
            <Text style={styles.buttonText}>Start Activity</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.endButton} onPress={endActivity}>
            <Text style={styles.buttonText}>End Activity</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Start: {startTime ? startTime.toLocaleTimeString() : 'Not started'}
            </Text>

            <Text style={styles.infoText}>
              End: {endTime ? endTime.toLocaleTimeString() : 'Not ended'}
            </Text>

            <Text style={styles.durationText}>Duration: {getDuration()}</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveSession}>
            <Text style={styles.buttonText}>Save Session</Text>
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
          <Text style={styles.subtitle}>Choose your activity</Text>

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

          <Text style={styles.hintText}>Swipe left on an activity to delete it</Text>

          <View style={styles.activityList}>
            {activities.length === 0 ? (
              <Text style={styles.emptyHistory}>
                No activities available. Press Add Activity or Reset List.
              </Text>
            ) : (
              activities.map((activity) => (
                <Swipeable
                  key={activity}
                  renderRightActions={() => renderActivityDeleteAction(activity)}
                >
                  <TouchableOpacity
                    style={styles.activityButton}
                    onPress={() => openActivity(activity)}
                  >
                    <Text style={styles.activityText}>{activity}</Text>
                  </TouchableOpacity>
                </Swipeable>
              ))
            )}
          </View>

          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>History</Text>

              {sessions.length > 0 && (
                <TouchableOpacity style={styles.clearHistoryButton} onPress={clearAllHistory}>
                  <Text style={styles.clearHistoryText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {sessions.length > 0 && (
              <Text style={styles.hintText}>Swipe left on a session to delete it</Text>
            )}

            {sessions.length === 0 ? (
              <Text style={styles.emptyHistory}>No sessions saved yet</Text>
            ) : (
              sessions.map((session) => (
                <Swipeable
                  key={session.id}
                  renderRightActions={() => renderSessionDeleteAction(session.id)}
                >
                  <View style={styles.sessionCard}>
                    <Text style={styles.sessionActivity}>{session.activity}</Text>
                    <Text style={styles.sessionText}>Date: {session.date}</Text>
                    <Text style={styles.sessionText}>Start: {session.start}</Text>
                    <Text style={styles.sessionText}>End: {session.end}</Text>
                    <Text style={styles.sessionDuration}>
                      Duration: {session.duration}
                    </Text>

                    {renderSessionDetails(session)}
                  </View>
                </Swipeable>
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
                placeholderTextColor="#888"
                value={otherActivityName}
                onChangeText={setOtherActivityName}
              />

              <TouchableOpacity style={styles.startButton} onPress={addOtherActivity}>
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
    backgroundColor: '#101820',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#101820',
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
    color: '#b0b0b0',
    marginBottom: 24,
  },
  statsBox: {
    backgroundColor: '#1b2733',
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
    color: '#b0b0b0',
    fontSize: 15,
    marginBottom: 3,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  hintText: {
    color: '#9ca3af',
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
    backgroundColor: '#1f8a70',
    padding: 14,
    borderRadius: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#34495e',
    padding: 14,
    borderRadius: 12,
  },
  smallActionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  activityList: {
    gap: 12,
    paddingBottom: 30,
  },
  activityButton: {
    backgroundColor: '#1f8a70',
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
    backgroundColor: '#b84040',
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
  detailsBox: {
    backgroundColor: '#1b2733',
    padding: 18,
    borderRadius: 16,
    marginBottom: 22,
  },
  detailsTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  detailsSubtitle: {
    color: '#b0b0b0',
    fontSize: 16,
    marginBottom: 12,
  },
  workoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  workoutButton: {
    backgroundColor: '#34495e',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  selectedWorkoutButton: {
    backgroundColor: '#1f8a70',
  },
  workoutButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  selectedWorkoutButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
  },
  scoreInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    color: '#000000',
  },
  unitButton: {
    backgroundColor: '#34495e',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedUnitButton: {
    backgroundColor: '#1f8a70',
  },
  unitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  addSetButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 18,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSetText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  addExerciseButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 14,
  },
  resetLapButton: {
    backgroundColor: '#34495e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  lapBox: {
    backgroundColor: '#101820',
    padding: 22,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  lapNumber: {
    color: '#ffffff',
    fontSize: 54,
    fontWeight: 'bold',
  },
  lapLabel: {
    color: '#b0b0b0',
    fontSize: 17,
    marginTop: 4,
  },
  totalDistanceText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  exerciseListBox: {
    backgroundColor: '#101820',
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
    borderBottomColor: '#34495e',
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
  exerciseDetails: {
    color: '#b0b0b0',
    fontSize: 15,
    marginBottom: 2,
  },
  exerciseDeleteButton: {
    backgroundColor: '#b84040',
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
  matchTotalBox: {
    backgroundColor: '#101820',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  matchTotalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  matchTotalText: {
    color: '#ffffff',
    fontSize: 17,
    marginBottom: 4,
  },
  startButton: {
    backgroundColor: '#1f8a70',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
  },
  endButton: {
    backgroundColor: '#b84040',
    padding: 18,
    borderRadius: 14,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    padding: 18,
    borderRadius: 14,
    marginTop: 24,
    marginBottom: 60,
  },
  cancelButton: {
    backgroundColor: '#b84040',
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
    backgroundColor: '#1b2733',
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
    backgroundColor: '#1b2733',
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
    color: '#b0b0b0',
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
    backgroundColor: '#b84040',
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
    color: '#b0b0b0',
    fontSize: 16,
  },
  sessionCard: {
    backgroundColor: '#1b2733',
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
    color: '#d0d0d0',
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
    backgroundColor: '#101820',
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
    color: '#d0d0d0',
    fontSize: 15,
    marginLeft: 12,
    marginBottom: 3,
  },
  savedExerciseBlock: {
    marginBottom: 10,
  },
});