import { useEffect, useState } from "react";

export function usePcStatus(pingUrl: string, interval = 5000) {
  const [online, setOnline] = useState<boolean | null>(null);

  async function checkStatus() {
    try {
      const res = await fetch(pingUrl, { method: "GET" });
      console.log(res);
      setOnline(res.ok);
    } catch {
      setOnline(false);
    }
  }

  useEffect(() => {
    checkStatus();
    const id = setInterval(checkStatus, interval);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pingUrl, interval]);

  return online;
}
