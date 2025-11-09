drop policy "parent admin insert only" on "public"."Class_User_Child";

drop policy "admin insert only" on "public"."User";

alter table "public"."Class_Coach" drop constraint "Class_Coach_coach_id_fkey";

alter table "public"."Class" add column "price_id" text not null;

alter table "public"."Class_User_Child" alter column "charge_id" set data type text using "charge_id"::text;

alter table "public"."Coach" drop column "total_hours";

alter table "public"."User" alter column "phone" set data type text using "phone"::text;

alter table "public"."Class_Coach" add constraint "Class_Coach_coach_id_fkey" FOREIGN KEY (coach_id) REFERENCES "Coach"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Class_Coach" validate constraint "Class_Coach_coach_id_fkey";

create policy "parent admin insert only"
on "public"."Class_User_Child"
as permissive
for insert
to anon
with check (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT auth.role() AS role) = 'admin'::text)));


create policy "admin insert only"
on "public"."User"
as permissive
for insert
to authenticated
with check (true);



