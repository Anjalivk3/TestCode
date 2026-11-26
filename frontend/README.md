# Exclusive storefront

Start local MongoDB, then start the backend from `../backend` with `npm run dev`. Start this frontend with `npm run dev`; Vite forwards `/api` requests to port 5000.

## Pages

- `/` — product catalog with search, category filters, and sorting
- `/login` — MongoDB API login
- `/register` — account registration
- `/cart` — authenticated cart, with a local guest cart that syncs after login
