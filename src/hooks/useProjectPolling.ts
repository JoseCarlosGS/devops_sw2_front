import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '@/api/ProjectApi';
import { Project } from '../types';

export const useProjectPolling = (interval = 5000) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects();

    const pollInterval = setInterval(fetchProjects, interval);

    // Auto refresh when window gains focus
    const handleFocus = () => {
      refresh();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [interval, fetchProjects, refresh]);

  return { projects, isLoading, error, refresh };
};
