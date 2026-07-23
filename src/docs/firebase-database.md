# Firebase Database Setup

This project uses Firebase as the backend for content, media, and user data.

## Collections

### `articles`
- `title`: string
- `category`: string
- `summary`: string
- `content`: string
- `author`: string
- `date`: string
- `coverImage`: string
- `createdAt`: timestamp or ISO string

### `heritages`
- `name`: string
- `province`: string
- `category`: string
- `summary`: string
- `description`: string
- `coverImage`: string
- `gallery`: string[]
- `location`: map `{ lat, lng }`

### `categories`
- `name`: string
- `slug`: string
- `icon`: string

### `media`
- `type`: string
- `url`: string
- `title`: string
- `relatedId`: string

### `users`
- `displayName`: string
- `email`: string
- `photoURL`: string
- `favorites`: string[]

## Connection Steps

1. Create a Firebase project in the Firebase Console.
2. Enable Firestore and Storage.
3. Copy the web app config values into `.env` using the `EXPO_PUBLIC_FIREBASE_*` variables.
4. Install dependencies with `npm install`.
5. Import helpers from `lib/firebase.ts` and repositories like `lib/article-repository.ts`.

## Fast Data Import

Use the seed script to upload demo data into Firestore in one command:

```bash
npm run seed:firestore
```

Set either `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT_JSON` first so the script can authenticate.

## Example Usage

```ts
import { fetchArticles } from '@/lib/article-repository';

const articles = await fetchArticles();
```

If Firebase is not configured yet, the app falls back to local mock data for demo screens.