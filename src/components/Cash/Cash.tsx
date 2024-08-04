import React, { useState, useEffect } from 'react';
import { CashOperation } from '../../types';
import {
  addCashOperation,
  getCashOperationsLast30Days,
  getCashBalance,
} from '../../api';
import styles from './Cash.module.scss';

const Cash: React.FC = () => {
  const [operations, setOperations] = useState<CashOperation[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const operationsResponse = await getCashOperationsLast30Days();
        setOperations(operationsResponse.data);

        const balanceResponse = await getCashBalance();
        setBalance(balanceResponse.data.balance);
      } catch (err) {
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addCashOperation({ amount, type, description });
      setAmount(0);
      setType('income');
      setDescription('');

      const operationsResponse = await getCashOperationsLast30Days();
      setOperations(operationsResponse.data);
      const balanceResponse = await getCashBalance();
      setBalance(balanceResponse.data.balance);
    } catch (error) {
      setError('Ошибка при добавлении операции');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Касса</h2>
      <p>Текущий баланс: {balance} руб.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label>
          Сумма:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>
        <label>
          Тип:
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'expense' | 'income')}
          >
            <option value="expense">Расход</option>
            <option value="income">Приход</option>
          </select>
        </label>
        <label>
          Назначение:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit">Добавить</button>
      </form>
      <h2>Платежи (за последние 30 дней)</h2>
      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.table_container}>
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Сумма</th>
                <th>Тип</th>
                <th>Описание</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op) => (
                <tr key={op._id}>
                  <td>{new Date(op.date).toLocaleDateString()}</td>
                  <td>{op.amount}</td>
                  <td>{op.type === 'income' ? 'Приход' : 'Расход'}</td>
                  <td>{op.description}</td>
                  <td>{op._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Cash;
