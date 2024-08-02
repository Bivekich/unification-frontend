import React, { useState } from 'react';
import { addCompany, addUser } from '../../api';
import { Company, User, UserRole } from '../../types';
import styles from './AdminPanel.module.scss';

const AdminPanel: React.FC = () => {
  const [companyData, setCompanyData] = useState<Company>({
    name: '',
    banks: [{ name: '', balance: 0 }],
  });

  const [userData, setUserData] = useState<User>({
    username: '',
    password: '',
    role: 'user',
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
      [name]: name === 'balance' ? parseFloat(value) : value,
    };
    setCompanyData((prevData) => ({ ...prevData, banks: updatedBanks }));
  };

  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'role') {
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
      banks: [...prevData.banks, { name: '', balance: 0 }],
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
      alert('Company added successfully');
      setCompanyData({ name: '', banks: [{ name: '', balance: 0 }] });
    } catch (error) {
      alert('Error adding company');
    }
  };

  const handleAddUser = async () => {
    try {
      await addUser(userData);
      alert('User added successfully');
      setUserData({ username: '', password: '', role: 'user' });
    } catch (error) {
      alert('Error adding user');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Панель администратора</h1>

      <h2>Добавить компанию</h2>
      <input
        type="text"
        name="name"
        value={companyData.name}
        onChange={handleCompanyChange}
        placeholder="Название компании"
      />
      {companyData.banks.map((bank, index) => (
        <div key={index} className={styles['bank-section']}>
          <input
            type="text"
            name="name"
            value={bank.name}
            onChange={(e) => handleBankChange(index, e)}
            placeholder={`Название банка ${index + 1}`}
          />
          <input
            type="number"
            name="balance"
            value={bank.balance}
            onChange={(e) => handleBankChange(index, e)}
            placeholder={`Баланс банка ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => removeBankField(index)}
            className={styles.remove}
          >
            Удалить банк
          </button>
        </div>
      ))}
      <button type="button" onClick={addBankField}>
        Добавить банк
      </button>
      <button onClick={handleAddCompany}>Добавить компанию</button>

      <h2>Добавить пользователя</h2>
      <input
        type="text"
        name="username"
        value={userData.username}
        onChange={handleUserChange}
        placeholder="Имя пользователя"
      />
      <input
        type="password"
        name="password"
        value={userData.password}
        onChange={handleUserChange}
        placeholder="Пароль"
      />
      <select name="role" value={userData.role} onChange={handleUserChange}>
        <option value="user">Пользователь</option>
        <option value="cashier">Кассир</option>
        <option value="admin">Администратор</option>
      </select>
      <button onClick={handleAddUser}>Добавить пользователя</button>
    </div>
  );
};

export default AdminPanel;
