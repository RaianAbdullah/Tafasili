import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { GymExercise, GymSet } from '../types';

const gymWorkoutDays = [
  'Chest',
  'Back',
  'Legs',
  'Shoulder',
  'Arms',
  'Abs',
  'Rest',
];

type Props = {
  selectedActivity: string | null;
  isArabic: boolean;

  gymWorkoutDay: string;
  setGymWorkoutDay: Dispatch<SetStateAction<string>>;

  gymCustomWorkout: string;
  setGymCustomWorkout: Dispatch<SetStateAction<string>>;

  gymExerciseName: string;
  setGymExerciseName: Dispatch<SetStateAction<string>>;

  gymExerciseOptions: string[];

  gymSetReps: string;
  setGymSetReps: Dispatch<SetStateAction<string>>;

  gymSetWeight: string;
  setGymSetWeight: Dispatch<SetStateAction<string>>;

  currentGymSets: GymSet[];
  setCurrentGymSets: Dispatch<SetStateAction<GymSet[]>>;

  gymExercises: GymExercise[];
  setGymExercises: Dispatch<SetStateAction<GymExercise[]>>;
};

export default function GymTracker(props: Props) {
  const [restSeconds, setRestSeconds] = useState(0);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const [isExerciseSuggestionsVisible, setIsExerciseSuggestionsVisible] = useState(false);

  useEffect(() => {
    if (!isRestTimerRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setRestSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRestTimerRunning]);

  useEffect(() => {
    if (props.selectedActivity !== 'Gym') {
      setIsExerciseSuggestionsVisible(false);
    }
  }, [props.selectedActivity]);

  const formatRestTime = () => {
    const minutes = Math.floor(restSeconds / 60);
    const seconds = restSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getBestGymSet = () => {
    const allSets = props.gymExercises.flatMap((exercise) =>
      exercise.sets.map((set) => ({
        exerciseName: exercise.name,
        reps: Number(set.reps) || 0,
        weight: Number(set.weight) || 0,
      }))
    );

    const weightedSets = allSets.filter((set) => set.weight > 0);

    if (weightedSets.length === 0) {
      return null;
    }

    return weightedSets.reduce((bestSet, set) =>
      set.weight > bestSet.weight ? set : bestSet
    );
  };

  const bestGymSet = getBestGymSet();
  const exerciseSearch = props.gymExerciseName.trim().toLowerCase();
  const filteredExerciseOptions = exerciseSearch
    ? props.gymExerciseOptions.filter((exerciseName) =>
        exerciseName.toLowerCase().includes(exerciseSearch)
      )
    : [];

  if (props.selectedActivity !== 'Gym') {
    return null;
  }

  const addGymSet = () => {
    const cleanReps = props.gymSetReps.trim();
    const cleanWeight = props.gymSetWeight.trim();

    if (cleanReps === '') {
      alert('Please enter reps for this set');
      return;
    }

    const newSet: GymSet = {
      id: Date.now(),
      reps: cleanReps,
      weight: cleanWeight,
    };

    props.setCurrentGymSets([...props.currentGymSets, newSet]);
    props.setGymSetReps('');
    props.setGymSetWeight('');
    setRestSeconds(0);
    setIsRestTimerRunning(true);
  };

  const deleteCurrentGymSet = (setId: number) => {
    const newSets = props.currentGymSets.filter((set) => set.id !== setId);
    props.setCurrentGymSets(newSets);
  };

  const saveGymExercise = () => {
    const cleanExerciseName = props.gymExerciseName.trim();

    if (cleanExerciseName === '') {
      alert('Please enter exercise name');
      return;
    }

    if (props.currentGymSets.length === 0) {
      alert('Please add at least one set');
      return;
    }

    const newExercise: GymExercise = {
      id: Date.now(),
      name: cleanExerciseName,
      sets: props.currentGymSets,
    };

    props.setGymExercises([...props.gymExercises, newExercise]);

    props.setGymExerciseName('');
    props.setGymSetReps('');
    props.setGymSetWeight('');
    props.setCurrentGymSets([]);
    setIsExerciseSuggestionsVisible(false);
  };

  const deleteGymExercise = (exerciseId: number) => {
    const newExercises = props.gymExercises.filter(
      (exercise) => exercise.id !== exerciseId
    );

    props.setGymExercises(newExercises);
  };

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
              props.gymWorkoutDay === day && styles.selectedWorkoutButton,
            ]}
            onPress={() => props.setGymWorkoutDay(day)}
          >
            <Text
              style={[
                styles.workoutButtonText,
                props.gymWorkoutDay === day && styles.selectedWorkoutButtonText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.detailsSubtitle}>{props.isArabic ? 'تمرين مخصص' : 'Custom Workout'}</Text>
      <TextInput
        style={styles.input}
        placeholder={props.isArabic ? 'اسم التمرين، مثال: يوم الدفع' : 'Workout name, example: Push Day'}
        placeholderTextColor="#050505"
        value={props.gymCustomWorkout}
        onChangeText={props.setGymCustomWorkout}
      />

      <Text style={styles.detailsSubtitle}>{props.isArabic ? 'التمرين الحالي' : 'Current Exercise'}</Text>

      <TextInput
        style={styles.input}
        placeholder={props.isArabic ? 'اسم التمرين' : 'Exercise name, example: Bench Press'}
        placeholderTextColor="#050505"
        value={props.gymExerciseName}
        onChangeText={(value) => {
          props.setGymExerciseName(value);
          setIsExerciseSuggestionsVisible(value.trim().length > 0);
        }}
        onFocus={() => setIsExerciseSuggestionsVisible(props.gymExerciseName.trim().length > 0)}
        onBlur={() => setTimeout(() => setIsExerciseSuggestionsVisible(false), 120)}
      />

      {isExerciseSuggestionsVisible && filteredExerciseOptions.length > 0 && (
        <View style={styles.exerciseOptionsBox}>
          {filteredExerciseOptions.slice(0, 6).map((exerciseName) => (
            <TouchableOpacity
              key={exerciseName.toLowerCase()}
              style={styles.exerciseOptionButton}
              onPress={() => {
                props.setGymExerciseName(exerciseName);
                setIsExerciseSuggestionsVisible(false);
              }}
            >
              <Text style={styles.exerciseOptionText}>{exerciseName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.scoreRow}>
        <TextInput
          style={styles.scoreInput}
          placeholder="Weight"
          placeholderTextColor="#050505"
          value={props.gymSetWeight}
          onChangeText={props.setGymSetWeight}
          keyboardType="decimal-pad"
        />

        <TextInput
          style={styles.scoreInput}
          placeholder="Set reps"
          placeholderTextColor="#050505"
          value={props.gymSetReps}
          onChangeText={props.setGymSetReps}
          keyboardType="number-pad"
        />

        <TouchableOpacity style={styles.addSetButton} onPress={addGymSet}>
          <Text style={styles.addSetText}>+ Set</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.restTimerBox}>
        <Text style={styles.restTimerTitle}>Rest Timer</Text>
        <Text style={styles.restTimerValue}>{formatRestTime()}</Text>
        <View style={styles.restButtonRow}>
          <TouchableOpacity
            style={styles.restButton}
            onPress={() => setIsRestTimerRunning(true)}
          >
            <Text style={styles.restButtonText}>Start</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restButton}
            onPress={() => setIsRestTimerRunning(false)}
          >
            <Text style={styles.restButtonText}>Pause</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restButton}
            onPress={() => {
              setIsRestTimerRunning(false);
              setRestSeconds(0);
            }}
          >
            <Text style={styles.restButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.exerciseListBox}>
        <Text style={styles.exerciseListTitle}>Sets for This Exercise</Text>

        {props.currentGymSets.length === 0 ? (
          <Text style={styles.emptyHistory}>No sets added yet</Text>
        ) : (
          props.currentGymSets.map((set, index) => (
            <View key={set.id} style={styles.exerciseRow}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>
                  Set {index + 1}: {set.weight ? `${set.weight} kg, ` : ''}{set.reps} reps
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

        {props.gymExercises.length === 0 ? (
          <Text style={styles.emptyHistory}>No exercises saved yet</Text>
        ) : (
          props.gymExercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseRow}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>
                  {index + 1}. {exercise.name}
                </Text>

                {exercise.sets.map((set, setIndex) => (
                  <Text key={set.id} style={styles.exerciseDetails}>
                    Set {setIndex + 1}: {set.weight ? `${set.weight} kg, ` : ''}{set.reps} reps
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

      <View style={styles.exerciseListBox}>
        <Text style={styles.exerciseListTitle}>Progress Summary</Text>
        {bestGymSet ? (
          <Text style={styles.exerciseDetails}>
            Best set: {bestGymSet.exerciseName} - {bestGymSet.weight} kg x {bestGymSet.reps} reps
          </Text>
        ) : (
          <Text style={styles.emptyHistory}>
            Add weight to your sets to track personal records.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    padding: 18,
    borderRadius: 16,
    marginBottom: 22,
  },
  detailsTitle: {
    color: '#050505',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  detailsSubtitle: {
    color: '#050505',
    fontSize: 18,
    marginBottom: 12,
    marginTop: 6,
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
  workoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  workoutButton: {
    backgroundColor: '#E7E9EE',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  selectedWorkoutButton: {
    backgroundColor: '#2563EB',
  },
  workoutButtonText: {
    color: '#050505',
    fontSize: 17,
    fontWeight: '600',
  },
  selectedWorkoutButtonText: {
    color: '#050505',
    fontWeight: '800',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
  },
  exerciseOptionsBox: {
    marginTop: -12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  exerciseOptionButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E9EE',
    backgroundColor: '#FFFFFF',
  },
  exerciseOptionText: {
    color: '#050505',
    fontSize: 16,
    fontWeight: '700',
  },
  scoreInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 12,
    color: '#050505',
  },
  addSetButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 18,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSetText: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '800',
  },
  restTimerBox: {
    backgroundColor: '#F6F7F9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  restTimerTitle: {
    color: '#050505',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  restTimerValue: {
    color: '#050505',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  restButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  restButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EE',
    borderRadius: 10,
    padding: 10,
  },
  restButtonText: {
    color: '#050505',
    textAlign: 'center',
    fontWeight: '700',
  },
  addExerciseButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 14,
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
  exerciseDetails: {
    color: '#050505',
    fontSize: 17,
    marginBottom: 2,
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
  emptyHistory: {
    color: '#050505',
    fontSize: 18,
  },
  buttonText: {
    color: '#050505',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
});
