export type GymSet = {
  id: number;
  reps: string;
};

export type GymExercise = {
  id: number;
  name: string;
  sets: GymSet[];
};

export type MatchRound = {
  id: number;
  teamOneGames: string;
  teamTwoGames: string;
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

export type SessionDetails = {
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

  balootScores?: BalootScore[];
  balootUsTotal?: number;
  balootThemTotal?: number;
  balootWinner?: string;
  balootDealerDirection?: string;

  horseRiding?: HorseRidingDetails;

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
  serviceType: string;
  mileage: string;
  cost: string;
  notes: string;
};
