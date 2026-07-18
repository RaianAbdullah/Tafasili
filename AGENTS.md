# Tafasili - Codex Project Instructions

## Project Owner

This project belongs to Raian. Raian is learning React Native and mobile development while building the application.

Explain important changes clearly before or after making them. Do not assume Raian understands why a new tool, terminal window, simulator, permission prompt, package, or process appears.

When something unexpected appears, explain:

1. What it is.
2. Why it appeared.
3. Whether it is normal.
4. How it helps the project.
5. What Raian should do next.

## Expo SDK Requirement

Expo HAS CHANGED.

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Project Overview

Tafasili is a personal activity and life-record tracking application built with React Native and Expo.

The intended platforms are:

- iOS
- Android
- Apple Watch and Apple Health integration later

The current short-term target is a stable Demo v1. It does not need to be a fully polished App Store product yet.

The project should remain simple, stable, understandable, and suitable for a developer who is still learning.

## Project Location

Mac project path:

`/Users/raianabdullah/Desktop/project/Activetrack/ActiveTrack`

Secondary synced checkout that may exist:

`/Users/raianabdullah/Documents/ActiveTrack`

Previous Windows path:

`C:\Users\Dell\Projects\ActiveTrack`

When Raian asks for VS Code, Desktop, and GitHub to match, verify both local checkouts and GitHub branch SHAs.

## Technology

- React Native
- Expo
- Expo Router
- TypeScript
- VS Code
- Expo Go for testing
- iPhone Simulator through Xcode when appropriate
- Git and GitHub for version control

## Current Application Structure

Important files and components include:

