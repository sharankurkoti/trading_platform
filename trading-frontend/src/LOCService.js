// src/LOCService.jsx
import React, { useState } from 'react';
import './LOCService.css';
import { useNavigate } from 'react-router-dom';

const LOCService = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    applicantName: '',
    beneficiaryName: '',
    amount: '',
    currency: '',
    goodsDescription: '',
    shipmentDate: '',
  });

  const handleClose = () => {
    navigate('/');  // Navigate back to Dashboard
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = () => {
    alert("LC Submitted Successfully!");
    setStep(1);
    setFormData({
      applicantName: '',
      beneficiaryName: '',
      amount: '',
      currency: '',
      goodsDescription: '',
      shipmentDate: '',
    });
    navigate('/'); // Optionally navigate after submission
  };

  return (
    <div className="modal-window">
      <button className="close-button" onClick={handleClose}>X</button>

      <div className="loc-container">
        <h1>Letter of Credit</h1>

        {step === 1 && (
          <div className="form-step">
            <h2>Step 1: LC Application</h2>
            <input type="text" name="applicantName" placeholder="Applicant Name" value={formData.applicantName} onChange={handleChange} />
            <input type="text" name="beneficiaryName" placeholder="Beneficiary Name" value={formData.beneficiaryName} onChange={handleChange} />
            <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} />
            <input type="text" name="currency" placeholder="Currency (e.g. USD)" value={formData.currency} onChange={handleChange} />
            <input type="text" name="goodsDescription" placeholder="Goods Description" value={formData.goodsDescription} onChange={handleChange} />
            <input type="date" name="shipmentDate" value={formData.shipmentDate} onChange={handleChange} />
            <button onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>Step 2: Review</h2>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            <div className="button-group">
              <button onClick={handleBack}>Back</button>
              <button onClick={handleNext}>Approve</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>Step 3: LC Issuance</h2>
            <p>LC issued to {formData.beneficiaryName} for {formData.amount} {formData.currency}.</p>
            <button onClick={handleNext}>Proceed to Shipment</button>
          </div>
        )}

        {step === 4 && (
          <div className="form-step">
            <h2>Step 4: Shipment & Documents</h2>
            <p>Goods shipped. Awaiting documents from beneficiary.</p>
            <button onClick={handleNext}>Documents Received</button>
          </div>
        )}

        {step === 5 && (
          <div className="form-step">
            <h2>Step 5: Payment</h2>
            <p>Payment of {formData.amount} {formData.currency} released to beneficiary.</p>
            <button onClick={handleNext}>Close LC</button>
          </div>
        )}

        {step === 6 && (
          <div className="form-step">
            <h2>Step 6: LC Closed</h2>
            <p>The Letter of Credit has been successfully closed.</p>
            <button onClick={handleSubmit}>Finish</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LOCService;