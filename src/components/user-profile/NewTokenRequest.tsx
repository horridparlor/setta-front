import React from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

const NewTokenRequest: React.FC = () => {
  return (
    <Box sx={{ mb: 3, p: 2, border: '1px solid #d3d3d3', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        New Token Request
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Last Filled</TableCell>
            <TableCell>Requested</TableCell>
            <TableCell>Cards in Queue</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>dd/mm/yyyy hh:mm:ss</TableCell>
            <TableCell>dd/mm/yyyy hh:mm:ss</TableCell>
            <TableCell>5</TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mr: 1 }}
              >
                Refill Tokens
              </Button>
              <Button variant="outlined" color="error" size="small">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default NewTokenRequest;
