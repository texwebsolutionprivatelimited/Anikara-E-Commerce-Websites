# Firestore Data Schema (Production)

This project now expects realtime data from Firestore collections below.

## `products` (collection)
Document ID: product id string (example: `p-1735801200` or `ns1`)

Required fields:
- `name` (string)
- `price` (number)
- `category` (string)
- `image` (string, ImageKit URL)
- `description` (string)

Recommended fields:
- `oldPrice` (number)
- `stock` (number)
- `altImage` (string)
- `images` (string[])
- `sizes` (string[])
- `colors` ({ name: string, hex: string }[])
- `details` (string[])
- `reviews` ({ user: string, rating: number, date: string, comment: string }[])
- `rating` (number)
- `ratingCount` (number)
- `displaySection` (string: `deals|trending|new_arrivals`)
- `badge` (string|null)
- `createdAt` (ISO string)
- `updatedAt` (ISO string)

## `categories` (collection)
Document ID: slug (example: `ethnic-wear`)

Fields:
- `name` (string)
- `image` (string, ImageKit URL)
- `updatedAt` (ISO string)

## `coupons` (collection)
Document ID: string id

Fields:
- `id` (number|string)
- `label` (string)
- `headline` (string)
- `subtext` (string)
- `code` (string, uppercase)
- `condition` (string)
- `discountPercent` (number)
- `accent` (string, hex)
- `bg` (string)
- `badgeBg` (string, hex)
- `active` (boolean)

## `slides` (collection)
Document ID: string id

Fields:
- `id` (number|string)
- `title` (string)
- `subtitle` (string)
- `desc` (string)
- `navigatePage` (string)
- `navigateParams` (map)
- `image` (string, ImageKit URL preferred)
- `active` (boolean)

## `orders` (collection)
Document ID: order id string (`ORD-XXXX-YYYY`)

Fields:
- `id` (string)
- `date` (YYYY-MM-DD)
- `total` (number)
- `status` (string)
- `trackingStep` (number)
- `items` (array of order line objects)
- `address` (string)
- `paymentMethod` (string)

## `payments` (collection)
Document ID: transaction id string (`TXN-XXXXXX`)

Fields:
- `id` (string)
- `orderId` (string)
- `customerName` (string)
- `customerEmail` (string)
- `customerPhone` (string)
- `amount` (number)
- `paymentMethod` (string)
- `date` (YYYY-MM-DD)
- `time` (HH:mm)
- `status` (string)
- `refundReason` (string, optional)

## `settings` (collection)
Document ID used by app: `general`

Fields used now:
- `businessName` (string)
- `gstPercent` (number)
- `shippingThreshold` (number)
- `shippingFee` (number)
- `maintenanceMode` (boolean)

Recommended extra fields (for footer/contact):
- `supportAddress` (string)
- `supportPhone` (string)
- `supportEmail` (string)

## `users` (collection)
Document ID: Firebase Auth UID

Fields:
- `name` (string)
- `phone` (string)
- `address` (map: `street, city, state, zip, country`)
- `createdAt` (ISO string)

## Optional admin realtime feeds
For admin notification/message center if needed:

### `admin_notifications`
- `title` (string)
- `desc` (string)
- `time` (string)
- `read` (boolean)
- `createdAt` (ISO string)

### `admin_messages`
- `sender` (string)
- `text` (string)
- `time` (string)
- `read` (boolean)
- `createdAt` (ISO string)

## Index Recommendations
Create composite indexes as usage grows, especially:
- `products`: `category` + `displaySection`
- `products`: `updatedAt` desc
- `orders`: `date` desc
- `payments`: `date` desc, `orderId`
- `coupons`: `active`
