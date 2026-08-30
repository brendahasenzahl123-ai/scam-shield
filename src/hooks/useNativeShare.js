import { useState, useCallback } from 'react';

export function useNativeShare() {
  const [sharing, setSharing] = useState(false);

  const share = useCallback(async ({ title, text, url }) => {
    setSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return { success: true };
      } else if (navigator.clipboard) {
        const shareText = url || text || title;
        await navigator.clipboard.writeText(shareText);
        return { fallback: 'clipboard' };
      }
      return { unsupported: true };
    } catch (err) {
      if (err.name === 'AbortError') return { cancelled: true };
      return { error: err.message };
    } finally {
      setSharing(false);
    }
  }, []);

  return { share, sharing };
}