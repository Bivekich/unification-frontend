import React, { useState, useEffect } from 'react';
import { getFinances, getRecentTransfers } from '../../api';
import styles from './Finances.module.scss';

interface Bank {
  name: string;
  balance: number;
}

interface Company {
  name: string;
  banks: Bank[];
}

interface Transfer {
  _id: string;
  amount: number;
  date: string;
  fromBank: string;
  toBank: string;
  fromCompany: string;
  toCompany: string;
  type: TransferType;
}

type TransferType = 'cash' | 'internal' | 'custom';

const Finances: React.FC = () => {
  const [finances, setFinances] = useState<Company[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const financesResponse = await getFinances();
        setFinances(financesResponse.data);

        const transfersResponse = await getRecentTransfers();

        if (Array.isArray(transfersResponse.data)) {
          setTransfers(transfersResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const transferTypes: Record<TransferType, string> = {
    cash: 'Вывод наличных',
    internal: 'Внутренний перевод',
    custom: 'Произвольный перевод',
  };

  return (
    <div className={styles.container}>
      <h1>Финансы</h1>

      <section>
        <h2>Информация о компаниях</h2>
        {finances.map((company) => (
          <div key={company.name}>
            <h3>{company.name}</h3>
            {company.banks.map((bank) => (
              <p key={bank.name}>
                {bank.name}: {bank.balance}₽
              </p>
            ))}
          </div>
        ))}
      </section>

      <section>
        <h2>Последние платежи (за 30 дней)</h2>
        {transfers.length === 0 ? (
          <p>Нет переводов за последние 30 дней.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Из компании</th>
                <th>Из банка</th>
                <th>В компанию</th>
                <th>В банк</th>
                <th>Сумма</th>
                <th>Тип</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer._id}>
                  <td>{formatDate(transfer.date)}</td>
                  <td>{transfer.fromCompany}</td>
                  <td>{transfer.fromBank}</td>
                  <td>{transfer.toCompany}</td>
                  <td>{transfer.toBank}</td>
                  <td>{transfer.amount}₽</td>
                  <td>{transferTypes[transfer.type] || transfer.type}</td>
                  <td>{transfer._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Finances;
