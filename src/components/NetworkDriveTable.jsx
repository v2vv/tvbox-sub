import React, { useState, useEffect } from "react";
import { Pencil, Trash2, RefreshCw, Plus, X } from "lucide-react";
import EditAccountModal from "./EditAccountModal.jsx";

const NetworkDriveTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "夸克网盘",
    cookie: "",
    fileId: "",
    isMain: false,
  });
  const saveServerUrl = localStorage.getItem("saveServerUrl");
  const saveServerPath = "/token";

  // 从本地存储读取账号数据
  const loadAccounts = async () => {
    try {
      var data = "";
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(
          `${saveServerUrl}${saveServerPath}`,
          options
        );
        const responseData = await response.json();

        if (response.ok) {
          data = responseData;
        } else {
          console.error("Error updating account:", responseData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
      console.log(data);

      return data
        ? data
        : [
            {
              id: 4001,
              type: "UC网盘",
              name: "uc",
              cookie: "",
              fileId: "",
              isMain: true,
            },
            {
              id: 4002,
              type: "夸克网盘",
              name: "kuqke",
              cookie: "",
              fileId: "",
              isMain: true,
            },
          ];
    } catch (error) {
      console.error("Error loading accounts:", error);
      return [];
    }
  };

  // 检查主账号是否已存在
  const checkMainAccountExists = (type, currentId = null) => {
    return accounts.some(
      (account) =>
        account.type === type && account.isMain && account.id !== currentId
    );
  };

  // 保存账号数据到本地存储
  const saveAccounts = async (accounts) => {
    // 使用 filter 方法找出 isMain 为 true 的账号
    const mainAccounts = accounts.filter((account) => account.isMain);
    console.log(mainAccounts);
    const accountsData = {
      method: "add",
      data: accounts,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accountsData),
    };

    try {
      const response = await fetch(
        `${saveServerUrl}${saveServerPath}`,
        options
      );
      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error updating account:", responseData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // 初始加载数据
  useEffect(() => {
    const fetchAccounts = async () => {
      const loadedAccounts = await loadAccounts();
      console.log(loadedAccounts);
      setAccounts(loadedAccounts);
    };

    fetchAccounts();
  }, []);

  // 当编辑账号改变时更新表单数据
  useEffect(() => {
    if (editingAccount) {
      setFormData({
        name: editingAccount.name || "",
        type: editingAccount.type || "夸克网盘",
        cookie: editingAccount.cookie || "",
        fileId: editingAccount.fileId || "",
        isMain: editingAccount.isMain || false,
      });
    } else {
      setFormData({
        name: "",
        type: "夸克网盘",
        cookie: "",
        fileId: "",
        isMain: false,
      });
    }
  }, [editingAccount]);

  const handleEdit = (account) => {
    setError("");
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleUpdate = (formData) => {
    // 检查是否已存在该类型的主账号
    if (
      formData.isMain &&
      checkMainAccountExists(formData.type, editingAccount?.id)
    ) {
      setError(`${formData.type}已存在主账号，每个网盘类型只能设置一个主账号`);
      return;
    }

    const updatedAccount = {
      ...formData,
      id: editingAccount?.id,
      path: `/😊我的${formData.type}/${formData.name}`,
    };

    let newAccounts;
    if (editingAccount) {
      newAccounts = accounts.map((acc) =>
        acc.id === updatedAccount.id ? updatedAccount : acc
      );
    } else {
      const newId = Math.max(...accounts.map((a) => a.id), 0) + 1;
      newAccounts = [...accounts, { ...updatedAccount, id: newId }];
    }

    saveAccounts(newAccounts);
    setAccounts(newAccounts);
    setError("");
    handleModalClose();
  };

  const handleDelete = (id) => {
    const newAccounts = accounts.filter((account) => account.id !== id);
    saveAccounts(newAccounts);
    setAccounts(newAccounts);
  };

  const handleAdd = () => {
    setError("");
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
    setError("");
  };

  const handleRefresh = async () => {
    const loadedAccounts = await loadAccounts();
    console.log(loadedAccounts);
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  名称
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  路径
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  主账号?
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {account.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {account.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {account.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{`/😊我的${account.type}/${account.name}`}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {account.isMain ? "✓" : ""}
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
        <EditAccountModal
          isOpen={true}
          onClose={handleModalClose}
          account={editingAccount}
          onUpdate={handleUpdate}
          error={error}
        />
      )}
    </>
  );
};

export default NetworkDriveTable;
