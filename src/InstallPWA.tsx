// InstallPWA.tsx
import GetAppIcon from '@mui/icons-material/GetApp';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export default function InstallPWA() {
  const [bip, setBip] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      setBip(e as BIPEvent);
      setShowModal(true);
    };
    const onInstalled = () => {
      setInstalled(true);
      setShowModal(false);
    };

    window.addEventListener('beforeinstallprompt', onBIP);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || !bip) return null;

  const handleInstall = async () => {
    await bip.prompt();
    await bip.userChoice;
    setBip(null);
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <Dialog
      open={showModal}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <GetAppIcon color="primary" />
          <Typography variant="h6" component="div">
            Install TrainingLog
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 1 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Install TrainingLog as a Progressive Web App to get the best experience:
          </Typography>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <Typography variant="body2" component="div">
              • Access your workouts offline
            </Typography>
            <Typography variant="body2" component="div">
              • Quick launch from your home screen
            </Typography>
            <Typography variant="body2" component="div">
              • Native app-like experience
            </Typography>
            <Typography variant="body2" component="div">
              • Automatic updates
            </Typography>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined">
          Maybe Later
        </Button>
        <Button
          onClick={handleInstall}
          variant="contained"
          startIcon={<GetAppIcon />}
          color="primary"
        >
          Install App
        </Button>
      </DialogActions>
    </Dialog>
  );
}
