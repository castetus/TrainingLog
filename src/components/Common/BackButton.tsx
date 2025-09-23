import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { useMatches, useNavigate } from 'react-router-dom';

export default function BackButton() {
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
      }}
    >
      <ArrowBackIcon />
    </IconButton>
  );
}
