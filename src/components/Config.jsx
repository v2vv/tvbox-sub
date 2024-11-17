import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const ConfigPage = () => {
  const [config, setConfig] = useState({
    token: '',
  });
  const [saveStatus, setSaveStatus] = useState('');

  // 从本地存储加载配置
  useEffect(() => {
    const loadedConfig = localStorage.getItem('cloudflareToken');
    if (loadedConfig) {
      setConfig(JSON.parse(loadedConfig));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      localStorage.setItem('cloudflareToken', JSON.stringify(config));
      setSaveStatus('success');
      
      // 3秒后清除状态消息
      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveStatus('error');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold">系统配置</h1>
        <p className="text-gray-500 mt-1">管理系统基本配置</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Token 配置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Token
              </label>
              <input
                type="password"
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入 API Token"
              />
              <p className="mt-1 text-sm text-gray-500">
                用于 Cloudflare Workers-kv-namespace API调用的认证Token
              </p>
            </div>

            {/* 保存按钮和状态提示 */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                {saveStatus === 'success' && (
                  <span className="text-green-600 text-sm">配置已保存</span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-red-600 text-sm">保存失败，请重试</span>
                )}
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Save className="w-4 h-4" />
                保存配置
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigPage;