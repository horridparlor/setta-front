import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/Theme';
import './styles/montserrat.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes } from 'react-router-dom';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes></Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </ThemeProvider>
  );
}
