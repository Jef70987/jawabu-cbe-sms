import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrincipalSidebarData } from '../SidebarData/PrincipalSidebarData';
import { useAuth } from '../components/Authentication/AuthContext';

function PrincipalSidebar({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setOpenDropdown(null);
    }
  };

  const handleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setIsCollapsed(true);
      setOpenDropdown(null);
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-700 to-green-800 shadow-md z-50 lg:hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <button 
              onClick={toggleSidebar}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <img 
                  src="/logo.jpeg" 
                  alt="Logo" 
                  className="w-8 h-8 rounded-lg object-cover border border-white/30 shadow-lg"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full animate-pulse"></span>
              </div>
              <div className="flex flex-col leading-tight">
                <h1 className="text-white font-bold text-sm leading-tight">JAWABU</h1>
                <h2 className="text-white text-[10px] font-semibold leading-tight">Principal Portal</h2>
              </div>
            </button>
            <div className="text-right">
              <p className="text-white text-xs font-semibold">{user?.username || 'User'}</p>
              <p className="text-green-200 text-[10px] font-medium">{user?.role || 'Principal'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-green-800 to-green-700 shadow-lg z-50 lg:hidden">
          <div className="flex items-center h-12 px-2 overflow-x-auto">
            <div className="flex justify-around gap-1">
              {PrincipalSidebarData.slice(0, 15).map((val, key) => (
                <button
                  key={key}
                  onClick={() => handleNavigation(val.link)}
                  className={`
                    flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-all duration-300 min-w-[60px]
                    ${window.location.pathname === val.link 
                      ? 'text-white bg-green-600/50' 
                      : 'text-green-100 hover:text-white hover:bg-green-600/30'
                    }
                  `}
                >
                  <div className="text-base mb-0.5">{val.icon}</div>
                  <span className="text-[9px] font-semibold whitespace-nowrap">{val.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={isMobile ? "pt-12 pb-12" : ""}>
        {children}
      </div>

      {/* Desktop Toggle Button */}
      {!isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-xl border-2 border-green-400/50 transition-all duration-300 hover:scale-110 hover:rotate-12 z-50"
          aria-label="Toggle sidebar"
        >
          <svg 
            className="w-5 h-5"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`
          h-screen bg-green-900 shadow-2xl border-r-0 transition-all duration-500 ease-in-out z-50
          fixed lg:relative top-0 left-0
          overflow-hidden flex flex-col
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isCollapsed && isMobile ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Decorative Element */}
        <div className="absolute right-0 top-0 h-32 w-32 bg-white/5" 
             style={{ 
               clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
               opacity: '0.2'
             }}>
        </div>

        {/* Header Section */}
        <div className="relative z-10">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
          
          <div className={`
            flex items-center p-5 border-b border-red-700 bg-green-900 backdrop-blur-sm
            ${isCollapsed ? 'justify-center' : 'justify-between'}
          `}>
            <div className={`flex items-center ${isCollapsed ? 'flex-col' : 'space-x-4'}`}>
              <div className="relative group">
                <img 
                  src="/logo.jpeg" 
                  alt="Logo" 
                  className={`
                    relative rounded-xl object-cover border-2 border-white/40 shadow-2xl
                    ${isCollapsed ? 'w-12 h-12' : 'w-14 h-14'}
                  `}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col">
                  <h1 className="text-white font-bold text-lg leading-tight">JAWABU</h1>
                  <h2 className="text-white text-xs font-semibold">PRINCIPAL PORTAL</h2>
                  <p className="text-sm font-extrabold text-white truncate">{user?.username || 'User'} | {user?.role || 'Principal'}</p>
                </div>
              )}
            </div>

            {/* Desktop Toggle Button inside sidebar */}
            {!isMobile && (
              <button 
                onClick={toggleSidebar}
                className={`
                  bg-green-600/50 hover:bg-green-600 backdrop-blur-sm text-white rounded-full p-2 
                  shadow-lg border-2 border-green-400/40 transition-all duration-300 hover:scale-110 hover:rotate-180
                  ${isCollapsed ? 'absolute -right-3 top-5' : ''}
                `}
                aria-label="Toggle sidebar"
              >
                <svg 
                  className="w-4 h-4"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="relative z-10 flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-2">
            {PrincipalSidebarData.map((val, key) => (
              <li key={key}>
                <div
                  className={`
                    flex items-center w-full p-3 rounded-xl cursor-pointer transition-all duration-300 group
                    relative overflow-hidden text-white hover:bg-green-700/50
                    ${window.location.pathname === val.path ? 'bg-green-600' : ''}
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  onClick={() => {
                    if (val.submenu) {
                      handleDropdown(key);
                    } else {
                      handleNavigation(val.path);
                    }
                  }}
                >
                  <div className="flex-shrink-0 transition-all duration-300">
                    <div className={isCollapsed ? 'text-2xl' : 'text-xl'}>
                      {val.icon}
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="ml-3 flex-1 flex items-center justify-between">
                      <span className="font-bold whitespace-nowrap">{val.title}</span>
                      {val.badge && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full ml-2">
                          {val.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Badge when collapsed */}
                  {isCollapsed && val.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      {val.badge}
                    </span>
                  )}

                  {/* Dropdown Arrow */}
                  {!isCollapsed && val.submenu && (
                    <svg 
                      className={`w-4 h-4 ml-auto transition-all duration-300 ${openDropdown === key ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>

                {/* Sub Navigation */}
                {!isCollapsed && val.submenu && openDropdown === key && (
                  <ul className="ml-8 mt-2 space-y-1 animate-slideDown">
                    {val.submenu.map((subVal, subKey) => (
                      <li key={subKey}>
                        <div
                          className={`
                            flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-300
                            text-white/80 hover:text-white hover:bg-green-700/50
                            ${window.location.pathname === subVal.path ? 'bg-green-600/80' : ''}
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigation(subVal.path);
                          }}
                        >
                          <span className="ml-2 text-sm font-semibold">{subVal.title}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={`
          relative z-10 border-t border-green-700/30 p-4 bg-green-800/30 backdrop-blur-md
          ${isCollapsed ? 'text-center' : ''}
        `}>
          <div className={`text-white/80 transition-all duration-300 ${isCollapsed ? 'text-xs' : 'text-sm'}`}>
            {!isCollapsed ? (
              <div>
                <p className="font-bold">© {new Date().getFullYear()} jawabu</p>
                <p className="text-xs text-green-300 font-semibold">powered by syntelsafe</p>
              </div>
            ) : (
              <span className="text-xs font-bold text-green-300">©{new Date().getFullYear()}</span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default PrincipalSidebar;