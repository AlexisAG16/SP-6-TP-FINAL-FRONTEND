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

import { useContext } from 'react';
import { AuthContext } from './components/context/AuthContext.jsx';

// eslint-disable-next-line react-refresh/only-export-components
function ProvidersWrapper({ children }) {
  const { user } = useContext(AuthContext);
  
  const userKey = user?.id || user?._id || user?.email || 'anon';
  return (
    <ObrasProvider>
      <CharactersProvider key={userKey}>
        {children}
      </CharactersProvider>
    </ObrasProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProvidersWrapper>
          <App />
        </ProvidersWrapper>
      </AuthProvider>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  </React.StrictMode>
);