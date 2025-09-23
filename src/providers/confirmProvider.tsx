import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

type ConfirmOptions = {
  title?: React.ReactNode;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};
type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export const useConfirm = (): ConfirmFn => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
};

export const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({});
  const resolverRef = useRef<(v: boolean) => void>(undefined);

  const confirm: ConfirmFn = useCallback((o) => {
    setOpts(o);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleCancel = useCallback(() => {
    setOpen(false);
    resolverRef.current?.(false);
    resolverRef.current = undefined;
  }, []);

  const handleOk = useCallback(() => {
    setOpen(false);
    resolverRef.current?.(true);
    resolverRef.current = undefined;
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs">
        {opts.title && <DialogTitle>{opts.title}</DialogTitle>}
        {opts.message && (
          <DialogContent>
            {typeof opts.message === 'string' ? (
              <Typography variant="body2">{opts.message}</Typography>
            ) : (
              opts.message
            )}
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleCancel}>{opts.cancelText ?? 'Cancel'}</Button>
          <Button onClick={handleOk} color={opts.danger ? 'error' : 'primary'} variant="contained">
            {opts.confirmText ?? 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};
