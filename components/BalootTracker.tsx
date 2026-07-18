import { Dispatch, SetStateAction } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { BalootScore } from '../types';

type Props = {
  selectedActivity: string | null;

  balootUsName: string;
  setBalootUsName: Dispatch<SetStateAction<string>>;

  balootThemName: string;
  setBalootThemName: Dispatch<SetStateAction<string>>;

  balootUsScore: string;
  setBalootUsScore: Dispatch<SetStateAction<string>>;

  balootThemScore: string;
  setBalootThemScore: Dispatch<SetStateAction<string>>;

  balootScores: BalootScore[];
  setBalootScores: Dispatch<SetStateAction<BalootScore[]>>;

  balootDealerDirection: string;
  setBalootDealerDirection: Dispatch<SetStateAction<string>>;
};

const dealerDirections = ['↑', '→', '↓', '←'];

export default function BalootTracker(props: Props) {
  if (props.selectedActivity !== 'Baloot') {
    return null;
  }

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

  const getBalootUsTotal = () => {
    return getBalootUsTotalFromScores(props.balootScores);
  };

  const getBalootThemTotal = () => {
    return getBalootThemTotalFromScores(props.balootScores);
  };

  const getUsName = () => {
    return props.balootUsName.trim() || 'Us';
  };

  const getThemName = () => {
    return props.balootThemName.trim() || 'Them';
  };

  const getBalootWinner = (usTotal: number, themTotal: number) => {
    if (usTotal >= 152 && usTotal > themTotal) {
      return getUsName();
    }

    if (themTotal >= 152 && themTotal > usTotal) {
      return getThemName();
    }

    if (usTotal >= 152 && themTotal >= 152 && usTotal === themTotal) {
      return 'Tie - play one more hand';
    }

    return 'Not finished yet';
  };

  const getCurrentBalootWinner = () => {
    return getBalootWinner(getBalootUsTotal(), getBalootThemTotal());
  };

  const addBalootScore = () => {
    const cleanUsScore = props.balootUsScore.trim();
    const cleanThemScore = props.balootThemScore.trim();

    if (cleanUsScore === '') {
      alert('Please enter Us score');
      return;
    }

    if (cleanThemScore === '') {
      alert('Please enter Them score');
      return;
    }

    const usNumber = Number(cleanUsScore);
    const themNumber = Number(cleanThemScore);

    if (Number.isNaN(usNumber) || Number.isNaN(themNumber)) {
      alert('Scores must be numbers');
      return;
    }

    if (usNumber < 0 || themNumber < 0) {
      alert('Scores cannot be negative');
      return;
    }

    const newScore: BalootScore = {
      id: Date.now(),
      us: cleanUsScore,
      them: cleanThemScore,
    };

    const newScores = [...props.balootScores, newScore];
    const usTotal = getBalootUsTotalFromScores(newScores);
    const themTotal = getBalootThemTotalFromScores(newScores);
    const winner = getBalootWinner(usTotal, themTotal);

    props.setBalootScores(newScores);
    props.setBalootUsScore('');
    props.setBalootThemScore('');

    if (winner === getUsName() || winner === getThemName()) {
      Alert.alert('Baloot Winner', `${winner} reached 152 and won.`);
    }
  };

  const deleteBalootScore = (scoreId: number) => {
    const newScores = props.balootScores.filter((score) => score.id !== scoreId);
    props.setBalootScores(newScores);
  };

  const deleteLastBalootScore = () => {
    if (props.balootScores.length === 0) {
      alert('No score to delete');
      return;
    }

    const newScores = props.balootScores.slice(0, -1);
    props.setBalootScores(newScores);
  };

  const resetBalootScores = () => {
    props.setBalootScores([]);
    props.setBalootUsScore('');
    props.setBalootThemScore('');
  };

  const changeDealerDirection = () => {
    const currentIndex = dealerDirections.indexOf(props.balootDealerDirection);
    const nextIndex = (currentIndex + 1) % dealerDirections.length;

    props.setBalootDealerDirection(dealerDirections[nextIndex]);
  };

  return (
    <View style={styles.detailsBox}>
      <Text style={styles.detailsTitle}>Baloot Calculator</Text>
      <Text style={styles.detailsSubtitle}>First side to 152 wins</Text>

      <Text style={styles.detailsSubtitle}>Team names</Text>

      <View style={styles.scoreRow}>
        <TextInput
          style={styles.scoreInput}
          placeholder="Us team name"
          placeholderTextColor="#050505"
          value={props.balootUsName}
          onChangeText={props.setBalootUsName}
        />

        <TextInput
          style={styles.scoreInput}
          placeholder="Them team name"
          placeholderTextColor="#050505"
          value={props.balootThemName}
          onChangeText={props.setBalootThemName}
        />
      </View>

      <View style={styles.balootTotalBox}>
        <View style={styles.balootTotalColumn}>
          <Text style={styles.balootSideTitle}>{getUsName()}</Text>
          <Text style={styles.balootTotalNumber}>{getBalootUsTotal()}</Text>
        </View>

        <View style={styles.balootTotalColumn}>
          <Text style={styles.balootSideTitle}>{getThemName()}</Text>
          <Text style={styles.balootTotalNumber}>{getBalootThemTotal()}</Text>
        </View>
      </View>

      <View style={styles.winnerBox}>
        <Text style={styles.winnerLabel}>Winner</Text>
        <Text style={styles.winnerText}>{getCurrentBalootWinner()}</Text>
      </View>

      <TouchableOpacity style={styles.dealerBox} onPress={changeDealerDirection}>
        <Text style={styles.dealerTitle}>Dealer Direction</Text>
        <Text style={styles.dealerArrow}>{props.balootDealerDirection}</Text>
        <Text style={styles.dealerHint}>Tap to change dealer</Text>
      </TouchableOpacity>

      <Text style={styles.detailsSubtitle}>Add hand score</Text>

      <View style={styles.scoreRow}>
        <TextInput
          style={styles.scoreInput}
          placeholder="Us"
          placeholderTextColor="#050505"
          value={props.balootUsScore}
          onChangeText={props.setBalootUsScore}
          keyboardType="number-pad"
        />

        <TextInput
          style={styles.scoreInput}
          placeholder="Them"
          placeholderTextColor="#050505"
          value={props.balootThemScore}
          onChangeText={props.setBalootThemScore}
          keyboardType="number-pad"
        />
      </View>

      <TouchableOpacity style={styles.addExerciseButton} onPress={addBalootScore}>
        <Text style={styles.buttonText}>+ Add Score</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteLastButton} onPress={deleteLastBalootScore}>
        <Text style={styles.buttonText}>Delete Last Score</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetLapButton} onPress={resetBalootScores}>
        <Text style={styles.buttonText}>Reset Baloot Scores</Text>
      </TouchableOpacity>

      <View style={styles.exerciseListBox}>
        <Text style={styles.exerciseListTitle}>Score History</Text>

        {props.balootScores.length === 0 ? (
          <Text style={styles.emptyHistory}>No scores added yet</Text>
        ) : (
          props.balootScores.map((score, index) => (
            <View key={score.id} style={styles.exerciseRow}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>
                  Hand {index + 1}: {getUsName()} {score.us} - {getThemName()} {score.them}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.exerciseDeleteButton}
                onPress={() => deleteBalootScore(score.id)}
              >
                <Text style={styles.exerciseDeleteText}>X</Text>
              </TouchableOpacity>
            </View>
          ))
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
