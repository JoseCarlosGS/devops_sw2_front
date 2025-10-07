import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/ProjectApi";
import { useEffect, useCallback } from "react";

type UseProjectPollingOptions = {
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnFocus?: boolean;
  retryCount?: number;
};

export const useProjectPolling = ({
  enabled = true,
  refetchInterval = 5000,
  refetchOnFocus = true,
  retryCount = 3,
}: UseProjectPollingOptions = {}) => {
  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    refetchInterval: enabled ? refetchInterval : false,
    retry: retryCount,
    staleTime: 2000, // Considera los datos frescos por 2 segundos
    refetchOnWindowFocus: false, // Manejamos esto manualmente
  });

  const handleFocus = useCallback(() => {
    if (refetchOnFocus && enabled) {
      refetch();
    }
  }, [refetchOnFocus, enabled, refetch]);

  useEffect(() => {
    if (refetchOnFocus) {
      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }
  }, [refetchOnFocus, handleFocus]);

  return {
    projects,
    isLoading,
    error,
    refresh: refetch,
  };
};
