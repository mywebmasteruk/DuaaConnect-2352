import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lqmeshsxchiszfhpcmon.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbWVzaHN4Y2hpc3pmaHBjbW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjI4ODQsImV4cCI6MjA2MDgzODg4NH0.vbebcMK5CbEugUvYKZX7yWeBQ0Ip53q5XMoUfTMpqWQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
