ALTER TABLE "public"."Class_User_Child"
ADD CONSTRAINT "Class_User_Child_enrollment_unique"
UNIQUE ("class_id", "user_id", "child_id");
