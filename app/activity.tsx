import { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const activities = [
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
  'Other',
];

export default function HomeScreen() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [otherActivityName, setOtherActivityName] = useState('');

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const openActivity = (activity: string) => {
    if (activity === 'Other') {
      setOtherActivityName('');
      setShowOtherModal(true);
      return;
    }

    setSelectedActivity(activity);
    setStartTime(null);
    setEndTime(null);
  };

  const startOtherActivity = () => {
    const cleanName = otherActivityName.trim();

    if (cleanName === '') {
      alert('Please enter an activity name');
      return;
    }

    setShowOtherModal(false);
    setSelectedActivity(cleanName);
    setStartTime(null);
    setEndTime(null);
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

  const getDuration = () => {
    if (!startTime || !endTime) {
      return 'Not finished yet';
    }

    const difference = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(difference / 1000 / 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${minutes} min ${seconds} sec`;
  };

  const saveSession = () => {
    if (!selectedActivity || !startTime || !endTime) {
      alert('Please start and end the activity first');
      return;
    }

    alert(
      `Saved session:\n\nActivity: ${selectedActivity}\nStart: ${startTime.toLocaleTimeString()}\nEnd: ${endTime.toLocaleTimeString()}\nDuration: ${getDuration()}`
    );
  };

  const goBackToList = () => {
    setSelectedActivity(null);
    setStartTime(null);
    setEndTime(null);
  };

  if (selectedActivity) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={goBackToList}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{selectedActivity}</Text>
        <Text style={styles.subtitle}>Track your activity session</Text>

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
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Tafasili</Text>
        <Text style={styles.subtitle}>Choose your activity</Text>

        <View style={styles.activityList}>
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity}
              style={[
                styles.activityButton,
                activity === 'Other' && styles.otherButton,
              ]}
              onPress={() => openActivity(activity)}
            >
              <Text style={styles.activityText}>{activity}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showOtherModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Other Activity</Text>
            <Text style={styles.modalSubtitle}>Enter activity name</Text>

            <TextInput
              style={styles.input}
              placeholder="Example: Boxing"
              placeholderTextColor="#050505"
              value={otherActivityName}
              onChangeText={setOtherActivityName}
            />

            <TouchableOpacity style={styles.startButton} onPress={startOtherActivity}>
              <Text style={styles.buttonText}>Start</Text>
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
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },
  container: {
    flex: 1,
    padding: 24,
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
    fontSize: 17,
    color: '#050505',
    marginBottom: 24,
  },
  activityList: {
    gap: 12,
    paddingBottom: 40,
  },
  activityButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    padding: 18,
    borderRadius: 14,
  },
  otherButton: {
    backgroundColor: '#E7E9EE',
  },
  activityText: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#E7E9EE',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
  },
  endButton: {
    backgroundColor: '#E7E9EE',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    padding: 18,
    borderRadius: 14,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#E7E9EE',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    padding: 18,
    borderRadius: 14,
    marginTop: 24,
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
    marginBottom: 18,
    color: '#050505',
  },
});
