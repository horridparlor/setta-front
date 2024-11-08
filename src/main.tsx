import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import MetaTags from './components/common/MetaTags.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MetaTags
      title="Sausage Factory"
      description="Automate your Sausage Factory with eaze!"
      keywords="HkFoods, Sausage, Factory"
    />
    <App />
  </StrictMode>
);
