import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL);

function ActivityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on("activity", (activity) => {
      setLogs((prev) => [activity, ...prev].slice(0, 20));
    });

    return () => socket.off("activity");
  }, []);

  return (
    <div className="activity-log">
      <h3>Activity Log</h3>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>
            <strong>{log.message}</strong>
            <br />
            <small>{new Date(log.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityLog;
