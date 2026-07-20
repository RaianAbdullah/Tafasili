# Tafasili Supabase Setup

Supabase gives Tafasili a real cloud database for accounts and saved history.

## 1. Create the Supabase project

1. Go to `https://supabase.com`.
2. Create an account or sign in.
3. Create a new project.
4. Open the project dashboard.

## 2. Create the database table

1. In Supabase, open SQL Editor.
2. Copy the SQL from `supabase/schema.sql`.
3. Run it.

This creates the `activity_sessions` and `custom_activities` tables. Row Level Security ensures each signed-in user can only access their own history and custom activities.

## 3. Add your app keys

1. In Supabase, open Project Settings.
2. Open API.
3. Copy:
   - Project URL
   - publishable key
4. Create a local `.env` file in the project root.
5. Use `.env.example` as the template:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Do not put the service-role secret key in the app.

## 4. Test sign up and history sync

1. Restart Expo after adding `.env`.
2. Sign up with an email and password.
3. Save an activity session.
4. In Supabase, open Table Editor.
5. Check both `activity_sessions` and `custom_activities`.

If email confirmation is enabled in Supabase, confirm the email before testing database sync.
