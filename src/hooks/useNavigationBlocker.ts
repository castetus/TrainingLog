import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

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
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const handleConfirm = async () => {
        const confirmed = await confirmExit();
        if (confirmed) {
          onConfirmExit();
          blocker.proceed();
        } else {
          onCancelExit();
          blocker.reset();
        }
      };

      handleConfirm();
    }
  }, [blocker, confirmExit, onConfirmExit, onCancelExit]);

  // Also handle browser refresh/close
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = 'You have an active workout session. Are you sure you want to leave?';
      return 'You have an active workout session. Are you sure you want to leave?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when]);
};
