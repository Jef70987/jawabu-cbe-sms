import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PrincipalSidebarData } from '../SidebarData/PrincipalSidebarData';
import { 
  ChevronDown, 
  ChevronRight, 
  LogOut, 
  User, 
  Menu, 
  X,
  Settings,
  Bell,
  HelpCircle,
  Shield
} from 'lucide-react';

const PrincipalSidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize open menus based on current path
  useEffect(() => {
    const newOpenMenus = {};
    PrincipalSidebarData.forEach((item, index) => {
      if (item.submenu && item.submenu.some(subItem => location.pathname.startsWith(subItem.path))) {
        newOpenMenus[index] = true;
      }
    });
    setOpenMenus(newOpenMenus);
  }, [location.pathname]);

  const toggleSubmenu = (index) => {
    setOpenMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    // Clear user data, tokens, etc.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col
        transition-all duration-500 ease-in-out z-50 shadow-xl
        w-72
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* School Logo/Header with Gradient */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-inner border border-white/30">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">Principal Portal</h2>
              <p className="text-xs text-blue-100">Springfield High School</p>
            </div>
          </div>
        </div>

        {/* Profile Section with Glass Effect */}
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="flex items-center space-x-4 relative">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-semibold text-xl shadow-md transform transition-transform hover:scale-105">
                JS
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Dr. John Smith</p>
              <p className="text-xs text-gray-600 flex items-center">
                <Shield size={12} className="mr-1" /> Principal
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center text-[10px] text-gray-500 bg-white/50 px-2 py-0.5 rounded-full">
                  <span>Last login: Today 8:30 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation with improved scrolling */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <ul className="space-y-1 px-3">
            {PrincipalSidebarData.map((item, index) => (
              <li key={index} className="relative">
                {item.submenu ? (
                  <div className="mb-1">
                    <button
                      onClick={() => toggleSubmenu(index)}
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                        isActiveRoute(item.path)
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      } ${hoveredItem === index && !isActiveRoute(item.path) ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`transition-colors duration-200 ${
                          isActiveRoute(item.path) 
                            ? 'text-white' 
                            : 'text-gray-500 group-hover:text-blue-600'
                        }`}>
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                            {item.badge}
                          </span>
                        )}
                        {openMenus[index] ? (
                          <ChevronDown size={16} className={`transition-transform duration-300 ${
                            isActiveRoute(item.path) ? 'text-white' : 'text-gray-400'
                          }`} />
                        ) : (
                          <ChevronRight size={16} className={`transition-transform duration-300 ${
                            isActiveRoute(item.path) ? 'text-white' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                    </button>
                    
                    {/* Submenu with animation */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openMenus[index] ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                    }`}>
                      <ul className="ml-11 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <NavLink
                              to={subItem.path}
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                `block px-4 py-2.5 text-sm rounded-lg transition-all duration-200 relative group ${
                                  isActive
                                    ? 'text-blue-600 font-medium bg-blue-50 border-l-4 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:pl-6'
                                }`
                              }
                            >
                              <span className="relative z-10">{subItem.title}</span>
                              <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></span>
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
                      `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <span className={({ isActive }) => 
                        `transition-colors duration-200 ${
                          isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                        }`
                      }>
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer with Logout and Quick Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
          {/* Quick Action Buttons */}
          <div className="flex justify-around mb-3">
            <button 
              onClick={() => handleNavigation('/principal/notifications')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors relative group"
              title="Notifications"
            >
              <Bell size={18} className="text-gray-600 group-hover:text-blue-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">3</span>
            </button>
            <button 
              onClick={() => handleNavigation('/principal/settings')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
              title="Settings"
            >
              <Settings size={18} className="text-gray-600 group-hover:text-blue-600" />
            </button>
            <button 
              onClick={() => window.open('/help', '_blank')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
              title="Help"
            >
              <HelpCircle size={18} className="text-gray-600 group-hover:text-blue-600" />
            </button>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <LogOut size={18} className="text-gray-500 group-hover:text-red-600 transition-colors duration-200 relative z-10" />
            <span className="text-sm font-medium relative z-10">Logout</span>
          </button>
          
          <p className="text-[10px] text-center text-gray-400 mt-2">Version 2.1.0 • Principal Portal</p>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(45deg, #00000010 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </>
  );
};

export default PrincipalSidebar;