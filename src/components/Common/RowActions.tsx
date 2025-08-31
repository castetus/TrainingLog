import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Stack, Tooltip, IconButton } from '@mui/material';

export const RowActions = ({
  onEdit,
  onDelete,
}: {
  onEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => (
  <Stack direction="row" spacing={0.5}>
    <Tooltip title="Edit">
      <IconButton
        edge="end"
        aria-label="edit"
        color="primary"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(e);
        }}
      >
        <EditIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Delete">
      <IconButton
        edge="end"
        aria-label="delete"
        color="error"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(e);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  </Stack>
);
