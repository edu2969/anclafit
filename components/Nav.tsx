"use client"; 

import { useState } from 'react';
import { LuCalendarClock } from 'react-icons/lu';
import { MdHome } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { RiLogoutCircleLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = async (item: string) => {
    // Handle navigation logic here
    console.log(`Navigating to: ${item}`);
    switch (item) {
      case 'Reservas':
        // Navigate to Reservas page
        break;
      case 'Horarios':
        router.push("/horarios");
        break;
      case 'Tus sesiones':
        // Navigate to Tus sesiones page
        break;
      case 'Cerrar sesión':
        await signOut({ callbackUrl: "/" });
        break;
      default:
        break;
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleMenu}
        className="bg-[#D5D318] text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <MdHome size={20} className="mr-2" />
            <p className="mt-0">Reservas</p>
          </button>
          <button
            onClick={() => handleMenuItemClick('Horarios')}
            className="flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LuCalendarClock size={20} className="mr-2" />
            <p className="mt-0">Horarios</p>
          </button>
          <button
            onClick={() => handleMenuItemClick('Tus sesiones')}
            className="flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <BiTask size={20} className="mr-2" />
            <p className="mt-0">Tus sesiones</p>
          </button>
          <button
            onClick={() => handleMenuItemClick('Cerrar sesión')}
            className="flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <RiLogoutCircleLine size={20} className="mr-2" />
            <p className="mt-0">Cerrar sesión</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default Nav;