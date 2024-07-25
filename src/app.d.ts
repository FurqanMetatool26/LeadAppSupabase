import type { TypedSupabaseClient } from "@supabase/auth-helpers-sveltekit/dist/types";
import type { Session } from "@supabase/supabase-js";

declare global {
  declare namespace App {
    interface Locals {
      sb: TypedSupabaseClient;
      session: Session | null;
      user: {
        id: string;
        role: string;
      } | null;
    }
    interface PageData {
      session: import("@supabase/supabase-js").Session | null;
      user: {
        id: string;
        role: string;
      } | null;
    }
  }
}
