-- Drop updated_at from User and Child (unused)
ALTER TABLE "public"."User" DROP COLUMN IF EXISTS "updated_at";
ALTER TABLE "public"."Child" DROP COLUMN IF EXISTS "updated_at";

-- Change Class datetime columns from timestamp (no tz) to timestamptz.
-- Existing data was stored with UTC intent (toUtcIsoFromLocal appended Z),
-- so we annotate it explicitly as UTC on the way over.
ALTER TABLE "public"."Class"
  ALTER COLUMN "start_datetime" TYPE timestamp with time zone
    USING "start_datetime" AT TIME ZONE 'UTC',
  ALTER COLUMN "end_datetime" TYPE timestamp with time zone
    USING "end_datetime" AT TIME ZONE 'UTC';
