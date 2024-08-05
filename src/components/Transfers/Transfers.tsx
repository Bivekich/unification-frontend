import React, { useState, useEffect } from "react";
import styles from "./Transfers.module.scss";
import {
  internalTransfer,
  cashTransfer,
  customTransfer,
  replenishTransfer,
  getFinances,
} from "../../api";
import { Company, Bank } from "../../types";

const Transfers: React.FC = () => {
  const [transferType, setTransferType] = useState<
    "internal" | "cash" | "custom" | "replenish"
  >("internal");
  const [data, setData] = useState<{
    fromCompany: string;
    fromBankName?: string;
    toCompany: string;
    toBankName?: string;
    amount: number;
    description?: string;
  }>({
    fromCompany: "",
    fromBankName: "",
    toCompany: "",
    toBankName: "",
    amount: 0,
    description: "",
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [fromBanks, setFromBanks] = useState<Bank[]>([]);
  const [toBanks, setToBanks] = useState<Bank[]>([]);
  const [toCompanies, setToCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getFinances();
        setCompanies(response.data);
        setToCompanies(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных о компаниях:", error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const selectedCompany = companies.find(
      (company) => company.name === data.fromCompany
    );
    if (selectedCompany) {
      setFromBanks(selectedCompany.banks);
    } else {
      setFromBanks([]);
    }
  }, [data.fromCompany, companies]);

  useEffect(() => {
    const selectedCompany = companies.find(
      (company) => company.name === data.toCompany
    );
    if (selectedCompany) {
      setToBanks(selectedCompany.banks);
    } else {
      setToBanks([]);
    }
  }, [data.toCompany, companies]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (transferType === "internal") {
        await internalTransfer(data);
      } else if (transferType === "cash") {
        await cashTransfer(data);
      } else if (transferType === "custom") {
        await customTransfer(data);
      } else if (transferType === "replenish") {
        await replenishTransfer(data);
      }
      alert("Перевод выполнен успешно");
    } catch (error) {
      alert("Ошибка при выполнении перевода");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Переводы</h1>
      <div className={styles.formGroup}>
        <select
          value={transferType}
          onChange={(e) =>
            setTransferType(
              e.target.value as "internal" | "cash" | "custom" | "replenish"
            )
          }
        >
          <option value="internal">Внутренний перевод</option>
          <option value="cash">Вывод наличных</option>
          <option value="custom">Произвольный перевод</option>
          <option value="replenish">Пополнение</option>
        </select>
      </div>

      {(transferType === "internal" ||
        transferType === "cash" ||
        transferType === "custom") && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fromCompany">
              От компании
            </label>
            <select
              className={styles.input}
              id="fromCompany"
              name="fromCompany"
              value={data.fromCompany}
              onChange={handleChange}
            >
              <option value="">Выберите компанию</option>
              {companies.map((company) => (
                <option key={company.name} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fromBankName">
              Из банка
            </label>
            <select
              className={styles.input}
              id="fromBankName"
              name="fromBankName"
              value={data.fromBankName || ""}
              onChange={handleChange}
            >
              <option value="">Выберите банк</option>
              {fromBanks.map((bank) => (
                <option key={bank.name} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {transferType === "internal" && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="toCompany">
              В компанию
            </label>
            <select
              className={styles.input}
              id="toCompany"
              name="toCompany"
              value={data.toCompany || ""}
              onChange={handleChange}
            >
              <option value="">Выберите компанию</option>
              {toCompanies.map((company) => (
                <option key={company.name} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="toBankName">
              В банк
            </label>
            <select
              className={styles.input}
              id="toBankName"
              name="toBankName"
              value={data.toBankName || ""}
              onChange={handleChange}
            >
              <option value="">Выберите банк</option>
              {toBanks.map((bank) => (
                <option key={bank.name} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {transferType === "custom" && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="toCompany">
              В компанию
            </label>
            <input
              className={styles.input}
              type="text"
              id="toCompany"
              name="toCompany"
              value={data.toCompany || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="toBankName">
              В банк
            </label>
            <input
              className={styles.input}
              type="text"
              id="toBankName"
              name="toBankName"
              value={data.toBankName || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="description">
              Описание
            </label>
            <input
              className={styles.input}
              type="text"
              id="description"
              name="description"
              value={data.description || ""}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      {transferType === "replenish" && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fromCompany">
              Из компании
            </label>
            <input
              className={styles.input}
              type="text"
              id="fromCompany"
              name="fromCompany"
              value={data.fromCompany || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fromBankName">
              Из банка
            </label>
            <input
              className={styles.input}
              type="text"
              id="fromBankName"
              name="fromBankName"
              value={data.fromBankName || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="description">
              Описание
            </label>
            <input
              className={styles.input}
              type="text"
              id="description"
              name="description"
              value={data.description || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="toCompany">
              В компанию
            </label>
            <select
              className={styles.input}
              id="toCompany"
              name="toCompany"
              value={data.toCompany || ""}
              onChange={handleChange}
            >
              <option value="">Выберите компанию</option>
              {toCompanies.map((company) => (
                <option key={company.name} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="toBankName">
              В банк
            </label>
            <select
              className={styles.input}
              id="toBankName"
              name="toBankName"
              value={data.toBankName || ""}
              onChange={handleChange}
            >
              <option value="">Выберите банк</option>
              {toBanks.map((bank) => (
                <option key={bank.name} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="amount">
          Сумма
        </label>
        <input
          className={styles.input}
          type="number"
          id="amount"
          name="amount"
          value={data.amount}
          onChange={handleChange}
        />
      </div>
      <button className={styles.button} onClick={handleSubmit}>
        Отправить
      </button>
    </div>
  );
};

export default Transfers;
