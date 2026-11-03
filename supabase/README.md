# Pet Farm cloud accounts (Supabase project bowjzdxyinmxhtexmtgl)
- Private schema `petfarm` (not exposed to the Data API): `players`, `sessions`. RLS on, no policies, all grants revoked from anon/authenticated.
- SQL functions `petfarm.check_name/register/login/save_game/load_game` — PIN bcrypt-hashed (pgcrypto crypt/gen_salt('bf')), 5 wrong codes => 10 min lock, session tokens stored as sha256 hashes (30 days).
- Edge Function `petfarm` (verify_jwt=false; it does its own checks) calls those functions via SUPABASE_DB_URL. The client needs NO key.
- NEVER commit the service_role / secret key or DB password.
