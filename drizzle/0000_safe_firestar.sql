CREATE TYPE "public"."admin_role" AS ENUM('admin', 'super_admin');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('sujet', 'corrige');--> statement-breakpoint
CREATE TYPE "public"."exam_code" AS ENUM('bepc', 'bac');--> statement-breakpoint
CREATE TYPE "public"."session_type" AS ENUM('normale', 'remplacement');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "admin_role" DEFAULT 'admin' NOT NULL,
	"password_hash" text NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_paper_id" uuid NOT NULL,
	"type" "document_type" NOT NULL,
	"storage_key" text NOT NULL,
	"url" text NOT NULL,
	"file_size_bytes" bigint DEFAULT 0 NOT NULL,
	"page_count" smallint,
	"download_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_papers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"series_id" uuid,
	"subject_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" smallint NOT NULL,
	"type" "session_type" DEFAULT 'normale' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" "exam_code" NOT NULL,
	"label" text NOT NULL,
	"position" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exams_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "series" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"code" text NOT NULL,
	"label" text NOT NULL,
	"slug" text NOT NULL,
	"position" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"label" text NOT NULL,
	"slug" text NOT NULL,
	"position" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subjects_code_unique" UNIQUE("code"),
	CONSTRAINT "subjects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_exam_paper_id_exam_papers_id_fk" FOREIGN KEY ("exam_paper_id") REFERENCES "public"."exam_papers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_papers" ADD CONSTRAINT "exam_papers_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_papers" ADD CONSTRAINT "exam_papers_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_papers" ADD CONSTRAINT "exam_papers_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_papers" ADD CONSTRAINT "exam_papers_session_id_exam_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."exam_sessions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "series" ADD CONSTRAINT "series_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "documents_paper_type_uq" ON "documents" USING btree ("exam_paper_id","type");--> statement-breakpoint
CREATE INDEX "documents_paper_idx" ON "documents" USING btree ("exam_paper_id");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_papers_with_series_uq" ON "exam_papers" USING btree ("exam_id","series_id","subject_id","session_id") WHERE "exam_papers"."series_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "exam_papers_without_series_uq" ON "exam_papers" USING btree ("exam_id","subject_id","session_id") WHERE "exam_papers"."series_id" IS NULL;--> statement-breakpoint
CREATE INDEX "exam_papers_exam_idx" ON "exam_papers" USING btree ("exam_id");--> statement-breakpoint
CREATE INDEX "exam_papers_series_idx" ON "exam_papers" USING btree ("series_id");--> statement-breakpoint
CREATE INDEX "exam_papers_subject_idx" ON "exam_papers" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "exam_papers_session_idx" ON "exam_papers" USING btree ("session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_sessions_year_type_uq" ON "exam_sessions" USING btree ("year","type");--> statement-breakpoint
CREATE UNIQUE INDEX "series_exam_code_uq" ON "series" USING btree ("exam_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "series_exam_slug_uq" ON "series" USING btree ("exam_id","slug");