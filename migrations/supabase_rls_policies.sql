-- ==========================================
-- SUPERBASE ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Instructions: Paste this entire script into your Supabase SQL Editor and click "Run".

-- 1. Enable RLS on all tables
ALTER TABLE "services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "appointments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "appointment_services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "owners" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "newsletter_subscribers" ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (to ensure clean slate if run multiple times)
DROP POLICY IF EXISTS "Public can view active services" ON "services";
DROP POLICY IF EXISTS "Public can insert appointments" ON "appointments";
DROP POLICY IF EXISTS "Public can insert appointment_services" ON "appointment_services";
DROP POLICY IF EXISTS "Public can insert contact messages" ON "contact_messages";
DROP POLICY IF EXISTS "Public can insert owners" ON "owners";
DROP POLICY IF EXISTS "Public can insert pets" ON "pets";
DROP POLICY IF EXISTS "Public can insert newsletter subscribers" ON "newsletter_subscribers";
DROP POLICY IF EXISTS "Admins have full access" ON "services";
DROP POLICY IF EXISTS "Admins have full access" ON "appointments";
DROP POLICY IF EXISTS "Admins have full access" ON "appointment_services";
DROP POLICY IF EXISTS "Admins have full access" ON "contact_messages";
DROP POLICY IF EXISTS "Admins have full access" ON "owners";
DROP POLICY IF EXISTS "Admins have full access" ON "pets";
DROP POLICY IF EXISTS "Admins have full access" ON "newsletter_subscribers";

-- 3. Create Public Policies (What unauthenticated users are allowed to do)
-- Services: Anyone can read them (needed for the /services page)
CREATE POLICY "Public can view active services" 
ON "services" FOR SELECT 
USING (true);

-- Appointments: Anyone can insert (book an appointment), but they CANNOT read other people's appointments
CREATE POLICY "Public can insert appointments" 
ON "appointments" FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can insert appointment_services" 
ON "appointment_services" FOR INSERT 
WITH CHECK (true);

-- Contact Messages: Anyone can insert (send a message)
CREATE POLICY "Public can insert contact messages" 
ON "contact_messages" FOR INSERT 
WITH CHECK (true);

-- Owners & Pets: Public can insert when booking an appointment
CREATE POLICY "Public can insert owners" 
ON "owners" FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can insert pets" 
ON "pets" FOR INSERT 
WITH CHECK (true);

-- Newsletter: Public can subscribe
CREATE POLICY "Public can insert newsletter subscribers" 
ON "newsletter_subscribers" FOR INSERT 
WITH CHECK (true);

-- 4. Create Admin Policies (Full access for authenticated admins)
-- Note: 'authenticated' is a special Supabase role assigned when a user logs in via Auth.
CREATE POLICY "Admins have full access" ON "services" FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access" ON "appointments" FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access" ON "appointment_services" FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access" ON "contact_messages" FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access" ON "owners" FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access" ON "pets" FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access" ON "newsletter_subscribers" FOR ALL TO authenticated USING (true);

-- Note: We do not add policies for admin_users, staff, billing, etc., assuming they are internal 
-- and accessed either via Service Role Key or handled securely on the server. If they are accessed 
-- by the client, RLS defaults to DENY ALL, which is secure.
