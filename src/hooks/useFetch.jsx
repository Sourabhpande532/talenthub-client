import { useEffect, useState } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("fspToken");
        const headers = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await fetch(url, {
          headers: headers,
        });
        console.log(response);
        
        if (response.status === 401 || response.status === 403) {
          throw new Error("Unauthorized");
        }
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (error) {
        setError(`Failed to fetch token ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData().catch((err) => setError(err.message));
  }, [url]);
  return { data, error, loading };
};
