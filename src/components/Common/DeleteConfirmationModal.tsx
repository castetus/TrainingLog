import { Box, Modal, Typography } from "@mui/material";

interface DeleteConfirmationModalProps {
  entityName: string;
  open: boolean;
  onClose: () => void;
}

const DeleteConfirmationModal = ({ entityName, open, onClose }: DeleteConfirmationModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box>
        <Typography>Are you sure you want to delete this {entityName}?</Typography>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;