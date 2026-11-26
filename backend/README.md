# Exclusive API

## Run locally

1. Start your local MongoDB service.
2. Copy `.env.example` to `.env` and choose a private `JWT_SECRET`.
3. In this folder run `npm install` once, then `npm run dev`.
4. In `../frontend` run `npm run dev`.

The API uses MongoDB at `mongodb://127.0.0.1:27017/exclusive_shop` by default. It creates the product collection from the included seed catalog on first startup. User passwords are hashed with bcrypt (10 rounds); login returns a JWT used by the cart endpoints.

## Endpoints

- `POST /api/auth/register` — `{ name, email, password }`
- `POST /api/auth/login` — `{ email, password }`
- `GET /api/products` — optional `q` and `category` query parameters
- `GET /api/cart` — authenticated cart
- `POST /api/cart` — `{ productId, quantity }`
- `PUT /api/cart` — `{ productId, quantity }`
- `DELETE /api/cart/:productId`
- `GET /api/health`
