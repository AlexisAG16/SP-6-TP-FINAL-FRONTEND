import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App.jsx';
import { AuthProvider } from './components/context/AuthContext.jsx';
import { CharactersProvider } from './components/context/CharactersContext.jsx';
import { ObrasProvider } from './components/context/ObrasContext.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
          <ObrasProvider> 
            <CharactersProvider>
              <App />
            </CharactersProvider>
          </ObrasProvider>
      </AuthProvider>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  </React.StrictMode>
);