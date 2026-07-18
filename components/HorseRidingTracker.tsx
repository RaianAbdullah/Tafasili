import { Dispatch, SetStateAction } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  selectedActivity: string | null;

  horseRiderName: string;
  setHorseRiderName: Dispatch<SetStateAction<string>>;

  horseName: string;
  setHorseName: Dispatch<SetStateAction<string>>;

  horseTrainingType: string;
  setHorseTrainingType: Dispatch<SetStateAction<string>>;

  horseTrainingIntensity: string;
  setHorseTrainingIntensity: Dispatch<SetStateAction<string>>;

  horseTrainingTime: string;
  setHorseTrainingTime: Dispatch<SetStateAction<string>>;

  horseRestDay: boolean;
  setHorseRestDay: Dispatch<SetStateAction<boolean>>;

  horseWalkingMinutes: string;
  setHorseWalkingMinutes: Dispatch<SetStateAction<string>>;

  horseWalkMinutes: string;
  setHorseWalkMinutes: Dispatch<SetStateAction<string>>;

  horseTrotMinutes: string;
  setHorseTrotMinutes: Dispatch<SetStateAction<string>>;

  horseCanterMinutes: string;
  setHorseCanterMinutes: Dispatch<SetStateAction<string>>;

  horseRideDistance: string;
  setHorseRideDistance: Dispatch<SetStateAction<string>>;

  horseAverageSpeed: string;
  setHorseAverageSpeed: Dispatch<SetStateAction<string>>;

  horseLeftTurns: string;
  setHorseLeftTurns: Dispatch<SetStateAction<string>>;

  horseRightTurns: string;
  setHorseRightTurns: Dispatch<SetStateAction<string>>;

  horseRideDate: string;
  setHorseRideDate: Dispatch<SetStateAction<string>>;

  horseCalendarNote: string;
  setHorseCalendarNote: Dispatch<SetStateAction<string>>;

  horseSafetyLocation: string;
  setHorseSafetyLocation: Dispatch<SetStateAction<string>>;

  horseSafetyContact: string;
  setHorseSafetyContact: Dispatch<SetStateAction<string>>;

  horseHayGiven: boolean;
  setHorseHayGiven: Dispatch<SetStateAction<boolean>>;

  horseWaterChecked: boolean;
  setHorseWaterChecked: Dispatch<SetStateAction<boolean>>;

  horseFoodOilGiven: boolean;
  setHorseFoodOilGiven: Dispatch<SetStateAction<boolean>>;

  horseShampooUsed: boolean;
  setHorseShampooUsed: Dispatch<SetStateAction<boolean>>;

  horsePadsCleaningSuppliesUsed: boolean;
  setHorsePadsCleaningSuppliesUsed: Dispatch<SetStateAction<boolean>>;

  horseHoofOilUsed: boolean;
  setHorseHoofOilUsed: Dispatch<SetStateAction<boolean>>;

  horseReleveAmount: string;
  setHorseReleveAmount: Dispatch<SetStateAction<string>>;

  horseReleveBuyingDate: string;
  setHorseReleveBuyingDate: Dispatch<SetStateAction<string>>;

  horseEquiJewelAmount: string;
  setHorseEquiJewelAmount: Dispatch<SetStateAction<string>>;

  horseEquiJewelBuyingDate: string;
  setHorseEquiJewelBuyingDate: Dispatch<SetStateAction<string>>;

  horseFoodOilBuyingDate: string;
  setHorseFoodOilBuyingDate: Dispatch<SetStateAction<string>>;

  horseShampooBuyingDate: string;
  setHorseShampooBuyingDate: Dispatch<SetStateAction<string>>;

  horsePadsCleaningSuppliesBuyingDate: string;
  setHorsePadsCleaningSuppliesBuyingDate: Dispatch<SetStateAction<string>>;

  horseHoofOilBuyingDate: string;
  setHorseHoofOilBuyingDate: Dispatch<SetStateAction<string>>;

  horseDressageTestDay: boolean;
  setHorseDressageTestDay: Dispatch<SetStateAction<boolean>>;

  horseDressageTestName: string;
  setHorseDressageTestName: Dispatch<SetStateAction<string>>;

  horseDressageScore: string;
  setHorseDressageScore: Dispatch<SetStateAction<string>>;

  horseDressageNotes: string;
  setHorseDressageNotes: Dispatch<SetStateAction<string>>;

  horseJumpingDay: boolean;
  setHorseJumpingDay: Dispatch<SetStateAction<boolean>>;

  horseFenceHeight: string;
  setHorseFenceHeight: Dispatch<SetStateAction<string>>;

  horseFenceCount: string;
  setHorseFenceCount: Dispatch<SetStateAction<string>>;

  horseJumpingNotes: string;
  setHorseJumpingNotes: Dispatch<SetStateAction<string>>;

  horseNotes: string;
  setHorseNotes: Dispatch<SetStateAction<string>>;
};

