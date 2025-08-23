import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, type IconButtonProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps extends Omit<IconButtonProps, 'onClick'> {
  /** Where to navigate back to. If not provided, uses browser history */
  to?: string;
  /** Custom onClick handler. If provided, 'to' prop is ignored */
  onClick?: () => void;
}

export default function BackButton({ to, onClick, sx, ...props }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back in browser history
    }
  };

  return (
    <IconButton
      onClick={handleClick}
      sx={{
        backgroundColor: 'grey.100',
        '&:hover': { backgroundColor: 'grey.200' },
        ...sx,
      }}
      {...props}
    >
      <ArrowBackIcon />
    </IconButton>
  );
}
