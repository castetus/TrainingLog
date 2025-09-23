import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, type IconButtonProps } from '@mui/material';
import { useMatches, useNavigate } from 'react-router-dom';

interface BackButtonProps extends Omit<IconButtonProps, 'onClick'> {
  /** Where to navigate back to. If not provided, uses browser history */
  to?: string;
  /** Custom onClick handler. If provided, 'to' prop is ignored */
  onClick?: () => void;
}

export default function BackButton({ sx, ...props }: BackButtonProps) {
  const navigate = useNavigate();
  const matches = useMatches();
  const target = matches.at(-1 - 1);

  const handleClick = () => {
    navigate(target?.pathname || '/');
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
