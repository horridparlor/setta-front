import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import MetaTags from './components/common/MetaTags.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MetaTags
      title="Setta"
      description="Rush card game enabling making custom cards with AI art."
      keywords="Setta, Rush Duel, Card Games, Online Card Games, Trading Card Games, Yugioh"
    />
    <App />
  </StrictMode>
);
