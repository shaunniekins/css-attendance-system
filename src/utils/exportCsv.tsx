import { fetchAttendanceListDataForExport } from "@/api/attendance_list_data";

export const handleExportCSV = () => {
  const currentDate = new Date().toISOString().slice(0, 10);
  let dataVal: any;
  let countVal: any;
  const fileName = `[${currentDate}] - CSS Attendance List.csv`;
  const title = "CSS Attendance List";

  let isCalled = false;
  let breakCount = 0;
  let start = 0;
  let end = 999;

  const fetchAttendanceData = async () => {
    const { data, error, count } = await fetchAttendanceListDataForExport(
      1000,
      start,
      end
    );

    if (error) {
    } else {
      if (!dataVal || dataVal.length === 0) {
        dataVal = data;
      } else {
        dataVal = [...dataVal, ...data];
      }
      countVal = count;
    }
  };

  const fetchAttendanceDataLog = async () => {
    do {
      await fetchAttendanceData();
      start += 1000;
      end += 1000;
      if (!isCalled) {
        breakCount = countVal;
      } else {
        breakCount -= 1000;
      }
      isCalled = true;
    } while (breakCount > 1000);

    const csvData = [`"${title}"`, "ID Number,Time In,Time Out"];

    dataVal.forEach((item: any) => {
      const id_num = item.id_number;
      // const time_in = item.time_in;
      // const time_out = item.time_out;
      const time_in =
        item.time_in && !isNaN(new Date(item.time_in).valueOf())
          ? new Intl.DateTimeFormat("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "UTC",
            }).format(new Date(item.time_in))
          : "";

      const time_out =
        item.time_out !== null
          ? new Intl.DateTimeFormat("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "UTC",
            }).format(new Date(item.time_out))
          : "";

      const row = [`"${id_num}"`, `"${time_in}"`, `"${time_out}"`].join(",");

      csvData.push(row);
    });
    const csvContent = csvData.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const response = confirm("Do you want to download the CSV file?");
    if (response) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  fetchAttendanceDataLog();
};
