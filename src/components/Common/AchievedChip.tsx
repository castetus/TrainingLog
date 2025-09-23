import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Chip } from '@mui/material';

interface AchievedChipProps {
  /** Whether to show the chip */
  show?: boolean;
}

export default function AchievedChip({ show = true }: AchievedChipProps) {
  if (!show) return null;

  return (
    <Chip
      icon={<TrendingUpIcon />}
      label={'Increase'}
      color="success"
      size={'small'}
      variant={'filled'}
    />
  );
}
