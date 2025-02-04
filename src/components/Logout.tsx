"use client";

import { createClient } from "@/app/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 hover:text-red-600"
    >
      Sign Out
    </button>
  );
}
