-- Hosted Supabase installs pgcrypto functions in the extensions schema. Keep
-- the security-definer routines' explicit search path while allowing their
-- token generation calls to resolve extensions.gen_random_bytes().

alter function public.seal_letter(uuid, text, text, text, timestamptz, jsonb)
  set search_path = public, extensions;

alter function public.reply_to_letter(uuid, uuid, text, text, text, timestamptz, jsonb)
  set search_path = public, extensions;
