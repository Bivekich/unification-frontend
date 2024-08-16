import React, { useState, useEffect } from "react";
import {
  internalTransfer,
  cashTransfer,
  customTransfer,
  replenishTransfer,
  getFinances,
} from "../../api";
import { Company, Bank } from "../../types";
import InternalTransferForm from "../../components/InternalTransferForm";
import CashTransferForm from "../../components/CashTransferForm";
import CustomTransferForm from "../../components/CustomTransferForm";
import ReplenishTransferForm from "../../components/ReplenishTransferForm";

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
    author?: string;
  }>({
    fromCompany: "",
    fromBankName: "",
    toCompany: "",
    toBankName: "",
    amount: 0,
    description: "",
    author: localStorage.getItem("username") || "",
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [fromBanks, setFromBanks] = useState<Bank[]>([]);
  const [toBanks, setToBanks] = useState<Bank[]>([]);

  // Состояние для управления видимостью модального окна
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSubmit = () => {
    handleShowModal();
  };

  const confirmTransfer = async () => {
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
      handleCloseModal();
    } catch (error) {
      alert("Ошибка при выполнении перевода");
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getFinances();
        setCompanies(response.data);
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

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Переводы</h1>
      <div className="form-group">
        <label htmlFor="transferType">Тип перевода</label>
        <select
          className="form-control"
          id="transferType"
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

      {transferType === "internal" && (
        <InternalTransferForm
          data={data}
          companies={companies}
          fromBanks={fromBanks}
          toBanks={toBanks}
          handleChange={handleChange}
        />
      )}

      {transferType === "cash" && (
        <CashTransferForm
          data={data}
          companies={companies}
          fromBanks={fromBanks}
          handleChange={handleChange}
        />
      )}

      {transferType === "custom" && (
        <CustomTransferForm
          data={data}
          companies={companies}
          toBanks={toBanks}
          handleChange={handleChange}
        />
      )}

      {transferType === "replenish" && (
        <ReplenishTransferForm
          data={data}
          companies={companies}
          toBanks={toBanks}
          handleChange={handleChange}
        />
      )}

      <div className="form-group mb-4">
        <label htmlFor="amount">Сумма</label>
        <input
          className="form-control"
          type="number"
          id="amount"
          name="amount"
          value={data.amount}
          onChange={handleChange}
        />
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Отправить
      </button>

      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        id="confirmationModal"
        tabIndex={-1}
        aria-labelledby="confirmationModalLabel"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmationModalLabel">
                Подтверждение перевода
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Тип перевода:</strong> {transferType}
              </p>
              <p>
                <strong>Из компании:</strong> {data.fromCompany}
              </p>
              <p>
                <strong>Из банка:</strong> {data.fromBankName}
              </p>
              <p>
                <strong>В компанию:</strong> {data.toCompany}
              </p>
              <p>
                <strong>В банк:</strong> {data.toBankName}
              </p>
              <p>
                <strong>Сумма:</strong> {data.amount}₽
              </p>
              <p>
                <strong>Описание:</strong> {data.description}
              </p>
              <p>
                <strong>Автор:</strong> {data.author}
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Отмена
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmTransfer}
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Transfers;
