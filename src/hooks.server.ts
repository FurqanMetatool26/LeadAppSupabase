import "$lib/supabase";
import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const { session, supabaseClient } = await getSupabase(event);

  event.locals.sb = supabaseClient;
  event.locals.session = session;

  if (session) {
    // Fetch the user's profile if a session exists
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      event.locals.user = null;
    } else {
      event.locals.user = {
        id: profileData.id,
        role: profileData.role,
      };
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
