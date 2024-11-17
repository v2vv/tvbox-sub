import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const EditAccountModal = ({ isOpen, onClose, account, onUpdate }) => {

  const cloudFlareToken = localStorage.getItem('cloudflareToken');

  const [formData, setFormData] = useState({
    name: '',
    type: '夸克网盘',
    cookie: '',
    fileId: '',
    isMain: false
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        type: account.type || '夸克网盘',
        cookie: account.cookie || '',
        fileId: account.fileId || '',
        isMain: account.isMain || false
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
  }, [account]);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Prepare the form data and the payload
  const payload = { 
    ...formData, 
    id: account?.id,
    path: `/😊我的${formData.type}/${formData.name}`
  };
  
  // Define the API request options
  const options = {
    method: 'PUT', // Use PUT for updating, or POST if adding a new entry
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cloudFlareToken}`, // Replace with actual token
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/account_id/storage/kv/namespaces/namespace_id/values/account_key', options);
    const responseData = await response.json();
    
    if (response.ok) {
      onUpdate(responseData); // Update parent component with response data
      onClose(); // Close the modal after the update is successful
    } else {
      console.error('Error updating account:', responseData);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {account ? `更新网盘账号 - ${account.name}` : '新增网盘账号'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
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
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {account ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccountModal;