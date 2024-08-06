import React from "react";

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
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const CustomTransferForm: React.FC<Props> = ({ data, handleChange }) => {
  return (
    <div className="container">
      <div className="form-group">
        <label htmlFor="toCompany">В компанию</label>
        <input
          className="form-control"
          type="text"
          id="toCompany"
          name="toCompany"
          value={data.toCompany || ""}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="toBankName">В банк</label>
        <input
          className="form-control"
          type="text"
          id="toBankName"
          name="toBankName"
          value={data.toBankName || ""}
          onChange={handleChange}
        />
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
