
CREATE SCHEMA IF NOT EXISTS "public";

-- ====================================================
-- NHÓM 1: BẢNG DANH MỤC & USER
-- ====================================================

CREATE TABLE "public"."users" (
    "id" uuid DEFAULT gen_random_uuid(), -- Đã sửa: bỏ dấu nháy đơn
    "name" varchar(255) NOT NULL,
    "phone" text NOT NULL UNIQUE,
    "email" text NOT NULL UNIQUE,
    "password" text NOT NULL,
    "role" varchar(50) DEFAULT 'patient', -- patient, admin, doctor, staff
    "avatar_url" text,
    "is_active" boolean DEFAULT TRUE,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."clinics" (
    "id" uuid DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "address" text,
    "email" text NOT NULL UNIQUE,
    "phone" text NOT NULL UNIQUE,
    "image_url" text,
    "description" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."services" (
    "id" uuid DEFAULT gen_random_uuid(),
    "name" text NOT NULL UNIQUE,
    "description" text,
    "price" int NOT NULL,
    "duration_minutes" int DEFAULT 30,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

-- ====================================================
-- NHÓM 2: QUẢN LÝ BÁC SĨ & LỊCH TRỰC
-- ====================================================

CREATE TABLE "public"."doctors" (
    "id" uuid DEFAULT gen_random_uuid(),
    "user_id" uuid,
    "clinic_id" uuid,
    "specialty" text NOT NULL,
    "degree" text,
    "price_per_slot" int,
    "bio" text,
    "is_available" boolean DEFAULT TRUE,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

-- Bảng quan trọng cho logic Combobox: Bác sĩ nào làm được dịch vụ nào?
CREATE TABLE "public"."doctor_services" (
    "doctor_id" uuid REFERENCES "public"."doctors"("id") ON DELETE CASCADE,
    "service_id" uuid REFERENCES "public"."services"("id") ON DELETE CASCADE,
    PRIMARY KEY ("doctor_id", "service_id")
);

CREATE TABLE "public"."doctor_schedules" (
    "id" uuid DEFAULT gen_random_uuid(),
    "doctor_id" uuid NOT NULL,
    "date" date NOT NULL,
    "shift_name" text,
    "start_time" time NOT NULL,
    "end_time" time NOT NULL,
    "max_patients" int DEFAULT 10,
    "is_available" boolean DEFAULT TRUE,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    -- Ràng buộc: Một bác sĩ không thể có 2 ca trùng giờ bắt đầu trong 1 ngày
    CONSTRAINT "unique_doctor_schedule_slot" UNIQUE ("doctor_id", "date", "start_time")
);

-- Index giúp tìm lịch nhanh hơn
CREATE INDEX "doctor_schedules_idx_date_doctor" ON "public"."doctor_schedules" ("date", "doctor_id");

-- ====================================================
-- NHÓM 3: BOOKING & NGHIỆP VỤ
-- ====================================================

CREATE TABLE "public"."bookings" (
    "id" uuid DEFAULT gen_random_uuid(),
    -- Thông tin User nhập
    "user_id" uuid,
    "clinic_id" uuid,
    "service_id" uuid,
    "patient_name" text NOT NULL,
    "patient_phone" text NOT NULL,
    "gender" text,
    "age" int,
    "symptoms" text,
    "booking_time" timestamp NOT NULL,
    
    -- Thông tin Admin xử lý / CRM
    "doctor_id" uuid,                 -- Có thể NULL lúc đầu, Admin gán sau
    "assigned_by" uuid,               -- Admin nào đã gán?
    "staff_note" text,
    "status" varchar(50) DEFAULT 'pending',
    
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."payments" (
    "id" uuid DEFAULT gen_random_uuid(),
    "booking_id" uuid UNIQUE,         -- 1 Booking chỉ có 1 Payment
    "amount" int NOT NULL,
    "method" varchar(50) DEFAULT 'banking',
    "status" varchar(50) DEFAULT 'pending',
    "transaction_code" text,
    "cashier_id" uuid,                -- Thu ngân xác nhận
    "payment_date" timestamp,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."medical_records" (
    "id" uuid DEFAULT gen_random_uuid(),
    "booking_id" uuid UNIQUE,         -- 1 Booking ra 1 Bệnh án
    "diagnosis" text NOT NULL,
    "prescription" text,
    "doctor_notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

-- ====================================================
-- NHÓM 4: KHÓA NGOẠI (FOREIGN KEYS)
-- ====================================================

-- Users & Doctors
ALTER TABLE "public"."doctors" ADD CONSTRAINT "fk_doctors_clinic_id_clinics_id" FOREIGN KEY("clinic_id") REFERENCES "public"."clinics"("id");
ALTER TABLE "public"."doctors" ADD CONSTRAINT "fk_doctors_user_id_users_id" FOREIGN KEY("user_id") REFERENCES "public"."users"("id");

-- Schedules
ALTER TABLE "public"."doctor_schedules" ADD CONSTRAINT "fk_doctor_schedules_doctor_id_doctors_id" FOREIGN KEY("doctor_id") REFERENCES "public"."doctors"("id");

-- Bookings
ALTER TABLE "public"."bookings" ADD CONSTRAINT "fk_bookings_clinic_id_clinics_id" FOREIGN KEY("clinic_id") REFERENCES "public"."clinics"("id");
ALTER TABLE "public"."bookings" ADD CONSTRAINT "fk_bookings_doctor_id_doctors_id" FOREIGN KEY("doctor_id") REFERENCES "public"."doctors"("id");
ALTER TABLE "public"."bookings" ADD CONSTRAINT "fk_bookings_service_id_services_id" FOREIGN KEY("service_id") REFERENCES "public"."services"("id");
ALTER TABLE "public"."bookings" ADD CONSTRAINT "fk_bookings_user_id_users_id" FOREIGN KEY("user_id") REFERENCES "public"."users"("id");
ALTER TABLE "public"."bookings" ADD CONSTRAINT "fk_bookings_assigned_by_users_id" FOREIGN KEY("assigned_by") REFERENCES "public"."users"("id"); -- Đã sửa tên constraint

-- Payments & Medical Records
ALTER TABLE "public"."medical_records" ADD CONSTRAINT "fk_medical_records_booking_id_bookings_id" FOREIGN KEY("booking_id") REFERENCES "public"."bookings"("id");
ALTER TABLE "public"."payments" ADD CONSTRAINT "fk_payments_booking_id_bookings_id" FOREIGN KEY("booking_id") REFERENCES "public"."bookings"("id");
ALTER TABLE "public"."payments" ADD CONSTRAINT "fk_payments_cashier_id_users_id" FOREIGN KEY("cashier_id") REFERENCES "public"."users"("id");