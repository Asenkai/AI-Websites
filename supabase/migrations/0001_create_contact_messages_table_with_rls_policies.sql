-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users (or functions) to insert messages
CREATE POLICY "Allow authenticated to insert contact messages" ON public.contact_messages
FOR INSERT TO authenticated WITH CHECK (true);

-- Prevent direct read, update, or delete from client-side for security
-- If you need to view these messages, you should do so via the Supabase dashboard
-- or a secure backend process, not directly from the client.