-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user', -- 'admin', 'user', 'manager'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'license', 'insurance', 'registration', 'permit', 'other'
  description TEXT,
  expiry_date DATE,
  issue_date DATE,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'expiring_soon'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_number TEXT NOT NULL UNIQUE,
  vehicle_type TEXT NOT NULL, -- 'truck', 'van', 'car', 'bus', 'other'
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  vin TEXT UNIQUE,
  license_plate TEXT UNIQUE,
  purchase_date DATE,
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'maintenance'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance records table
CREATE TABLE IF NOT EXISTS public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL, -- 'oil_change', 'inspection', 'repair', 'service', 'other'
  description TEXT,
  cost DECIMAL(10, 2),
  maintenance_date DATE NOT NULL,
  next_due_date DATE,
  status TEXT DEFAULT 'completed', -- 'completed', 'scheduled', 'pending'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document attachments table
CREATE TABLE IF NOT EXISTS public.document_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expiry alerts table
CREATE TABLE IF NOT EXISTS public.expiry_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'document_expiry', 'maintenance_due', 'inspection_due'
  title TEXT NOT NULL,
  description TEXT,
  expiry_date DATE NOT NULL,
  alert_date DATE NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  is_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounting transactions table
CREATE TABLE IF NOT EXISTS public.accounting_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  maintenance_record_id UUID REFERENCES public.maintenance_records(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'expense', 'income', 'maintenance', 'fuel'
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  category TEXT,
  transaction_date DATE NOT NULL,
  payment_method TEXT, -- 'cash', 'card', 'bank_transfer', 'check'
  reference_number TEXT,
  synced_to_accounting BOOLEAN DEFAULT FALSE,
  external_transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expiry_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for documents
CREATE POLICY "documents_select_own" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "documents_insert_own" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "documents_update_own" ON public.documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "documents_delete_own" ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for vehicles
CREATE POLICY "vehicles_select_own" ON public.vehicles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "vehicles_insert_own" ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vehicles_update_own" ON public.vehicles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "vehicles_delete_own" ON public.vehicles FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for maintenance records
CREATE POLICY "maintenance_select_own" ON public.maintenance_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "maintenance_insert_own" ON public.maintenance_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "maintenance_update_own" ON public.maintenance_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "maintenance_delete_own" ON public.maintenance_records FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for document attachments
CREATE POLICY "attachments_select_own" ON public.document_attachments FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "attachments_insert_own" ON public.document_attachments FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "attachments_delete_own" ON public.document_attachments FOR DELETE USING (auth.uid() = uploaded_by);

-- Create RLS policies for expiry alerts
CREATE POLICY "alerts_select_own" ON public.expiry_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "alerts_insert_own" ON public.expiry_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "alerts_update_own" ON public.expiry_alerts FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for accounting transactions
CREATE POLICY "transactions_select_own" ON public.accounting_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.accounting_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transactions_update_own" ON public.accounting_transactions FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_expiry_date ON public.documents(expiry_date);
CREATE INDEX idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX idx_maintenance_vehicle_id ON public.maintenance_records(vehicle_id);
CREATE INDEX idx_maintenance_user_id ON public.maintenance_records(user_id);
CREATE INDEX idx_alerts_user_id ON public.expiry_alerts(user_id);
CREATE INDEX idx_alerts_expiry_date ON public.expiry_alerts(expiry_date);
CREATE INDEX idx_transactions_user_id ON public.accounting_transactions(user_id);
