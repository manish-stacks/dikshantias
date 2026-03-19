import { useEffect } from 'react';

export const useAntiCheat = ({ containerRef, isSubmitted, addToast }) => {
  // Force re-enter fullscreen if exited
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement && !isSubmitted) {
        try { containerRef.current?.requestFullscreen(); } catch { }
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [isSubmitted, containerRef]);

  // Warn on tab switch, block refresh, prevent copy shortcuts, disable right-click
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) { e.preventDefault(); e.returnValue = ''; }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted)
        addToast('Warning: Tab switched during quiz', 'warning');
    };

    const handleKeyDown = (e) => {
      if (isSubmitted) return;
      // Block Ctrl+C, Ctrl+Shift+I, F12, etc.
      if ((e.ctrlKey || e.metaKey) && ['c', 'u', 's', 'a'].includes(e.key.toLowerCase())) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) e.preventDefault();
      if (e.key === 'F12') e.preventDefault();
    };

    const handleContextMenu = (e) => {
      if (!isSubmitted) e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isSubmitted, addToast]);
};