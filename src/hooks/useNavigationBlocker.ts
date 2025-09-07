import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UseNavigationBlockerOptions {
  when: boolean;
  onConfirmExit: () => void;
  onCancelExit: () => void;
  confirmExit: () => Promise<boolean>;
}

export const useNavigationBlocker = ({
  when,
  onConfirmExit,
  onCancelExit,
  confirmExit,
}: UseNavigationBlockerOptions) => {
  const location = useLocation();
  const isBlocked = useRef(false);

  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = 'You have an active workout session. Are you sure you want to leave?';
      return 'You have an active workout session. Are you sure you want to leave?';
    };

    // Use a more reliable approach for back button detection
    const handlePopState = async (event: PopStateEvent) => {
      if (isBlocked.current) return;

      // Prevent the default navigation
      event.preventDefault();
      isBlocked.current = true;

      try {
        const confirmed = await confirmExit();

        if (confirmed) {
          onConfirmExit();
        } else {
          onCancelExit();
          // Push the current location back to the history stack
          window.history.pushState(null, '', location.pathname);
        }
      } catch (error) {
        // If confirmation fails, stay on current page
        onCancelExit();
        window.history.pushState(null, '', location.pathname);
      } finally {
        isBlocked.current = false;
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState, { capture: true });

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState, { capture: true });
    };
  }, [when, onConfirmExit, onCancelExit, confirmExit, location.pathname]);
};
