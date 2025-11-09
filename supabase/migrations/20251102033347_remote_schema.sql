alter table "public"."Class_Coach" drop constraint "Class_Coach_coach_id_fkey";

alter table "public"."Class" drop column "volunteer_hours";

alter table "public"."Class_Coach" add column "volunteer_hours" integer not null;

alter table "public"."Class_Coach" add constraint "Class_Coach_coach_id_fkey" FOREIGN KEY (coach_id) REFERENCES "Coach"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Class_Coach" validate constraint "Class_Coach_coach_id_fkey";



