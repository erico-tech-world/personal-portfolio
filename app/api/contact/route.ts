import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createClient();
  
  // You must create a table named 'contacts' in your Supabase project
  // with columns: id (uuid), created_at (timestamp), name (text), email (text), message (text)
  const { data, error } = await supabase
    .from('contacts')
    .insert([{ name, email, message }]);

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Message received' }, { status: 201 });
}
