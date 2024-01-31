import React from 'react';
import OrderBook from './components/OrderBook/OrderBook';
import './App.css';

const App: React.FC = () => {
  const appStyles: React.CSSProperties = {
    minHeight: '100vh',
    padding: '5px',
  };
  return (
    <div style={appStyles} className='background-gray'>
      <OrderBook />
    </div>
  );
};

export default App;
