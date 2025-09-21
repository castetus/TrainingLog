import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Chip } from '@mui/material';

interface AchievedChipProps {
  /** Whether to show the chip */
  show?: boolean;
  /** Custom label text (defaults to "Increase") */
  label?: string;
  /** Size of the chip */
  size?: 'small' | 'medium';
  /** Variant of the chip */
  variant?: 'outlined' | 'filled';
}

export default function AchievedChip({
  show = true,
  label = 'Increase',
  size = 'small',
  variant = 'filled',
}: AchievedChipProps) {
  if (!show) return null;

  return (
    <Chip
      icon={<TrendingUpIcon />}
      label={label}
      color="success"
      size={size}
      variant={variant}
    />
  );
}
