-- Migration 014: Fix User Deletion Cascade
-- This allows users to be deleted even if they have active consultations.

BEGIN;

-- 1. Drop old constraints from consultations
ALTER TABLE public.consultations 
  DROP CONSTRAINT IF EXISTS consultations_patient_id_fkey,
  DROP CONSTRAINT IF EXISTS consultations_doctor_id_fkey,
  DROP CONSTRAINT IF EXISTS consultations_analysis_id_fkey;

-- 2. Re-add with ON DELETE CASCADE
ALTER TABLE public.consultations
  ADD CONSTRAINT consultations_patient_id_fkey 
    FOREIGN KEY (patient_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT consultations_doctor_id_fkey 
    FOREIGN KEY (doctor_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT consultations_analysis_id_fkey 
    FOREIGN KEY (analysis_id) REFERENCES public.analysis_results(id) ON DELETE CASCADE;

-- 3. Audit logs set to null (already exists but ensuring it doesn't block)
ALTER TABLE public.audit_logs
  DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;

ALTER TABLE public.audit_logs
  ADD CONSTRAINT audit_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

COMMIT;
