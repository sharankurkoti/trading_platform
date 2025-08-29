// src/FinanceWorkflow.js
import React, { useState } from 'react';
import './FinanceWorkflow.css';

const steps = [
  'Trade Agreement',
  'Finance Application',
  'Bank Assessment',
  'LC Issuance',
  'Goods Shipment',
  'Document Verification',
  'Payment Release',
  'Reimbursement',
  'Closure & Archive'
];

const FinanceWorkflow = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
  const prev = () => setCurrent((prev) => Math.max(prev - 1, 0));

  return (
    <div className="workflow-container">
      <h2>Trade Finance Process</h2>
      <div className="stepper">
        {steps.map((label, idx) => (
          <div key={idx} className={`step ${idx === current ? 'active' : idx < current ? 'completed' : ''}`}>
            {label}
          </div>
        ))}
      </div>
      <div className="control-buttons">
        <button onClick={prev} disabled={current === 0}>Back</button>
        <button onClick={next} disabled={current === steps.length - 1}>Next</button>
      </div>
      <div className="step-description">
        <p><strong>Step {current + 1}:</strong> {steps[current]}</p>
        {/* Optionally expand this with detailed descriptions per step */}
      </div>
    </div>
  );
};

export default FinanceWorkflow;