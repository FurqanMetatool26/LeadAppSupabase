import { AuthApiError } from "@supabase/supabase-js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  login: async ({ request, locals }) => {
    const body = Object.fromEntries(await request.formData());

    // Sign in the user
    const { data: authData, error: authError } = await locals.sb.auth.signInWithPassword({
      email: body.email as string,
      password: body.password as string,
    });

    if (authError) {
      if (authError instanceof AuthApiError && authError.status === 400) {
        return fail(400, { error: "Invalid credentials" });
      }
      return fail(500, { message: "Server error. Try again later." });
    }

    // Fetch the user's profile with role
    const { data: profileData, error: profileError } = await locals.sb
      .from('profiles')
      .select('id, role')
      .eq('id', authData.user?.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return fail(500, { message: "Failed to fetch user profile. Try again later." });
    }

    // Store user data in locals
    locals.user = {
      id: profileData.id,
      role: profileData.role
    };

    throw redirect(303, "/");
  },
};
