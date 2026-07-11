import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Session } from '../../types';

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [historyFilter, setHistoryFilter] = useState('All');

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [])
  );

  const loadSessions = async () => {
    try {
      const savedSessions = await AsyncStorage.getItem('sessions');

      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      } else {
        setSessions([]);
      }
    } catch (error) {
      alert('Error loading history');
    }
  };

  const saveSessions = async (updatedSessions: Session[]) => {
    try {
      await AsyncStorage.setItem(
        'sessions',
        JSON.stringify(updatedSessions)
      );
    } catch (error) {
      alert('Error saving history');
    }
  };

  const deleteSession = async (sessionId: number) => {
    const updatedSessions = sessions.filter(
      (session) => session.id !== sessionId
    );

    setSessions(updatedSessions);
    await saveSessions(updatedSessions);
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
          onPress: async () => {
            setSessions([]);
            setHistoryFilter('All');
            await saveSessions([]);
          },
        },
      ]
    );
  };

  const getActivityFilters = () => {
    const activityNames = sessions.map(
      (session) => session.activity
    );

    const uniqueActivities = Array.from(
      new Set(activityNames)
    );

    return ['All', ...uniqueActivities];
  };

  const getFilteredSessions = () => {
    if (historyFilter === 'All') {
      return sessions;
    }

    return sessions.filter(
      (session) => session.activity === historyFilter
    );
  };

  const isVehicleMaintenanceActivity = (
    activity: string | null
  ) => {
    return activity === 'Vehicle Maintenance';
  };

  const renderSessionDetails = (session: Session) => {
    if (session.activity === 'Football' && session.details) {
      return (
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>Football</Text>

          <Text style={styles.detailsText}>
            Team 1: {session.details.teamOneName || 'Not filled'}
          </Text>

          <Text style={styles.detailsText}>
            Team 2: {session.details.teamTwoName || 'Not filled'}
          </Text>

          <Text style={styles.detailsText}>
            Score: {session.details.teamOneScore || '0'} -{' '}
            {session.details.teamTwoScore || '0'}
          </Text>
        </View>
      );
    }

    if (session.activity === 'Gym' && session.details) {
      return (
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>Gym Workout</Text>

          <Text style={styles.detailsText}>
            Workout Day:{' '}
            {session.details.gymWorkoutDay || 'Not filled'}
          </Text>

          <Text style={styles.detailsSectionTitle}>
            Exercises
          </Text>

          {!session.details.gymExercises ||
          session.details.gymExercises.length === 0 ? (
            <Text style={styles.detailsText}>
              No exercises saved
            </Text>
          ) : (
            session.details.gymExercises.map(
              (exercise, exerciseIndex) => (
                <View
                  key={exercise.id}
                  style={styles.exerciseBlock}
                >
                  <Text style={styles.detailsText}>
                    {exerciseIndex + 1}. {exercise.name}
                  </Text>

                  {exercise.sets.map((set, setIndex) => (
                    <Text
                      key={set.id}
                      style={styles.setText}
                    >
                      Set {setIndex + 1}: {set.reps} reps
                    </Text>
                  ))}
                </View>
              )
            )
          )}
        </View>
      );
    }

    if (
      ['Run', 'Walking', 'Cycling', 'Swimming'].includes(
        session.activity
      ) &&
      session.details
    ) {
      return (
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>
            Distance Details
          </Text>

          <Text style={styles.detailsText}>
            Laps: {session.details.laps || 0}
          </Text>

          <Text style={styles.detailsText}>
            Lap Distance:{' '}
            {session.details.lapDistance || '0'}{' '}
            {session.details.lapDistanceUnit || 'm'}
          </Text>

          <Text style={styles.detailsText}>
            Total Distance:{' '}
            {session.details.totalDistance || '0 m'}
          </Text>
        </View>
      );
    }

    if (
      ['Padel', 'Tennis'].includes(session.activity) &&
      session.details
    ) {
      return (
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>
            Match Details
          </Text>

          <Text style={styles.detailsText}>
            Team 1:{' '}
            {session.details.matchTeamOneName || 'Not filled'}
          </Text>

          <Text style={styles.detailsText}>
            Team 2:{' '}
            {session.details.matchTeamTwoName || 'Not filled'}
          </Text>

          <Text style={styles.detailsSectionTitle}>
            Rounds
          </Text>

          {!session.details.matchRounds ||
          session.details.matchRounds.length === 0 ? (
            <Text style={styles.detailsText}>
              No rounds saved
            </Text>
          ) : (
            session.details.matchRounds.map(
              (round, roundIndex) => (
                <Text
                  key={round.id}
                  style={styles.detailsText}
                >
                  Round {roundIndex + 1}:{' '}
                  {round.teamOneGames} - {round.teamTwoGames}
                </Text>
              )
            )
          )}

          <Text style={styles.detailsSectionTitle}>
            Total Games
          </Text>

          <Text style={styles.detailsText}>
            {session.details.matchTeamOneName || 'Team 1'}:{' '}
            {session.details.matchTeamOneTotal || 0}
          </Text>

          <Text style={styles.detailsText}>
            {session.details.matchTeamTwoName || 'Team 2'}:{' '}
            {session.details.matchTeamTwoTotal || 0}
          </Text>
        </View>
      );
    }

    if (
      session.activity === 'Baloot' &&
      session.details
    ) {
      return (
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>
            Baloot Results
          </Text>

          <Text style={styles.detailsText}>
            Us: {session.details.balootUsTotal || 0}
          </Text>

          <Text style={styles.detailsText}>
            Them: {session.details.balootThemTotal || 0}
          </Text>

          <Text style={styles.detailsText}>
            Winner:{' '}
            {session.details.balootWinner ||
              'Not finished yet'}
          </Text>

          <Text style={styles.detailsText}>
            Dealer Direction:{' '}
            {session.details.balootDealerDirection || '↑'}
          </Text>

          <Text style={styles.detailsSectionTitle}>
            Hands
          </Text>

          {!session.details.balootScores ||
          session.details.balootScores.length === 0 ? (
            <Text style={styles.detailsText}>
              No scores saved
            </Text>
          ) : (
            session.details.balootScores.map(
              (score, scoreIndex) => (
                <Text
                  key={score.id}
                  style={styles.detailsText}
                >
                  Hand {scoreIndex + 1}: Us {score.us} - Them{' '}
                  {score.them}
                </Text>
              )
            )
          )}
        </View>
      );
    }

    if (
      session.activity === 'Horse Riding' &&
      session.details?.horseRiding
    ) {
      const horse = session.details.horseRiding;

      return (
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>
            Horse Riding
          </Text>

          <Text style={styles.detailsText}>
            Horse: {horse.horseName || 'Not filled'}
          </Text>

          <Text style={styles.detailsText}>
            Training: {horse.trainingType || 'Not filled'}
          </Text>

          <Text style={styles.detailsText}>
            Rest Day: {horse.restDay ? 'Yes' : 'No'}
          </Text>

          <Text style={styles.detailsText}>
            Walking Minutes: {horse.walkingMinutes || '0'}
          </Text>

          <Text style={styles.detailsSectionTitle}>
            Daily Care
          </Text>

          <Text style={styles.detailsText}>
            Hay: {horse.hayGiven ? 'Yes' : 'No'}
          </Text>

          <Text style={styles.detailsText}>
            Water: {horse.waterChecked ? 'Yes' : 'No'}
          </Text>

          <Text style={styles.detailsText}>
            Food Oil: {horse.foodOilGiven ? 'Yes' : 'No'}
          </Text>

          <Text style={styles.detailsText}>
            Hoof Oil: {horse.hoofOilUsed ? 'Yes' : 'No'}
          </Text>

          <Text style={styles.detailsSectionTitle}>
            Feed and Supplies
          </Text>

          <Text style={styles.detailsText}>
            Re-Leve Amount:{' '}
            {horse.releveAmount || 'Not filled'}
          </Text>

          <Text style={styles.detailsText}>
            Re-Leve Bought:{' '}
            {horse.releveBuyingDate || 'Not filled'}
          </Text>

          <Text style={styles.detailsText}>
            Equi Jewel Amount:{' '}
            {horse.equiJewelAmount || 'Not filled'}
          </Text>

          <Text style={styles.detailsText}>
            Equi Jewel Bought:{' '}
            {horse.equiJewelBuyingDate || 'Not filled'}
          </Text>

          <Text style={styles.detailsSectionTitle}>
            Dressage
          </Text>

          <Text style={styles.detailsText}>
            Test Day: {horse.dressageTestDay ? 'Yes' : 'No'}
          </Text>

          {horse.dressageTestDay && (
            <>
              <Text style={styles.detailsText}>
                Test Name:{' '}
                {horse.dressageTestName || 'Not filled'}
              </Text>

              <Text style={styles.detailsText}>
                Score: {horse.dressageScore || '0'}%
              </Text>

              <Text style={styles.detailsText}>
                Notes: {horse.dressageNotes || 'None'}
              </Text>
            </>
          )}

          <Text style={styles.detailsSectionTitle}>
            Jumping
          </Text>

          <Text style={styles.detailsText}>
            Jumping Day: {horse.jumpingDay ? 'Yes' : 'No'}
          </Text>

          {horse.jumpingDay && (
            <>
              <Text style={styles.detailsText}>
                Fence Height:{' '}
                {horse.fenceHeight || 'Not filled'}
              </Text>

              <Text style={styles.detailsText}>
                Fence Count: {horse.fenceCount || '0'}
              </Text>

              <Text style={styles.detailsText}>
                Notes: {horse.jumpingNotes || 'None'}
              </Text>
            </>
          )}

          <Text style={styles.detailsSectionTitle}>
            General Notes
          </Text>

          <Text style={styles.detailsText}>
            {horse.horseNotes || 'None'}
          </Text>
        </View>
      );
    }

    if (
      isVehicleMaintenanceActivity(session.activity) &&
      session.details?.vehicleMaintenance
    ) {
      const vehicle =
        session.details.vehicleMaintenance;

      return (
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>
            Vehicle Maintenance
          </Text>

          <Text style={styles.detailsText}>
            Vehicle: {vehicle.vehicleName || 'Not filled'}
          </Text>

          <Text style={styles.detailsText}>
            Service: {vehicle.serviceType || 'Not filled'}
          </Text>

          <Text style={styles.detailsText}>
            Mileage: {vehicle.mileage || 'Not filled'}
          </Text>

          <Text style={styles.detailsText}>
            Cost: {vehicle.cost || '0'}
          </Text>

          <Text style={styles.detailsText}>
            Notes: {vehicle.notes || 'None'}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>History</Text>

        {sessions.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllHistory}
          >
            <Text style={styles.clearButtonText}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.subtitle}>
        Your saved sessions and records
      </Text>

      {sessions.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {getActivityFilters().map((activity) => (
            <TouchableOpacity
              key={activity}
              style={[
                styles.filterButton,
                historyFilter === activity &&
                  styles.filterButtonActive,
              ]}
              onPress={() => setHistoryFilter(activity)}
            >
              <Text
                style={[
                  styles.filterText,
                  historyFilter === activity &&
                    styles.filterTextActive,
                ]}
              >
                {activity}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {sessions.length === 0 ? (
        <Text style={styles.emptyText}>
          No sessions saved yet
        </Text>
      ) : getFilteredSessions().length === 0 ? (
        <Text style={styles.emptyText}>
          No sessions for {historyFilter} yet
        </Text>
      ) : (
        getFilteredSessions().map((session) => (
          <View key={session.id} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {session.activity}
                </Text>
              </View>

              <Text style={styles.dateText}>
                {session.date}
              </Text>
            </View>

            {!isVehicleMaintenanceActivity(
              session.activity
            ) && (
              <>
                <Text style={styles.durationText}>
                  {session.duration}
                </Text>

                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>
                    Start: {session.start}
                  </Text>

                  <Text style={styles.timeText}>
                    End: {session.end}
                  </Text>
                </View>
              </>
            )}

            {renderSessionDetails(session)}

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                confirmDeleteSession(session.id)
              }
            >
              <Text style={styles.deleteButtonText}>
                Delete Session
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101820',
    padding: 24,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 8,
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  subtitle: {
    fontSize: 18,
    color: '#b0b0b0',
    marginBottom: 24,
  },

  clearButton: {
    backgroundColor: '#b84040',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 10,
  },

  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  filterScroll: {
    marginBottom: 18,
  },

  filterButton: {
    backgroundColor: '#1b2733',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#34495e',
  },

  filterButtonActive: {
    backgroundColor: '#1f8a70',
    borderColor: '#1f8a70',
  },

  filterText: {
    color: '#b0b0b0',
    fontSize: 14,
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#ffffff',
  },

  emptyText: {
    color: '#b0b0b0',
    fontSize: 16,
  },

  card: {
    backgroundColor: '#1b2733',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  badge: {
    backgroundColor: '#1f8a70',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  badgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  dateText: {
    color: '#b0b0b0',
    fontSize: 14,
    fontWeight: '600',
  },

  durationText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  timeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#101820',
    padding: 12,
    borderRadius: 10,
  },

  timeText: {
    color: '#d0d0d0',
    fontSize: 14,
    fontWeight: '600',
  },

  detailsBox: {
    marginTop: 10,
    backgroundColor: '#101820',
    padding: 12,
    borderRadius: 10,
  },

  detailsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  detailsSectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },

  detailsText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 4,
  },

  exerciseBlock: {
    marginBottom: 10,
  },

  setText: {
    color: '#d0d0d0',
    fontSize: 15,
    marginLeft: 12,
    marginBottom: 3,
  },

  deleteButton: {
    backgroundColor: '#b84040',
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
  },

  deleteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },

  bottomSpace: {
    height: 80,
  },
});