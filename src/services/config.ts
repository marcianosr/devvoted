import { createClient } from "@/app/supabase/client";

export const updateUserConfig = async (userId: string, configId: string) => {
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from("users")
        .update({ active_config: configId })
        .eq("id", userId)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update user config: ${error.message}`);
    }

    return data;
};
