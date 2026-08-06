import React from 'react';
import AppRouter from './routes/AppRouter';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <AppRouter />
    </CartProvider>
  );
}
