import React, { useState, useEffect } from "react";
import { getFinances, getRecentTransfers } from "../../api";

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
  author: string;
}

type TransferType = "cash" | "internal" | "custom" | "replenish";

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
        console.error("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const calculateTotalBalance = () => {
    return finances.reduce((total, company) => {
      return (
        total +
        company.banks.reduce((bankTotal, bank) => {
          return bankTotal + bank.balance;
        }, 0)
      );
    }, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  const transferTypes: Record<TransferType, string> = {
    cash: "Вывод наличных",
    internal: "Внутренний перевод",
    custom: "Произвольный перевод",
    replenish: "Пополнение",
  };

  const sortedTransfers = transfers
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const roundToTwoDecimalPlaces = (number: number): number => {
    return Math.round(number * 100) / 100;
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Финансы</h1>

      <section className="mb-4">
        <h2>Общий баланс</h2>
        <p>
          Общая сумма баланса на всех банках всех компаний:{" "}
          <strong>{roundToTwoDecimalPlaces(calculateTotalBalance())}₽</strong>
        </p>
      </section>

      <section className="mb-4">
        <h2>Информация о компаниях</h2>
        {finances.map((company) => (
          <div key={company.name} className="mb-3">
            <h3>{company.name}</h3>
            {company.banks.map((bank) => (
              <p key={bank.name}>
                {bank.name}:{" "}
                <strong>{roundToTwoDecimalPlaces(bank.balance)}₽</strong>
              </p>
            ))}
          </div>
        ))}
      </section>

      <section className="mb-4">
        <h2>Платежи (за последние 30 дней)</h2>
        {sortedTransfers.length === 0 ? (
          <p>Нет переводов за последние 30 дней.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Автор</th>
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
                {sortedTransfers.map((transfer) => (
                  <tr key={transfer._id}>
                    <td>{formatDate(transfer.date)}</td>
                    <td>{transfer.author || "Не указан"}</td>
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
          </div>
        )}
      </section>
    </div>
  );
};

export default Finances;
