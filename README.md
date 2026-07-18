# Tafasili

Tafasili is a personal activity and life-record tracker for sports, training, horse riding, studying, games, work, vehicle maintenance, reminders, and important personal information.

The project includes:

- Expo React Native mobile app
- Local-first web version
- GitHub Pages publishing from `docs/`
- Supabase setup for future cloud accounts and history sync

## Current Feature Roadmap

### Gym

- Exercise library
- Weight, reps, sets
- Rest timer
- Saved workout templates
- Personal records
- Progress charts

### Run, Walking, and Cycling

- GPS route
- Distance
- Pace or speed
- Splits
- Elevation
- Goals
- Personal records

### Padel and Tennis

- Real scoring
- Points, games, sets
- Tiebreaks
- Server tracking
- Winner
- Team stats

### Horse Riding

- Walk, trot, and canter tracking
- Distance and speed
- Turns
- Training intensity
- Horse calendar
- Care log
- Safety location

### Studying

- Focus timer
- Pomodoro
- Subject
- Exam date
- Coursework
- Streaks
- Total study hours

### Baloot

- Dealer rotation
- Score to 152
- Hand history
- Undo
- Team names
- Winner
- Share result

### Vehicle Maintenance

- Multi-car garage
- Mileage
- Cost
- Next service reminder
- Receipts
- Oil, tire, and battery history

### Custom Activity

- Custom fields
- Save custom activity as a reusable template

### Templates

- Gym workouts
- Horse training plans
- Vehicle service plans
- Study subjects
- Match formats

### Reminders

- Study reminders
- Vehicle maintenance reminders
- Horse care reminders
- Workout schedule reminders

### Progress

- Weekly stats
- Monthly stats
- Charts
- Improved History dashboard
- Cloud database and accounts

## Development

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Run checks:

```bash
npm run lint
npx tsc --noEmit
```

## Website

The live GitHub Pages site uses the files in `docs/`.

Local website source lives in `website/`.
