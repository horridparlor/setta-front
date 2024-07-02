import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import MetaTags from "./components/common/MetaTags";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <MetaTags
            title="Setta"
            description="Rush card game enabling making custom cards with AI art."
            keywords="Setta, Rush Duel, Card Games, Online Card Games, Trading Card Games, Yugioh"
        />
        <App/>
    </React.StrictMode>
);

reportWebVitals();
