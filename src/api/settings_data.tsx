import { supabase } from "@/utils/supabase";

export const fetchSettingsListData = async () => {
  try {
    const { data, error } = await supabase.from("settings").select("*");

    if (error) {
      console.error("Error fetching data:", error);
      return { data: [], error };
    } else {
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: [], error };
  }
};

export const updateSettingsAttendanceEnableData = async (
  isAttendanceEnable: boolean
) => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .update({ isAttendanceEnable: isAttendanceEnable })
      .eq("id", 1)
      .select("*");

    if (error) {
      console.error("Error updating data:", error);
      return { data: null, error };
    } else {
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: null, error };
  }
};

export const updateSettingsSessionData = async (session: number) => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .update({ session: session })
      .eq("id", 1)
      .select("*");

    if (error) {
      console.error("Error updating data:", error);
      return { data: null, error };
    } else {
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: null, error };
  }
};
