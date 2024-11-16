import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, RefreshCw, Plus, X } from 'lucide-react';

const NetworkDriveTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '夸克网盘',
    cookie: '',
    fileId: '',
    isMain: false
  });

  // 从本地存储读取账号数据
  const loadAccounts = () => {
    try {
      const data = localStorage.getItem('networkDriveAccounts');
      return data ? JSON.parse(data) : [
        { 
          id: 4001, 
          type: 'UC网盘', 
          name: 'uc', 
          cookie: '',
          fileId: '',
          isMain: true 
        },
        { 
          id: 4002, 
          type: '夸克网盘', 
          name: 'kuqke', 
          cookie: '',
          fileId: '',
          isMain: true 
        }
      ];
    } catch (error) {
      console.error('Error loading accounts:', error);
      return [];
    }
  };

  // 保存账号数据到本地存储
  const saveAccounts = (accounts) => {
    try {
      localStorage.setItem('networkDriveAccounts', JSON.stringify(accounts));
      return true;
    } catch (error) {
      console.error('Error saving accounts:', error);
      return false;
    }
  };

  // 初始加载数据
  useEffect(() => {
    const loadedAccounts = loadAccounts();
    setAccounts(loadedAccounts);
  }, []);

  // 当编辑账号改变时更新表单数据
  useEffect(() => {
    if (editingAccount) {
      setFormData({
        name: editingAccount.name || '',
        type: editingAccount.type || '夸克网盘',
        cookie: editingAccount.cookie || '',
        fileId: editingAccount.fileId || '',
        isMain: editingAccount.isMain || false
      });
    } else {
      setFormData({
        name: '',
        type: '夸克网盘',
        cookie: '',
        fileId: '',
        isMain: false
      });
    }
  }, [editingAccount]);

  const handleEdit = (account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedAccount = { 
      ...formData, 
      id: editingAccount?.id,
      path: `/😊我的${formData.type}/${formData.name}` 
    };

    let newAccounts;
    if (editingAccount) {
      newAccounts = accounts.map(acc => 
        acc.id === updatedAccount.id ? updatedAccount : acc
      );
    } else {
      const newId = Math.max(...accounts.map(a => a.id), 0) + 1;
      newAccounts = [...accounts, { ...updatedAccount, id: newId }];
    }
    saveAccounts(newAccounts);
    setAccounts(newAccounts);
    handleModalClose();
  };

  const handleDelete = (id) => {
    const newAccounts = accounts.filter(account => account.id !== id);
    saveAccounts(newAccounts);
    setAccounts(newAccounts);
  };

  const handleAdd = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleRefresh = () => {
    const loadedAccounts = loadAccounts();
    setAccounts(loadedAccounts);
  };

  return (
    <>
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">网盘账号列表</h1>
          <div className="space-x-2">
            <button 
              className="px-3 py-1 text-gray-600 border rounded hover:bg-gray-50"
              onClick={handleRefresh}
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
                  <td className="px-6 py-4 text-sm text-gray-900">{`/😊我的${account.type}/${account.name}`}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {account.isMain ? '✓' : ''}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex gap-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(account)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingAccount ? `更新网盘账号 - ${editingAccount.name}` : '新增网盘账号'}
              </h2>
              <button 
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-4">
              <div className="space-y-4">
                {/* 名称输入 */}
                <div>
                  <label className="block mb-1">
                    <span className="text-red-500">*</span> 名称
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* 类型选择 */}
                <div>
                  <label className="block mb-1">
                    <span className="text-red-500">*</span> 类型
                  </label>
                  <div className="space-x-4">
                    {['夸克网盘', 'UC网盘', '115网盘'].map(type => (
                      <label key={type} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={formData.type === type}
                          onChange={e => setFormData({ ...formData, type: e.target.value })}
                          className="form-radio text-blue-500"
                        />
                        <span className="ml-2">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cookie输入 */}
                <div>
                  <label className="block mb-1">
                    <span className="text-red-500">*</span> Cookie
                  </label>
                  <textarea
                    value={formData.cookie}
                    onChange={e => setFormData({ ...formData, cookie: e.target.value })}
                    className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* 文件夹ID输入 */}
                <div>
                  <label className="block mb-1">文件夹ID</label>
                  <input
                    type="text"
                    value={formData.fileId}
                    onChange={e => setFormData({ ...formData, fileId: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* 主账号开关 */}
                <div className="flex items-center space-x-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isMain}
                      onChange={e => setFormData({ ...formData, isMain: e.target.checked })}
                      className="form-checkbox text-blue-500"
                    />
                    <span className="ml-2">主账号</span>
                  </label>
                  <span className="text-gray-500 text-sm">主账号用来获取分享。</span>
                </div>

                <div className="text-gray-500">
                  完整路径：/😊我的{formData.type}/{formData.name}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingAccount ? '更新' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NetworkDriveTable;