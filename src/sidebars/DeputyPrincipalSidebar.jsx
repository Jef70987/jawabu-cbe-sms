import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { DeputyPrincipalSidebarData } from '../SidebarData/DeputyPrincipalSidebarData';
import { ChevronDown, ChevronRight, LogOut, User, Menu, X } from 'lucide-react';

const DeputyPrincipalSidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSubmenu = (index) => {
    setOpenMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isActiveRoute = (path) => {
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col
        transition-all duration-300 ease-in-out z-50
        w-64
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* School Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Deputy Principal</h2>
              <p className="text-xs text-gray-500">Discipline & Student Affairs</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              SM
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Dr. Sarah Martinez</p>
              <p className="text-xs text-gray-600">Deputy Principal</p>
              <p className="text-xs text-gray-500 mt-1">Last login: Today 8:45 AM</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <ul className="space-y-1 px-3">
            {DeputyPrincipalSidebarData.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  <div className="mb-1">
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActiveRoute(item.path)
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={isActiveRoute(item.path) ? 'text-white' : 'text-gray-500'}>{item.icon}</span>
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {openMenus[index] ? (
                          <ChevronDown size={16} className={isActiveRoute(item.path) ? 'text-white' : 'text-gray-400'} />
                        ) : (
                          <ChevronRight size={16} className={isActiveRoute(item.path) ? 'text-white' : 'text-gray-400'} />
                        )}
                      </div>
                    </button>
                    
                    {/* Submenu */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      openMenus[index] ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                    }`}>
                      <ul className="ml-11 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <NavLink
                              to={subItem.path}
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                  isActive
                                    ? 'bg-purple-100 text-purple-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`
                              }
                            >
                              {subItem.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <span className={({ isActive }) => isActive ? 'text-white' : 'text-gray-500'}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
            <LogOut size={18} className="text-gray-500 group-hover:text-red-600" />
            <span className="text-sm font-medium">Logout</span>
          </button>
          <p className="text-xs text-center text-gray-400 mt-2">Version 2.0.0</p>
        </div>
      </div>
    </>
  );
};

export default DeputyPrincipalSidebar;