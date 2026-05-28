# Firebase Security Setup

## Admin Access

The app uses two admin checks:

- Frontend UX check: `VITE_ADMIN_EMAILS` in `.env`
- Real backend protection: Firestore/Storage rules check either a Firebase custom claim or an `/admins/{uid}` document

## Bootstrap First Admin

1. Create/sign in the admin user in Firebase Authentication.
2. Copy that user's UID.
3. In Firestore, create this document:

```text
admins/{uid}
```

Example fields:

```json
{
  "email": "admin@anikara.com",
  "role": "owner",
  "createdAt": "2026-05-28T00:00:00.000Z"
}
```

4. Set `.env`:

```env
VITE_ADMIN_EMAILS="admin@anikara.com"
```

Multiple admin emails can be comma-separated.

## Deploy Rules

After logging in with Firebase CLI:

```bash
firebase deploy --only firestore:rules,storage
```

## Notes

- Product, slide, coupon, and settings writes require admin access.
- Product, slide, coupon, and settings reads are public.
- Users can read and update only their own profile.
- Admins can read user profiles and manage orders/payments.
