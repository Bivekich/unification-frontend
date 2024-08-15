import React, { useState, useEffect } from "react";
import { CashOperation, Company, Bank } from "../../types";
import {
  addCashOperation,
  getCashOperationsLast30Days,
  getCashBalance,
  getFinances,
} from "../../api";

const Cash: React.FC = () => {
  const [operations, setOperations] = useState<CashOperation[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [description, setDescription] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [bank, setBank] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Состояние для управления видимостью модального окна
  const [showModal, setShowModal] = useState<boolean>(false);

  const author = localStorage.getItem("username") || "";

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);

  const [data, setData] = useState<{
    selected_company: string;
    bank: string;
    author?: string;
  }>({
    selected_company: "",
    bank: "",
    author: localStorage.getItem("username") || "",
  });

  const handleSubmit = async () => {
    handleShowModal();
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
      (company) => company.name === data.selected_company
    );
    if (selectedCompany) {
      setBanks(selectedCompany.banks);
    } else {
      setBanks([]);
    }
  }, [banks]);

  const confirmOperation = async () => {
    setLoading(true);
    try {
      await addCashOperation({
        amount,
        type,
        description,
        author,
        company,
        bank,
      });
      setAmount(0);
      setType("income");
      setDescription("");
      setCompany("");
      setBank("");

      const operationsResponse = await getCashOperationsLast30Days();
      setOperations(operationsResponse.data);
      const balanceResponse = await getCashBalance();
      setBalance(balanceResponse.data.balance);
    } catch (error) {
      setError("Ошибка при добавлении операции");
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const operationsResponse = await getCashOperationsLast30Days();
        setOperations(operationsResponse.data);

        const balanceResponse = await getCashBalance();
        setBalance(balanceResponse.data.balance);
      } catch (err) {
        setError("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <h2 className="mb-4">Касса</h2>
      <div className="mb-4">
        <p>
          Текущий баланс: <strong>{balance}₽</strong>
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="mb-4"
      >
        <div className="mb-3">
          <label htmlFor="company" className="form-label">
            Из компании:
          </label>
          {/* <input
            type="text"
            id="company"
            className="form-control"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          /> */}
          <select
          className="form-control"
          id="selected_company"
          name="selected_company"
          value={data.selected_company || ""}
          onChange={(e) => {setCompany(e.target.value); handleChange(e)}}
        >
          <option value="">Выберите компанию</option>
          {companies.map((company) => (
            <option key={company.name} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>

        </div>
        <div className="mb-3">
          <label htmlFor="bank" className="form-label">
            Из банка:
          </label>
          {/* <input
            type="text"
            id="bank"
            className="form-control"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
          /> */}
          <select
          className="form-control"
          id="bank"
          name="bank"
          value={data.bank || ""}
          onChange={(e) => {setBank(e.target.value); handleChange(e)}}
          >
            <option value="">Выберите банк</option>
            {banks.map((bank) => (
              <option key={bank.name} value={bank.name}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Сумма:
          </label>
          <input
            type="number"
            id="amount"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Тип:
          </label>
          <select
            id="type"
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value as "expense" | "income")}
          >
            <option value="expense">Расход</option>
            <option value="income">Приход</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Назначение:
          </label>
          <input
            type="text"
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Добавить
        </button>
      </form>
      <h2 className="mb-4">Платежи (за последние 30 дней)</h2>
      {loading ? (
        <p className="text-muted">Загрузка...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Автор</th>
                <th>Из компании</th>
                <th>Из банка</th>
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
                  <td>{op.author || "Не указан"}</td>
                  <td>{op.company || "Не указана"}</td>
                  <td>{op.bank || "Не указан"}</td>
                  <td>{op.amount}₽</td>
                  <td>{op.type === "income" ? "Приход" : "Расход"}</td>
                  <td>{op.description || "Отсутвует"}</td>
                  <td>{op._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                Подтверждение операции
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
                <strong>Из компании:</strong> {company}
              </p>
              <p>
                <strong>Из банка:</strong> {bank}
              </p>
              <p>
                <strong>Сумма:</strong> {amount}₽
              </p>
              <p>
                <strong>Тип:</strong> {type === "income" ? "Приход" : "Расход"}
              </p>
              <p>
                <strong>Описание:</strong> {description}
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
                onClick={confirmOperation}
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

export default Cash;
