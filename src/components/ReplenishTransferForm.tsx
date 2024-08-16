import React from "react";
import { Company, Bank } from "../types";

interface Props {
  data: {
    fromCompany: string;
    fromBankName?: string;
    toCompany: string;
    toBankName?: string;
    amount: number;
    description?: string;
    author?: string;
  };
  companies: Company[];
  toBanks: Bank[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const CustomTransferForm: React.FC<Props> = ({
  data,
  companies,
  toBanks,
  handleChange,
}) => {
  return (
    <div className="container">
      <div className="form-group">
        <label htmlFor="toCompany">В компанию</label>
        <select
          className="form-control"
          id="toCompany"
          name="toCompany"
          value={data.toCompany || ""}
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
      <div className="form-group">
        <label htmlFor="toBankName">В банк</label>
        <select
          className="form-control"
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
      <div className="form-group">
        <label htmlFor="description">Описание</label>
        <input
          className="form-control"
          type="text"
          id="description"
          name="description"
          value={data.description || ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CustomTransferForm;
