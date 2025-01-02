import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import MetaTags from './components/common/MetaTags.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MetaTags
      title="Cinder Hearts"
      description="Competitive card game"
      keywords="Cinder Hearts, Deck Builder, Card Games, Online Card Games, Trading Card Games, Yugioh"
    />
    <App />
  </StrictMode>
);
