import { useState, useEffect, useCallback } from "react";

type FuncParamType<T> = T extends (x: infer U) => any ? U : never;

type FuncReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type PromiseType<T> = T extends Promise<infer U> ? U : never;

type ObjData<T> = T extends { data: infer U; } ? U : never;

type DataType<T> = ObjData<PromiseType<FuncReturnType<T>>>;

function useLoadData<T extends Function>(
  apiFunction: T,
  params?: FuncParamType<T>
) {
  const [data, setData] = useState<DataType<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [fresh, setFresh] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await apiFunction(params); // 调用传入的 API 函数
        setData(response.data);
        setError(null);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [apiFunction, fresh, params]); // 当 apiFunction 发生变化时重新加载数据

  const refresh = useCallback(() => {
    setFresh((i) => i + 1);
  }, []);

  return { data, loading, error, refresh };
}

export default useLoadData;
