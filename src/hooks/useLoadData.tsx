import { useState, useEffect } from "react";

function useLoadData<T>(apiFunction: () => Promise<any>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await apiFunction(); // 调用传入的 API 函数
        setData(response.data);
        setError(null);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [apiFunction]); // 当 apiFunction 发生变化时重新加载数据

  return { data, loading, error };
}

export default useLoadData;