- `app/_layout.tsx`
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/index.tsx`
- `app/(tabs)/history.tsx`
- `types.ts`
- `components/HorseRidingTracker.tsx`
- `components/BalootTracker.tsx`
- `components/GymTracker.tsx`
- `components/LapTracker.tsx`
- `components/FootballTracker.tsx`
- `components/MatchTracker.tsx`

Current implementation note: `components/VehicleMaintenanceTracker.tsx` does not exist yet. Vehicle Maintenance is currently implemented inline inside `app/(tabs)/index.tsx`.

The old `explore.tsx` screen was renamed/removed in favor of `history.tsx`.

The root layout should remain Stack-based.

The tabs layout should show:

- Home using `index`
- History using `history`

There was previously a problem where the Home tab was not visible. Verify the tab configuration before making unrelated changes.

## Current Activities

Tafasili currently includes or plans to include:

- Football
- Gym
- Run
- Padel
- Tennis
- Golf
- Horse Riding
- Cycling
- Walking
- Swimming
- Studying
- Baloot
- Vehicle Maintenance
- Other/custom activities

Current implementation note: Golf and Studying are currently generic timed activities, not specialized detail forms.

## Global Application Behaviour

Timed activities should support:

- Start time
- End time
- Duration
- Session saving
- History display

Users should be able to:

- View saved activity sessions
- Filter history by activity
- Delete a saved session
- Create a custom activity name
- Keep custom activity names available after saving

Vehicle Maintenance is not a timed activity and should not display start time, end time, or duration.

Do not break existing activity trackers while adding a new feature.

## Current Completed Work

The following work has already been completed or substantially implemented:

- Shared types were moved into `types.ts`.
- Major activity trackers were separated into components.
- The activity list was grouped and cleaned up.
- The Start Activity button was moved underneath the selected activity title.
- History cards were cleaned up.
- Better History Screen filtering is working.
- History can be filtered using All or an individual activity.
- Vehicle Maintenance was added.
- Vehicle Maintenance saves without using a timer.
- Vehicle Maintenance history cards hide timed fields.
- Demo sign-in exists and accepts any non-empty username/phone and password.
- The sign-in screen hides the bottom tab bar.
- Logout exists.
- The app currently uses a neutral black/white/grey design.
- Expo development works on the Mac.
- Expo Go testing works.
- The iPhone Simulator may appear during iOS testing and is expected behaviour.
- Git commits and GitHub pushes are used to save progress.

Before claiming that a feature works, inspect the current code and test it.

## Activity-Specific Requirements

### Football

Football supports:

- Two optional team names
- Score recording
- Activity timer
- Saved match details in history

### Gym

Gym supports a seven-day training plan:

- Chest
- Back
- Legs
- Shoulders
- Arms
- Abs
- Rest

Gym sessions should support:

- Exercises
- Multiple sets
- Repetition counts
- Timer
- Full workout breakdown in history

### Run, Walking, Swimming, and Cycling

These activities use lap tracking and may record:

- Laps
- Time
- Distance
- Automatically saved results

### Padel and Tennis

These activities support:

- Two teams
- Six games per round
- Round totals
- Match history

### Golf

Golf may record:

- Number of balls hit
- Club number or club size
- Driving range name

Current implementation note: these Golf-specific fields are planned but not implemented yet.

### Horse Riding

Horse Riding may record:

- Horse name
- Discipline/training type
- Rest day
- Walking minutes
- Training goals and notes
- Dressage test day
- Dressage score
- Jumping fence height
- Number of fences

Horse care and supply fields may include:

- Daily hay
- Water
- Re-Leve feed
- Equi-Jewel feed
- Oil
- Shampoo
- Pads
- Cleaning supplies
- Hoof oil
- Supply purchase dates

Keep this section organised. Do not place every horse-care feature on one crowded screen.

### Studying

Studying may record:

- Subject
- Exams
- Coursework
- Study duration

Current implementation note: these Studying-specific fields are planned but not implemented yet.

### Baloot

Baloot supports:

- US team
- THEM team
- Cumulative scoring until 152
- Delete last score
- Dealer indicator using a four-direction arrow toggle

### Vehicle Maintenance

Vehicle Maintenance supports:

- Vehicle name
- Tire/Tyre service
- Battery service
- Oil service
- Gas
- Other service
- Mileage
- Cost
- Notes

It must save without a Start or End timer.

Current implementation note: Vehicle Maintenance is inline in `app/(tabs)/index.tsx`; it can be extracted later only if that improves clarity without risking Demo v1 stability.

## Immediate Project Plan

The current priority is to complete a stable Demo v1 within a very limited timeframe.

### Day 1 - Stability

1. Verify Home and History navigation.
2. Confirm every existing activity opens correctly.
3. Test each activity from data entry through saving and history display.
4. Fix crashes, TypeScript errors, broken imports, and navigation errors.
5. Add only essential validation.
6. Avoid major redesigns.
7. Commit the stable version with a clear Git message such as:

`Tafasili Demo v1 stable`

### Day 2 - App Identity and Build Preparation

1. Configure the application name.
2. Configure the app icon.
3. Configure the splash screen.
4. Configure the iOS bundle identifier.
5. Configure the Android package name.
6. Set application version and build numbers.
7. Run Expo Doctor.
8. Resolve important warnings.
9. Test on the iPhone Simulator.
10. Test on a physical iPhone through Expo Go.
11. Prepare an installable or TestFlight-ready build where practical.
12. Do not add large new features before the stable demo is complete.

## Future Features

These are future features, not immediate Demo v1 requirements:

- Statistics screen
- Weekly and monthly activity summaries
- Charts
- Apple Health integration
- Apple Watch integration
- User accounts
- Sign-in using username or phone number and password
- Cloud database
- Cross-device synchronisation
- Notifications
- Improved design and animations
- App Store and Google Play release preparation

Do not start these features until the stable Demo v1 is complete unless Raian explicitly requests one.

## Known Problems and Risks

- `npm run lint` currently passes with 0 errors but reports warnings for unused variables/functions in `app/(tabs)/history.tsx` and `app/(tabs)/index.tsx`.
- `app/(tabs)/index.tsx` is large and has inconsistent indentation in some areas.
- No automated tests exist beyond Expo lint.
- The README is still mostly the default Expo README.
- Vehicle Maintenance is implemented inline, not as a separate component.
- Demo sign-in is not real authentication.
- Data persistence is local AsyncStorage only.

## Coding Rules

- Use TypeScript.
- Preserve the existing Expo Router structure.
- Prefer small, focused changes.
- Reuse existing components and types.
- Avoid rewriting the whole application unnecessarily.
- Avoid introducing a new state-management library unless clearly necessary.
- Avoid adding packages when the feature can be implemented cleanly with the existing stack.
- Check existing package versions before installing anything.
- Do not delete working functionality without permission.
- Do not rename important files without updating all imports and router references.
- Keep screens readable and avoid extremely large components.
- Extract components only when doing so improves clarity without risking stability.
- Add comments for complex logic, but do not over-comment simple code.
- Maintain compatibility with Expo Go unless a feature specifically requires a development build.
- Preserve every existing activity and feature unless Raian explicitly approves removal.
- Before any major structural change, explain why it is needed.
- Keep the current black/white/grey design direction unless Raian asks for a new style.
- Do not push to GitHub unless Raian explicitly approves.

## Safe Working Process

Before changing code:

1. Inspect the relevant files.
2. Explain briefly what is currently happening.
3. Identify the smallest safe change.
4. Check whether the change could affect another activity.

After changing code:

1. Run TypeScript or relevant checks.
2. Start the Expo project when appropriate.
3. Review terminal errors.
4. Test the affected screen when practical.
5. Report exactly which files changed.
6. Explain how Raian can verify the result.
7. Recommend a Git commit only after the feature is verified.

Do not say a task is complete merely because code was written. Completion requires reasonable verification.

## Testing Rules

After code changes:

- Run `npm run lint`.
- Report whether it passed.
- Clearly separate existing warnings from new errors.
- List all modified files.
- Do not claim simulator/device testing unless it was actually run.

For documentation-only changes, inspect Git status and report modified documentation files.

## Communication Style

Use clear, beginner-friendly language.

When providing terminal commands:

- Give one command or one small command group at a time.
- State which directory the terminal should be in.
- Explain what the command does.
- Explain what normal output looks like.
- Explain any important warning or error.

When changing several files, provide a short summary of:

- Files changed
- What was changed
- Why it was changed
- How it was tested
- What remains

## First Action in a New Codex Session

At the beginning of a new task:

1. Read this `AGENTS.md`.
2. Inspect the current Git status.
3. Inspect the relevant source files.
4. Do not assume this document perfectly reflects the latest code.
5. Compare these instructions with the actual implementation.
6. Tell Raian what you found before making a large change.
