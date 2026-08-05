/* ===========================
   CONEXIÓN CON SUPABASE
=========================== */

const SUPABASE_URL =
    "https://tgjkddrmmlxuyzvwyorr.supabase.co";

const SUPABASE_PUBLIC_KEY =
    "sb_publishable_n_8ie5HXW4YuTlGYFbaILQ_hywvCyMO";

const clienteSupabase = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY
);