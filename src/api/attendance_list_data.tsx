import { supabase } from "@/utils/supabase";

export const fetchAttendanceListData = async (
  entriesPerPage: number,
  currentPage: number,
  idNumber: String
) => {
  try {
    const offset = (currentPage - 1) * entriesPerPage;

    let query = supabase.from("attendance_list").select("*");

    if (idNumber) {
      query = query.like("id_number", `%${idNumber}%`);
    }

    const { data, error } = await query
      .order("last_modified", { ascending: false })
      .range(offset, offset + entriesPerPage - 1);

    if (error) {
      console.error("Error fetching data:", error);
      return { data: [], error };
    } else {
      //   console.log("Data:", data);
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: [], error };
  }
};

export const fetchAttendanceListDataForExport = async (
  valueLimit: number,
  start: number,
  end: number
) => {
  try {
    let query = supabase
      .from("attendance_list")
      .select(`id_number,time_in, time_out`, { count: "exact" });

    if (start && end) {
      query = query.range(start, end);
    }
    if (valueLimit) {
      query = query.limit(valueLimit);
    }

    const { data, error, count } = await query.order("last_modified", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching data:", error);
      return { data: [], error };
    } else {
      return { data, count, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: [], error };
  }
};

export const checkAttendanceTimeInListData = async (
  idNumber: string,
  timeIn: string,
  session: number
) => {
  const date = new Date(timeIn);
  const formattedTimeInStart = `${date.toISOString().slice(0, 10)}T00:00:00Z`;
  const formattedTimeInEnd = `${date.toISOString().slice(0, 10)}T23:59:59Z`;

  try {
    let query = supabase
      .from("attendance_list")
      .select("*")
      .eq("id_number", idNumber)
      .gte("time_in", formattedTimeInStart)
      .lte("time_in", formattedTimeInEnd)
      .eq("session", session);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching data:", error);
      return { data: [], error };
    } else {
      //   console.log("Data:", data);
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: [], error };
  }
};

export const checkAttendanceTimeOutListData = async (
  idNumber: string,
  timeIn: string,
  session: number
) => {
  const date = new Date(timeIn);
  const formattedTimeInStart = `${date.toISOString().slice(0, 10)}T00:00:00Z`;
  const formattedTimeInEnd = `${date.toISOString().slice(0, 10)}T23:59:59Z`;

  try {
    let query = supabase
      .from("attendance_list")
      .select("*")
      .eq("id_number", idNumber)
      .gte("time_out", formattedTimeInStart)
      .lte("time_out", formattedTimeInEnd)
      .eq("session", session);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching data:", error);
      return { data: [], error };
    } else {
      //   console.log("Data:", data);
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: [], error };
  }
};

export const insertAttendanceListData = async (rowData: Array<any>) => {
  try {
    const { data, error } = await supabase
      .from("attendance_list")
      .insert(rowData)
      .select("*");

    if (error) {
      console.error("Error inserting data:", error);
      return { data: null, error };
    } else {
      // console.log("Successfully inserted data:", data);
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: null, error };
  }
};

export const updateAttendanceListData = async (
  idNumber: string,
  timeIn: string,
  updateData: Array<any>,
  session: number
) => {
  const date = new Date(timeIn);
  const formattedTimeInStart = `${date.toISOString().slice(0, 10)}T00:00:00Z`;
  const formattedTimeInEnd = `${date.toISOString().slice(0, 10)}T23:59:59Z`;

  try {
    const { data, error } = await supabase
      .from("attendance_list")
      .update(updateData)
      .eq("id_number", idNumber)
      .gte("time_in", formattedTimeInStart)
      .lte("time_in", formattedTimeInEnd)
      .eq("session", session)
      .select("*");

    if (error) {
      console.error("Error updating data:", error);
      return { data: null, error };
    } else {
      // console.log("Successfully updated data:", data);
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: null, error };
  }
};
