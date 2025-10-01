import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserPositions } from '../services/dlmmService';
import { Position } from '../types';

export function usePositions() {
  const { publicKey, connected } = useWallet();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = useCallback(async () => {
    if (!publicKey || !connected) {
      setPositions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userPositions = await getUserPositions(publicKey.toString());
      setPositions(userPositions);
    } catch (err) {
      console.error('Failed to fetch positions:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch positions'
      );
      setPositions([]);
    } finally {
      setLoading(false);
    }
  }, [publicKey, connected]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const refreshPositions = useCallback(() => {
    fetchPositions();
  }, [fetchPositions]);

  return {
    positions,
    loading,
    error,
    refreshPositions,
  };
}
