import { useState } from 'react';
import { Box } from '@mui/material';

const TemplatePage = () => {
  const [x] = useState<number>(42);

  return <Box sx={{ m: 2 }}>{x}</Box>;
};

export default TemplatePage;
