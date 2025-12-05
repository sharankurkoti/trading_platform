// src/LCTransactions.jsx
import React, { useEffect, useState } from "react";
import "./LCTransactions.css";
import { useNavigate } from "react-router-dom";

const LCTransactions = () => {
  const [lcData, setLcData] = useState([]);
  const navigate = useNavigate();

   useEffect(() => {
    fetch("http://localhost:8001/loc")
      .then((res) => res.json())
      .then((data) => setLcData(data))
      .catch((err) => console.error("Error fetching LCs:", err));
  }, []);


  return (
    <div className="lc-table-container">
      <div className="table-header">
        <h2>LC Transactions</h2>
        <button onClick={() => navigate("/loc-service")}>+ New LC</button>
      </div>

      <table className="lc-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Applicant</th>
            <th>Beneficiary</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Shipment Date</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {lcData.length > 0 ? (
            lcData.map((lc) => (
              <tr key={lc.id}>
                <td>{lc.id}</td>
                <td>{lc.applicantName}</td>
                <td>{lc.beneficiaryName}</td>
                <td>{lc.amount}</td>
                <td>{lc.currency}</td>
                <td>{lc.shipmentDate}</td>
                <td>
                  <span className={`status ${lc.status.toLowerCase()}`}>
                    {lc.status}
                  </span>
                </td>
                <td>{new Date(lc.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No LCs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LCTransactions;