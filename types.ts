export type GymSet = {
  id: number;
  reps: string;
  weight?: string;
};

export type GymExercise = {
  id: number;
  name: string;
  sets: GymSet[];
};

export type MatchRound = {
  id: number;
  setNumber?: string;
  teamOneGames: string;
  teamTwoGames: string;
  teamOnePoints?: string;
  teamTwoPoints?: string;
  server?: string;
  tiebreakScore?: string;
  winner?: string;
  teamOneWinners?: string;
  teamTwoWinners?: string;
  teamOneErrors?: string;
  teamTwoErrors?: string;
};

export type BalootScore = {
  id: number;
  us: string;
  them: string;
};

export type HorseRidingDetails = {
  riderName?: string;
  horseName?: string;
  trainingType?: string;
  trainingIntensity?: string;
  trainingTime?: string;
  restDay?: boolean;
  walkingMinutes?: string;
  walkMinutes?: string;
  trotMinutes?: string;
  canterMinutes?: string;
  rideDistance?: string;
  averageSpeed?: string;
  leftTurns?: string;
  rightTurns?: string;
  rideDate?: string;
  calendarNote?: string;
  safetyLocation?: string;
  safetyContact?: string;

  hayGiven?: boolean;
  waterChecked?: boolean;
  foodOilGiven?: boolean;
  shampooUsed?: boolean;
  padsCleaningSuppliesUsed?: boolean;
  hoofOilUsed?: boolean;

  releveAmount?: string;
  releveBuyingDate?: string;

  equiJewelAmount?: string;
  equiJewelBuyingDate?: string;

  foodOilBuyingDate?: string;
  shampooBuyingDate?: string;
  padsCleaningSuppliesBuyingDate?: string;
  hoofOilBuyingDate?: string;

  dressageTestDay?: boolean;
  dressageTestName?: string;
  dressageScore?: string;
  dressageNotes?: string;

  jumpingDay?: boolean;
  fenceHeight?: string;
  fenceCount?: string;
  jumpingNotes?: string;

  horseNotes?: string;
};

export type StudyingDetails = {
  subject?: string;
  studyType?: string;
  examDate?: string;
  coursework?: string;
  pomodoroPlan?: string;
  streak?: string;
  totalStudyHours?: string;
  candleSeconds?: number;
  candleTime?: string;
  notes?: string;
};

export type WorkDetails = {
  projectName?: string;
  candleSeconds?: number;
  candleTime?: string;
  candleTargetSeconds?: number;
  candleTargetTime?: string;
  notes?: string;
};

export type CustomFieldValue = {
  label: string;
  value: string;
};

export type ReminderDetails = {
  date?: string;
  time?: string;
  note?: string;
};

export type PersonalInfoDetails = {
  idNumberEnding?: string;
  idExpirationDate?: string;
  drivingLicenseExpirationDate?: string;
  passportNumberEnding?: string;
  passportExpirationDate?: string;
};

export type SessionDetails = {
  historyNote?: string;
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
  routeName?: string;
  elevationGain?: string;
  splits?: string;
  goal?: string;
  personalRecord?: string;
  averagePace?: string;
  averageSpeed?: string;

  matchTeamOneName?: string;
  matchTeamTwoName?: string;
  matchRounds?: MatchRound[];
  matchTeamOneTotal?: number;
  matchTeamTwoTotal?: number;

  balootScores?: BalootScore[];
  balootUsName?: string;
  balootThemName?: string;
  balootUsTotal?: number;
  balootThemTotal?: number;
  balootWinner?: string;
  balootDealerDirection?: string;
  balootShareText?: string;

  horseRiding?: HorseRidingDetails;
  studying?: StudyingDetails;
  work?: WorkDetails;
  customFields?: CustomFieldValue[];
  reminder?: ReminderDetails;
  personalInfo?: PersonalInfoDetails;

  vehicleMaintenance?: VehicleMaintenanceDetails;
};

export type Session = {
  id: number;
  activity: string;
  start: string;
  end: string;
  duration: string;
  durationSeconds?: number;
  date: string;
  details?: SessionDetails;
};
export type VehicleMaintenanceDetails = {
  vehicleName: string;
  plateNumber?: string;
  modelYear?: string;
  serviceType: string;
  serviceDate?: string;
  mileage: string;
  cost: string;
  shopName?: string;
  nextServiceDate?: string;
  nextServiceMileage?: string;
  insuranceExpirationDate?: string;
  registrationEndDate?: string;
  notes: string;
};