export default function HorseRidingTracker(props: Props) {
  if (props.selectedActivity !== 'Horse Riding') {
    return null;
  }

  const renderYesNoButton = (
    label: string,
    value: boolean,
    onPress: () => void
  ) => {
    return (
      <TouchableOpacity
        style={[styles.toggleButton, value && styles.selectedToggleButton]}
        onPress={onPress}
      >
        <Text style={[styles.toggleText, value && styles.selectedToggleText]}>
          {label}: {value ? 'Yes' : 'No'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.detailsBox}>
      <Text style={styles.detailsTitle}>Horse Riding</Text>

      <TextInput
        style={styles.input}
        placeholder="Rider name"
        placeholderTextColor="#050505"
        value={props.horseRiderName}
        onChangeText={props.setHorseRiderName}
      />

      <TextInput
        style={styles.input}
        placeholder="Horse name, example: Durkji"
        placeholderTextColor="#050505"
        value={props.horseName}
        onChangeText={props.setHorseName}
      />

      <TextInput
        style={styles.input}
        placeholder="Training type, example: Dressage / Flatwork / Jumping"
        placeholderTextColor="#050505"
        value={props.horseTrainingType}
        onChangeText={props.setHorseTrainingType}
      />

      <Text style={styles.detailsSubtitle}>Training Intensity</Text>

      {['Easy', 'Medium', 'Hard'].map((level) => (
        <TouchableOpacity
          key={level}
          style={[
            styles.toggleButton,
            props.horseTrainingIntensity === level &&
              styles.selectedToggleButton,
          ]}
          onPress={() => props.setHorseTrainingIntensity(level)}
        >
          <Text
            style={[
              styles.toggleText,
              props.horseTrainingIntensity === level &&
                styles.selectedToggleText,
            ]}
          >
            {level}
          </Text>
        </TouchableOpacity>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Time of training, example: 45 min"
        placeholderTextColor="#050505"
        value={props.horseTrainingTime}
        onChangeText={props.setHorseTrainingTime}
      />

      {renderYesNoButton('Rest Day', props.horseRestDay, () =>
        props.setHorseRestDay(!props.horseRestDay)
      )}

      <TextInput
        style={styles.input}
        placeholder="Daily walking minutes"
        placeholderTextColor="#050505"
        value={props.horseWalkingMinutes}
        onChangeText={props.setHorseWalkingMinutes}
        keyboardType="number-pad"
      />

      <Text style={styles.detailsSubtitle}>Gait Tracking</Text>

      <TextInput
        style={styles.input}
        placeholder="Walk minutes"
        placeholderTextColor="#050505"
        value={props.horseWalkMinutes}
        onChangeText={props.setHorseWalkMinutes}
        keyboardType="number-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Trot minutes"
        placeholderTextColor="#050505"
        value={props.horseTrotMinutes}
        onChangeText={props.setHorseTrotMinutes}
        keyboardType="number-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Canter minutes"
        placeholderTextColor="#050505"
        value={props.horseCanterMinutes}
        onChangeText={props.setHorseCanterMinutes}
        keyboardType="number-pad"
      />

      <Text style={styles.detailsSubtitle}>Ride Metrics</Text>

      <TextInput
        style={styles.input}
        placeholder="Ride distance, example: 4.2 km"
        placeholderTextColor="#050505"
        value={props.horseRideDistance}
        onChangeText={props.setHorseRideDistance}
      />

      <TextInput
        style={styles.input}
        placeholder="Average speed, example: 8.5 km/h"
        placeholderTextColor="#050505"
        value={props.horseAverageSpeed}
        onChangeText={props.setHorseAverageSpeed}
      />

      <View style={styles.scoreRow}>
        <TextInput
          style={styles.scoreInput}
          placeholder="Left turns"
          placeholderTextColor="#050505"
          value={props.horseLeftTurns}
          onChangeText={props.setHorseLeftTurns}
          keyboardType="number-pad"
        />

        <TextInput
          style={styles.scoreInput}
          placeholder="Right turns"
          placeholderTextColor="#050505"
          value={props.horseRightTurns}
          onChangeText={props.setHorseRightTurns}
          keyboardType="number-pad"
        />
      </View>

      <Text style={styles.detailsSubtitle}>Calendar and Safety</Text>

      <TextInput
        style={styles.input}
        placeholder="Ride date, example: 17/07/2026"
        placeholderTextColor="#050505"
        value={props.horseRideDate}
        onChangeText={props.setHorseRideDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Calendar note, example: Farrier visit next week"
        placeholderTextColor="#050505"
        value={props.horseCalendarNote}
        onChangeText={props.setHorseCalendarNote}
      />

      <TextInput
        style={styles.input}
        placeholder="Safety location, example: Riyadh stable"
        placeholderTextColor="#050505"
        value={props.horseSafetyLocation}
        onChangeText={props.setHorseSafetyLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Safety contact"
        placeholderTextColor="#050505"
        value={props.horseSafetyContact}
        onChangeText={props.setHorseSafetyContact}
      />

      <Text style={styles.detailsSubtitle}>Daily Care</Text>

      {renderYesNoButton('Hay Given', props.horseHayGiven, () =>
        props.setHorseHayGiven(!props.horseHayGiven)
      )}

      {renderYesNoButton('Water Checked', props.horseWaterChecked, () =>
        props.setHorseWaterChecked(!props.horseWaterChecked)
      )}

      {renderYesNoButton('Food Oil Given', props.horseFoodOilGiven, () =>
        props.setHorseFoodOilGiven(!props.horseFoodOilGiven)
      )}

      <TextInput
        style={styles.input}
        placeholder="Food oil buying date, example: 06/07/2026"
        placeholderTextColor="#050505"
        value={props.horseFoodOilBuyingDate}
        onChangeText={props.setHorseFoodOilBuyingDate}
      />

      {renderYesNoButton('Hoof Oil Used', props.horseHoofOilUsed, () =>
        props.setHorseHoofOilUsed(!props.horseHoofOilUsed)
      )}

      <TextInput
        style={styles.input}
        placeholder="Hoof oil buying date, example: 06/07/2026"
        placeholderTextColor="#050505"
        value={props.horseHoofOilBuyingDate}
        onChangeText={props.setHorseHoofOilBuyingDate}
      />

      <Text style={styles.detailsSubtitle}>Cleaning Supplies</Text>

      {renderYesNoButton('Shampoo Used', props.horseShampooUsed, () =>
        props.setHorseShampooUsed(!props.horseShampooUsed)
      )}

      <TextInput
        style={styles.input}
        placeholder="Shampoo buying date, example: 06/07/2026"
        placeholderTextColor="#050505"
        value={props.horseShampooBuyingDate}
        onChangeText={props.setHorseShampooBuyingDate}
      />

      {renderYesNoButton('Pads Cleaning Supplies Used', props.horsePadsCleaningSuppliesUsed, () =>
        props.setHorsePadsCleaningSuppliesUsed(!props.horsePadsCleaningSuppliesUsed)
      )}

      <TextInput
        style={styles.input}
        placeholder="Pads cleaning supplies buying date"
        placeholderTextColor="#050505"
        value={props.horsePadsCleaningSuppliesBuyingDate}
        onChangeText={props.setHorsePadsCleaningSuppliesBuyingDate}
      />

      <Text style={styles.detailsSubtitle}>Monthly Feed</Text>

      <TextInput
        style={styles.input}
        placeholder="Re-Leve amount, example: 2 kg"
        placeholderTextColor="#050505"
        value={props.horseReleveAmount}
        onChangeText={props.setHorseReleveAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Re-Leve buying date, example: 06/07/2026"
        placeholderTextColor="#050505"
        value={props.horseReleveBuyingDate}
        onChangeText={props.setHorseReleveBuyingDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Equi Jewel amount, example: 0.5 kg"
        placeholderTextColor="#050505"
        value={props.horseEquiJewelAmount}
        onChangeText={props.setHorseEquiJewelAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Equi Jewel buying date, example: 06/07/2026"
        placeholderTextColor="#050505"
        value={props.horseEquiJewelBuyingDate}
        onChangeText={props.setHorseEquiJewelBuyingDate}
      />

      <Text style={styles.detailsSubtitle}>Dressage Test</Text>

      {renderYesNoButton('Dressage Test Day', props.horseDressageTestDay, () =>
        props.setHorseDressageTestDay(!props.horseDressageTestDay)
      )}

      {props.horseDressageTestDay && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Dressage test name"
            placeholderTextColor="#050505"
            value={props.horseDressageTestName}
            onChangeText={props.setHorseDressageTestName}
          />

          <TextInput
            style={styles.input}
            placeholder="Dressage score %, example: 68.5"
            placeholderTextColor="#050505"
            value={props.horseDressageScore}
            onChangeText={props.setHorseDressageScore}
            keyboardType="decimal-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Dressage judge notes"
            placeholderTextColor="#050505"
            value={props.horseDressageNotes}
            onChangeText={props.setHorseDressageNotes}
          />
        </>
      )}

      <Text style={styles.detailsSubtitle}>Jumping</Text>

      {renderYesNoButton('Jumping Day', props.horseJumpingDay, () =>
        props.setHorseJumpingDay(!props.horseJumpingDay)
      )}

      {props.horseJumpingDay && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Fence height, example: 80 cm"
            placeholderTextColor="#050505"
            value={props.horseFenceHeight}
            onChangeText={props.setHorseFenceHeight}
          />

          <TextInput
            style={styles.input}
            placeholder="Fence count"
            placeholderTextColor="#050505"
            value={props.horseFenceCount}
            onChangeText={props.setHorseFenceCount}
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Jumping notes"
            placeholderTextColor="#050505"
            value={props.horseJumpingNotes}
            onChangeText={props.setHorseJumpingNotes}
          />
        </>
      )}

      <Text style={styles.detailsSubtitle}>Notes</Text>

      <TextInput
        style={styles.input}
        placeholder="Horse riding notes"
        placeholderTextColor="#050505"
        value={props.horseNotes}
        onChangeText={props.setHorseNotes}
      />
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
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
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
  toggleButton: {
    backgroundColor: '#E7E9EE',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedToggleButton: {
    backgroundColor: '#2563EB',
  },
  toggleText: {
    color: '#050505',
    fontSize: 19,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedToggleText: {
    color: '#050505',
    fontWeight: '800',
  },
});
