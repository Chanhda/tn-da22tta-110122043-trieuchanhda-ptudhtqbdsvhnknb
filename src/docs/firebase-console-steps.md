# Firebase Console Steps

Use this guide after you have created the Firebase Web app and copied the config into `.env`.

## 1. Enable Firestore

1. Open Firebase Console.
2. Go to Firestore Database.
3. Click Create database.
4. Choose Test mode for demo work.
5. Pick a region close to you.

## 2. Create Collections

Create these collections in Firestore:

- `articles`
- `heritages`
- `categories`
- `media`
- `users`

## 3. Add Data Quickly

The fastest way is to run the seed script:

```bash
npm run seed:firestore
```

Before running it, set one of these credentials:

- `FIREBASE_SERVICE_ACCOUNT_PATH` to the path of your downloaded service account JSON file.
- `FIREBASE_SERVICE_ACCOUNT_JSON` to the raw JSON content as a single environment variable.

The script uploads these collections from [`data/firestore-seed.ts`](../data/firestore-seed.ts):

- `articles`
- `heritages`
- `categories`
- `media`
- `users`

If you still want to add documents manually, use the same field names as the seed file.

## 4. Storage

1. Go to Storage.
2. Create a bucket.
3. Upload image, video, and audio files.
4. Save the file URLs in Firestore document fields.

## 5. Authentication

1. Go to Authentication.
2. Enable Email/Password.
3. Use the screen [`app/auth.tsx`](../app/auth.tsx) to test login and registration.

## 6. Verify in the App

- Open the app again with `npx expo start --clear`.
- The app will show Firestore data if `.env` is configured.
- If Firestore is empty, the app now shows empty states instead of auto-filling seed data.