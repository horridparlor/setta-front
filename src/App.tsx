import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/Theme';
import './styles/montserrat.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCards from './hooks/useCards';
import useExpansions from './hooks/useExpansions';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CardCataloguePage from './pages/card-catalogue';
import CardEditorPage from './pages/card-editor';
import UserManagamentPage from './pages/user-management';

export default function App() {
  const { expansions, fetchExpansions } = useExpansions();
  const { cards, cardOwners, fetchCards } = useCards();
  const refetch = async () => {
    await fetchExpansions();
    await fetchCards();
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/card-catalogue" />} />
          <Route
            path="/card-catalogue"
            element={
              <CardCataloguePage
                cards={cards}
                cardOwners={cardOwners}
                expansions={expansions}
                refetch={refetch}
              />
            }
          />
          <Route
            path="/card-editor"
            element={<Navigate to="/card-editor/new" />}
          />
          <Route
            path="/card-editor/:cardId"
            element={<CardEditorPage cards={cards} refetch={refetch} />}
          />
          <Route
            path="/user-management"
            element={<UserManagamentPage refetch={refetch}/>}
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </ThemeProvider>
  );
};
