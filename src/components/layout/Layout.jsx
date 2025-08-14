import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children, currentPage, onPageChange, onOpenAuthModal }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onPageChange={onPageChange} onOpenAuthModal={onOpenAuthModal} />
      <main className="flex-grow pt-16 lg:ml-64 lg:mr-64">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout; 