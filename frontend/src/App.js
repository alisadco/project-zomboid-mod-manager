// src/App.js
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ModSelector from './components/ModSelector';

const App = () => (
    <div className="container">
      {/* Header */}
      <Header />

      {/* Body */}
      <ModSelector />

      {/* Footer */}
      <Footer />
    </div>
);

export default App;
