import { useState, useEffect, useCallback } from 'react';
import { getPoolInfo } from '../services/dlmmService';
import { PoolInfo } from '../types';

export function usePoolData(poolAddress: string | null) {
  const [poolData, setPoolData] = useState<PoolInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPoolData = useCallback(async () => {
    if (!poolAddress) {
      setPoolData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pool = await getPoolInfo(poolAddress);
      setPoolData(pool);
    } catch (err) {
      console.error('Failed to fetch pool data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pool data');
      setPoolData(null);
    } finally {
      setLoading(false);
    }
  }, [poolAddress]);

  useEffect(() => {
    fetchPoolData();
  }, [fetchPoolData]);

  const refreshPoolData = useCallback(() => {
    fetchPoolData();
  }, [fetchPoolData]);

  return {
    poolData,
    loading,
    error,
    refreshPoolData,
  };
}
