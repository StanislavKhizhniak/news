import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children, currentPage, onPageChange }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onPageChange={onPageChange} />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout; 