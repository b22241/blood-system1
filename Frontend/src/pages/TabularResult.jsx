import { useEffect, useRef, useState } from "react";

function TabularResult() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const previousIdsRef = useRef(new Set());
  const API_URL = import.meta.env.VITE_API_URL;

useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/history`, {
        signal: controller.signal,
      });
      const result = await res.json();
      setData(result);
      setLoading(false);
    } catch {}
  };

  fetchData();
  const interval = setInterval(fetchData, 15000);

  return () => {
    controller.abort();
    clearInterval(interval);
  };
}, [API_URL]);


  const downloadCSV = () => {
    if (!fromTime || !toTime) {
      alert("Please select both From and To date-time");
      return;
    }

    const from = new Date(fromTime);
    const to = new Date(toTime);

    const filtered = data.filter((item) => {
      const created = new Date(item.createdAt);
      return created >= from && created <= to;
    });

    if (!filtered.length) {
      alert("No data available in selected range");
      return;
    }

    const headers = [
      "Date","Time","TempInside","TempOutside",
      "HumidityInside","HumidityOutside","Latitude","Longitude"
    ];

    const rows = filtered.map((item) => {
      const d = new Date(item.createdAt);
      return [
        d.toLocaleDateString(),
        d.toLocaleTimeString(),
        item.tempInside,
        item.tempOutside,
        item.humidityInside,
        item.humidityOutside,
        item.location?.latitude ?? "",
        item.location?.longitude ?? ""
      ].join(",");
    });

    const blob = new Blob(
      [headers.join(",") + "\n" + rows.join("\n")],
      { type: "text/csv" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blood_transport_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <h2 className="p-6 text-lg font-semibold">Loading data...</h2>;
  }

  return (
    <div className="ml-0 p-6 bg-white min-h-screen">

      <h2 className="text-2xl font-bold text-center mb-4">
        Box Temperature ,Humidity and Location Data
      </h2>

      {/* Filters */}
      <div className="flex items-end gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold" >From</label>
          <input
            type="datetime-local"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="border border-black px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold">To</label>
          <input
            type="datetime-local"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className="border border-black px-2 py-1 text-sm"
          />
        </div>

        <button
          onClick={downloadCSV}
          className="border border-black px-4 py-1 text-sm bg-blue-400 font-medium hover:bg-blue-600"
        >
          Download CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-black  text-center">
          <thead className="border border-black">
            <tr className="font-bold bg-gray-400 ">
              <th className="border border-black px-2 py-1 ">Date</th>
              <th className="border border-black px-2 py-1">Time</th>
              <th className="border border-black px-2 py-1">TempInside(°C) </th>
              <th className="border border-black px-2 py-1">TempOutside(°C) </th>
              <th className="border border-black px-2 py-1">HumidityInside(%)</th>
              <th className="border border-black px-2 py-1">HumidityOutside(%)</th>
              <th className="border border-black px-2 py-1">Latitude</th>
              <th className="border border-black px-2 py-1">Longitude</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => {
              const d = new Date(item.createdAt);
              const isNew = !previousIdsRef.current.has(item._id);
              previousIdsRef.current.add(item._id);

              return (
                <tr
                  key={item._id}
                  className={`border border-black
                    ${isNew ? "bg-green-100" : ""}
                  `}
                >
                  <td className="border border-black px-2 py-1">
                    {d.toLocaleDateString()}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {d.toLocaleTimeString()}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {item.tempInside}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {item.tempOutside}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {item.humidityInside ?? "nan"}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {item.humidityOutside}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {item.location?.latitude ?? "0.000000"}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {item.location?.longitude ?? "0.000000"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabularResult;
