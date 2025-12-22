-- ====================================================
-- SEED DATA FOR CLINIC ADMIN PORTAL
-- ====================================================
-- Use this script to populate your database with sample data.
-- Run this in the Supabase SQL Editor.

-- 1. Create a Clinic
INSERT INTO public.clinics (id, name, address, email, phone, description)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Phòng Khám Đa Khoa Sài Gòn', '123 Đường Nguyễn Huệ, Q.1, TP.HCM', 'contact@saigonclinic.com', '02839999999', 'Phòng khám tiêu chuẩn quốc tế');

-- 2. Create Services
INSERT INTO public.services (id, name, description, price, duration_minutes)
VALUES
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Khám Tổng Quát', 'Khám sức khỏe định kỳ', 300000, 30),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Khám Nhi', 'Chuyên khoa nhi', 250000, 20),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Xét Nghiệm Máu', 'Công thức máu toàn bộ', 150000, 15),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Siêu Âm Bụng', 'Siêu âm màu 4D', 400000, 20),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Tư Vấn Dinh Dưỡng', 'Tư vấn chế độ ăn', 200000, 30);

-- 3. Create Users
-- Note: In a real app, users are in auth.users. 
-- For testing purely with public.users (if your app logic allows it), we insert here.
-- Passwords are plain text dummy here.

-- Admin
INSERT INTO public.users (id, name, email, phone, password, role)
VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'Quản Trị Viên', 'admin@clinic.com', '0901000001', 'password123', 'admin');

-- Staff/Cashier
INSERT INTO public.users (id, name, email, phone, password, role)
VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Thu Ngân Viên', 'cashier@clinic.com', '0901000002', 'password123', 'staff');

-- Doctors Users
INSERT INTO public.users (id, name, email, phone, password, role) VALUES 
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'BS. Nguyễn Văn A', 'doctorA@clinic.com', '0902000001', 'password123', 'doctor'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'BS. Trần Thị B', 'doctorB@clinic.com', '0902000002', 'password123', 'doctor'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'BS. Lê Văn C', 'doctorC@clinic.com', '0902000003', 'password123', 'doctor');

-- Patients Users
INSERT INTO public.users (id, name, email, phone, password, role) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'Phạm Văn Bệnh', 'patient1@gmail.com', '0903000001', 'password123', 'patient'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'Trần Thị Ốm', 'patient2@gmail.com', '0903000002', 'password123', 'patient'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a43', 'Lê Văn Đau', 'patient3@gmail.com', '0903000003', 'password123', 'patient'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Nguyễn Thị Khỏe', 'patient4@gmail.com', '0903000004', 'password123', 'patient'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'Hoàng Văn Mạnh', 'patient5@gmail.com', '0903000005', 'password123', 'patient');

-- 4. Create Doctor Profiles
INSERT INTO public.doctors (id, user_id, clinic_id, specialty, degree, price_per_slot, bio) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Nội Khoa', 'Tiến sĩ', 300000, 'Chuyên gia nội tổng quát 20 năm kinh nghiệm'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Nhi Khoa', 'Thạc sĩ', 250000, 'Yêu trẻ, tận tâm'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a53', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Dinh Dưỡng', 'Bác sĩ CK1', 200000, 'Chuyên gia tư vấn dinh dưỡng');

-- 5. Link Doctor Services
INSERT INTO public.doctor_services (doctor_id, service_id) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'), -- Doc A -> Tong Quat
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'), -- Doc A -> Xet Nghiem Mau
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'), -- Doc B -> Nhi
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'), -- Doc B -> Sieu Am
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a53', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'); -- Doc C -> Dinh Duong

-- 6. Doctor Schedules (Today and Tomorrow)
INSERT INTO public.doctor_schedules (id, doctor_id, date, shift_name, start_time, end_time, is_available) VALUES
-- Doc A Today
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', CURRENT_DATE, 'Sáng', '08:00:00', '12:00:00', true),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', CURRENT_DATE, 'Chiều', '13:00:00', '17:00:00', true),
-- Doc B Today
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', CURRENT_DATE, 'Sáng', '08:00:00', '12:00:00', true),
-- Doc A Tomorrow
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a64', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', CURRENT_DATE + INTERVAL '1 day', 'Sáng', '08:00:00', '12:00:00', true);

-- 7. Bookings
-- Booking 1: Pending (Dispatch needed)
INSERT INTO public.bookings (id, user_id, clinic_id, service_id, patient_name, patient_phone, booking_time, status, symptoms)
VALUES ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a71', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Phạm Văn Bệnh', '0903000001', NOW() + INTERVAL '2 hours', 'pending', 'Đau đầu, chóng mặt');

-- Booking 2: Pending
INSERT INTO public.bookings (id, user_id, clinic_id, service_id, patient_name, patient_phone, booking_time, status, symptoms)
VALUES ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a72', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Bé Ốm', '0903000002', NOW() + INTERVAL '3 hours', 'pending', 'Ho sốt kéo dài');

-- Booking 3: Confirmed (Assigned to Doc A)
INSERT INTO public.bookings (id, user_id, clinic_id, service_id, doctor_id, patient_name, patient_phone, booking_time, status, symptoms, assigned_by)
VALUES ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a73', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a43', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'Lê Văn Đau', '0903000003', NOW() + INTERVAL '1 hour', 'confirmed', 'Đau bụng dưới', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20');

-- Booking 4: Completed (Doc B)
INSERT INTO public.bookings (id, user_id, clinic_id, service_id, doctor_id, patient_name, patient_phone, booking_time, status, symptoms, assigned_by)
VALUES ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a74', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'Nguyễn Thị Khỏe', '0903000004', NOW() - INTERVAL '2 days', 'completed', 'Khám sức khỏe tổng quát', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20');

-- Booking 5: Completed (Doc A)
INSERT INTO public.bookings (id, user_id, clinic_id, service_id, doctor_id, patient_name, patient_phone, booking_time, status, symptoms, assigned_by)
VALUES ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a75', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'Hoàng Văn Mạnh', '0903000005', NOW() - INTERVAL '5 days', 'completed', 'Mệt mỏi, khó ngủ', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20');

-- 8. Medical Records
INSERT INTO public.medical_records (id, booking_id, diagnosis, prescription, doctor_notes)
VALUES ('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a81', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a74', 'Sức khỏe bình thường', 'Vitamin tổng hợp', 'Bệnh nhân phát triển tốt');

-- 9. Payments
-- Payment for Completed Booking 4 (Paid)
INSERT INTO public.payments (id, booking_id, amount, status, payment_date, cashier_id)
VALUES ('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a91', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a74', 250000, 'paid', NOW() - INTERVAL '2 days', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21');

-- Payment for Completed Booking 5 (Pending)
INSERT INTO public.payments (id, booking_id, amount, status)
VALUES ('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a92', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a75', 300000, 'pending');

-- Payment for Booking 3 (Confirmed, user might pay ahead or later, let's say pending)
INSERT INTO public.payments (id, booking_id, amount, status)
VALUES ('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a93', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a73', 300000, 'pending');
