import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Keep-alive function triggered at:', new Date().toISOString())

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Simple query to keep the database active
    const { data, error } = await supabase
      .from('countries')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Database query error:', error)
      throw error
    }

    console.log('Keep-alive successful. Database is active.')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Project kept alive',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Keep-alive error:', errorMessage)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

