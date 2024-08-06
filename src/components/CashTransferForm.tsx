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
  fromBanks: Bank[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const CashTransferForm: React.FC<Props> = ({
  data,
  companies,
  fromBanks,
  handleChange,
}) => {
  return (
    <div className="container">
      <div className="form-group">
        <label htmlFor="fromCompany">Из компании</label>
        <select
          className="form-control"
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
      <div className="form-group">
        <label htmlFor="fromBankName">Из банка</label>
        <select
          className="form-control"
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
    </div>
  );
};

export default CashTransferForm;
