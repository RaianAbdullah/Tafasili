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

type Session = {
  id: number;
  activity: string;
  start: string;
  end: string;
  duration: string;
  durationSeconds?: number;
  date: string;
  details?: {
    teamOneName?: string;
    teamTwoName?: string;
    teamOneScore?: string;
    teamTwoScore?: string;
  };
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

  const resetActivityFields = () => {
    setFootballTeamOneName('');
    setFootballTeamTwoName('');
    setFootballTeamOneScore('');
    setFootballTeamTwoScore('');
  };

  const openActivity = (activity: string) => {
    setSelectedActivity(activity);
    setStartTime(null);
    setEndTime(null);
    resetActivityFields();
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
        {
          text: 'Cancel',
          style: 'cancel',
        },
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
        {
          text: 'Cancel',
          style: 'cancel',
        },
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

  const saveSession = () => {
    if (!selectedActivity || !startTime || !endTime) {
      alert('Please start and end the activity first');
      return;
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
        {
          text: 'Cancel',
          style: 'cancel',
        },
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
        {
          text: 'Cancel',
          style: 'cancel',
        },
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
  savedDetailsText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 4,
  },
});