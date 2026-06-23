import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './modules/shared/context/AuthContext';
import AppRouter from './router';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRouter />
      </Router>
    </AuthProvider>
  );
};

export default App;
