import React, { useState } from "react";
import { addCompany, addUser } from "../../api";
import { Company, User, UserRole } from "../../types";

const AdminPanel: React.FC = () => {
  const [companyData, setCompanyData] = useState<Company>({
    name: "",
    banks: [{ name: "", balance: 0 }],
  });

  const [userData, setUserData] = useState<User>({
    username: "",
    password: "",
    role: "user",
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBankChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedBanks = [...companyData.banks];
    updatedBanks[index] = {
      ...updatedBanks[index],
      [name]: name === "balance" ? parseFloat(value) : value,
    };
    setCompanyData((prevData) => ({ ...prevData, banks: updatedBanks }));
  };

  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "role") {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value as UserRole,
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const addBankField = () => {
    setCompanyData((prevData) => ({
      ...prevData,
      banks: [...prevData.banks, { name: "", balance: 0 }],
    }));
  };

  const removeBankField = (index: number) => {
    setCompanyData((prevData) => ({
      ...prevData,
      banks: prevData.banks.filter((_, i) => i !== index),
    }));
  };

  const handleAddCompany = async () => {
    try {
      await addCompany(companyData);
      alert("Company added successfully");
      setCompanyData({ name: "", banks: [{ name: "", balance: 0 }] });
    } catch (error) {
      alert("Error adding company");
    }
  };

  const handleAddUser = async () => {
    try {
      await addUser(userData);
      alert("User added successfully");
      setUserData({ username: "", password: "", role: "user" });
    } catch (error) {
      alert("Error adding user");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Панель администратора</h1>

      <h2 className="mb-3">Добавить компанию</h2>
      <div className="mb-3">
        <input
          type="text"
          name="name"
          className="form-control"
          value={companyData.name}
          onChange={handleCompanyChange}
          placeholder="Название компании"
        />
      </div>
      {companyData.banks.map((bank, index) => (
        <div key={index} className="mb-3 d-flex align-items-center">
          <div className="flex-grow-1 me-2">
            <input
              type="text"
              name="name"
              className="form-control"
              value={bank.name}
              onChange={(e) => handleBankChange(index, e)}
              placeholder={`Название банка ${index + 1}`}
            />
          </div>
          <div className="flex-grow-1 me-2">
            <input
              type="number"
              name="balance"
              className="form-control"
              value={bank.balance}
              onChange={(e) => handleBankChange(index, e)}
              placeholder={`Баланс банка ${index + 1}`}
            />
          </div>
          <button
            type="button"
            onClick={() => removeBankField(index)}
            className="btn btn-danger"
          >
            Удалить банк
          </button>
        </div>
      ))}
      <button type="button" onClick={addBankField} className="btn btn-primary">
        Добавить банк
      </button>
      <button onClick={handleAddCompany} className="btn btn-success">
        Добавить компанию
      </button>

      <h2 className="mt-4 mb-3">Добавить пользователя</h2>
      <div className="mb-3">
        <input
          type="text"
          name="username"
          className="form-control"
          value={userData.username}
          onChange={handleUserChange}
          placeholder="Имя пользователя"
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          name="password"
          className="form-control"
          value={userData.password}
          onChange={handleUserChange}
          placeholder="Пароль"
        />
      </div>
      <div className="mb-3">
        <select
          name="role"
          className="form-select"
          value={userData.role}
          onChange={handleUserChange}
        >
          <option value="user">Пользователь</option>
          <option value="cashier">Кассир</option>
          <option value="admin">Администратор</option>
        </select>
      </div>
      <button onClick={handleAddUser} className="btn btn-success">
        Добавить пользователя
      </button>
    </div>
  );
};

export default AdminPanel;
