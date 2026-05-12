import React, { useState } from 'react';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (item: string) => {
    // Handle navigation logic here
    console.log(`Navigating to: ${item}`);
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleMenu}
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Abrir menú"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => handleMenuItemClick('Reservas')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Reservas
          </button>
          <button
            onClick={() => handleMenuItemClick('Tus clases')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Tus clases
          </button>
          <button
            onClick={() => handleMenuItemClick('Tus sesiones')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Tus sesiones
          </button>
          <button
            onClick={() => handleMenuItemClick('Cerrar sesión')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default Nav;