# Firestore Seed Data

Use the file [`data/firestore-seed.ts`](../data/firestore-seed.ts) as the source of demo documents for Firebase.

## Suggested Collections

- `articles`
- `heritages`
- `categories`
- `media`
- `users`

## How to Use

1. Open [`data/firestore-seed.ts`](../data/firestore-seed.ts).
2. Copy the objects into Firestore documents.
3. Keep the document `id` values the same as the seed file so routes like `/articles/[id]` and `/heritage/[id]` continue to work.
4. Store media files in Firebase Storage and save the public URLs in Firestore.

## Notes

- `createdAt` is stored as an ISO string in the seed data for easy ordering in the demo.
- Replace the `example.com` URLs with your real Firebase Storage URLs later.