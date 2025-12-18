import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './layouts/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CategoriesExpense from './pages/CategoriesExpense.jsx';
import CategoriesIncome from './pages/CategoriesIncome.jsx';
import MainTransaction from './pages/MainTransaction.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />

        <Route path="/categories/expenses" element={
          <Layout>
            <CategoriesExpense />
          </Layout>
        } />

        <Route path="/categories/income" element={
          <Layout>
            <CategoriesIncome />
          </Layout>
        } />

        <Route path="/main-transaction" element={
          <Layout>
            <MainTransaction />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
