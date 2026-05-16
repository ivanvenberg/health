import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://exwnltblydiyaqdsdyfc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4d25sdGJseWRpeWFxZHNkeWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MjMyNDIsImV4cCI6MjA5NDQ5OTI0Mn0.fOCPdXxAQmloMcxDVQ0dQXsTcgC3vb8CIt90ZTlxKMk'
)

export type Task = {
  id: string
  title: string
  completed: boolean
  created_at: string
}
