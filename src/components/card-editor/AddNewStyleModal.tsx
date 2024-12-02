import { useState } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';

const AddNewStyleModal = () => {
  // Modal State and Functions
  const [openStyleModal, setOpenStyleModal] = useState(false);

  const handleOpenStyleModal = () => setOpenStyleModal(true);
  const handleCloseStyleModal = () => setOpenStyleModal(false);

  return (
    <>
      {/* Style Modal Button */}
      <Button
        variant="contained"
        onClick={handleOpenStyleModal}
        sx={{ marginTop: 2 }}
      >
        Add New Style
      </Button>

      {/* Modal for Styles */}
      <Modal open={openStyleModal} onClose={handleCloseStyleModal}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: 'white',
            margin: 'auto',
            maxWidth: '500px',
          }}
        >
          <Typography variant="h6">Create or Edit Style</Typography>
          {/* Additional form fields for Style creation to be implemented later */}
          <Button onClick={handleCloseStyleModal}>Close</Button>
        </Box>
      </Modal>
    </>
  );
};

export default AddNewStyleModal;
