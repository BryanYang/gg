import { useState, useEffect, useCallback } from "react";

function useLoadData<T>(apiFunction: () => Promise<any>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [fresh, setFresh] = useState(0);

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
  }, [apiFunction, fresh]); // 当 apiFunction 发生变化时重新加载数据

  const refresh = useCallback(() => {
    setFresh((i) => i + 1);
  }, [])

  return { data, loading, error, refresh };
}

export default useLoadData;
