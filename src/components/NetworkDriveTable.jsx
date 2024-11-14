import React, { useState } from 'react';
import { Pencil, Trash2, RefreshCw, Plus } from 'lucide-react';

const NetworkDriveTable = () => {
  const [accounts, setAccounts] = useState([
    { id: 4001, type: 'UC网盘', name: 'uc', path: '/😊我的UC网盘/uc', isMain: true },
    { id: 4002, type: '夸克网盘', name: 'kuqke', path: '/😊我的夸克网盘/kuqke', isMain: true }
  ]);

  const handleDelete = (id) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const handleAdd = () => {
    const newId = Math.max(...accounts.map(a => a.id), 0) + 1;
    const newAccount = {
      id: newId,
      type: '',
      name: '',
      path: '',
      isMain: false
    };
    setAccounts([...accounts, newAccount]);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">网盘账号列表</h1>
        <div className="space-x-2">
          <button 
            className="px-3 py-1 text-gray-600 border rounded hover:bg-gray-50"
            onClick={() => setAccounts([...accounts])}
          >
            <div className="flex items-center gap-1">
              <RefreshCw className="w-4 h-4" />
              刷新
            </div>
          </button>
          <button 
            className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={handleAdd}
          >
            <div className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              添加
            </div>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">类型</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">名称</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">路径</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">主账号?</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{account.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{account.type}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{account.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{account.path}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {account.isMain ? '✓' : ''}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex gap-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => console.log('Edit', account.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(account.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NetworkDriveTable;