import React, { useState } from 'react';
import NetworkDriveTable from './NetworkDriveTable';
import Setting from './Setting';

const NavigationBar = () => {
  const [currentView, setCurrentView] = useState('home');

  const renderContent = () => {
    switch (currentView) {
      case 'account':
        return <NetworkDriveTable />;
      case 'config':
        return <Setting />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left side navigation items */}
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => setCurrentView('home')}
                className={`text-gray-600 hover:text-blue-500 ${currentView === 'home' ? 'text-blue-500' : ''}`}
              >
                首页
              </button>
              <button 
                onClick={() => setCurrentView('site')}
                className={`text-gray-600 hover:text-blue-500 ${currentView === 'site' ? 'text-blue-500' : ''}`}
              >
                站点
              </button>
              <button 
                onClick={() => setCurrentView('account')}
                className={`text-gray-600 hover:text-blue-500 ${currentView === 'account' ? 'text-blue-500' : ''}`}
              >
                账号
              </button>
              <button 
                onClick={() => setCurrentView('subscribe')}
                className={`text-gray-600 hover:text-blue-500 ${currentView === 'subscribe' ? 'text-blue-500' : ''}`}
              >
                订阅
              </button>
              <button 
                onClick={() => setCurrentView('config')}
                className={`text-gray-600 hover:text-blue-500 ${currentView === 'config' ? 'text-blue-500' : ''}`}
              >
                配置
              </button>
              <button 
                onClick={() => setCurrentView('log')}
                className={`text-gray-600 hover:text-blue-500 ${currentView === 'log' ? 'text-blue-500' : ''}`}
              >
                日志
              </button>
              <button 
                onClick={() => setCurrentView('about')}
                className={`text-gray-600 hover:text-blue-500 ${currentView === 'about' ? 'text-blue-500' : ''}`}
              >
                关于
              </button>
            </div>

            {/* Center - Theme Toggle */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">简单模式</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>

            {/* Right side - Admin dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                <span>admin</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-50">
        {renderContent()}
      </div>
    </div>
  );
};

export default NavigationBar;