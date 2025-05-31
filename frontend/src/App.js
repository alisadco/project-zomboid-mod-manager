// src/App.js
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ModSelector from './components/ModSelector';

const App = () => (
    <div className="app">
        <div className="app-container">
            <Header />
            <main className="main-content">
                <ModSelector />
            </main>
            <Footer />
        </div>
    </div>
);

export default App;