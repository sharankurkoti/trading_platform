import React, { useState } from "react";
import './FinanceService.css'; // Ensure this file contains the required styles

const FinanceService = () => {
    
  return (
    <div className="modal-window">
      <button className="close-button" onClick={() => window.history.back()}>X</button>
      <div className="finance-container">
        <h1 className="finance-title">💰 Welcome to Trade Finance</h1>
        <p className="finance-subtitle">
          Manage Trade Finance securely and efficiently.
        </p>

        {/* Embedded trade finance process form */}
        <TradeFinanceProcess />

        {/* Informational Sections */}
      </div>
    </div>
  );
};

const TradeFinanceProcess = () => {
  const steps = [
    { title: "Buyer & Seller Agreement", description: "Confirm terms and conditions of the trade." },
    { title: "Issuance of LOC", description: "Buyer’s bank issues Letter of Credit." },
    { title: "Shipment of Goods", description: "Seller ships the goods as per contract." },
    { title: "Document Submission", description: "Seller submits required documents to bank." },
    { title: "Bank Verification & Payment", description: "Bank verifies documents and releases payment." },
    { title: "Settlement & Closure", description: "Final settlement and closing of transaction." },
  ];

  const initialData = {
    buyerName: "", sellerName: "", tradeAmount: "", tradeDescription: "",
    locNumber: "", locBank: "", locExpiry: "", shipmentDate: "",
    carrierName: "", trackingNumber: "", invoiceUploaded: false,
    shippingDocsUploaded: false, verified: false, paymentDate: "",
    finalRemarks: ""
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const stepErrors = {};
    switch (currentStep) {
      case 0:
        if (!formData.buyerName.trim()) stepErrors.buyerName = "Buyer name is required";
        if (!formData.sellerName.trim()) stepErrors.sellerName = "Seller name is required";
        if (!formData.tradeAmount || isNaN(formData.tradeAmount)) stepErrors.tradeAmount = "Valid trade amount is required";
        if (!formData.tradeDescription.trim()) stepErrors.tradeDescription = "Trade description is required";
        break;
      case 1:
        if (!formData.locNumber.trim()) stepErrors.locNumber = "LOC number is required";
        if (!formData.locBank.trim()) stepErrors.locBank = "LOC issuing bank is required";
        if (!formData.locExpiry.trim()) stepErrors.locExpiry = "LOC expiry date is required";
        break;
      case 2:
        if (!formData.shipmentDate.trim()) stepErrors.shipmentDate = "Shipment date is required";
        if (!formData.carrierName.trim()) stepErrors.carrierName = "Carrier name is required";
        if (!formData.trackingNumber.trim()) stepErrors.trackingNumber = "Tracking number is required";
        break;
      case 3:
        if (!formData.invoiceUploaded) stepErrors.invoiceUploaded = "Invoice must be uploaded";
        if (!formData.shippingDocsUploaded) stepErrors.shippingDocsUploaded = "Shipping documents must be uploaded";
        break;
      case 4:
        if (!formData.verified) stepErrors.verified = "Verification checkbox must be checked";
        if (!formData.paymentDate.trim()) stepErrors.paymentDate = "Payment date is required";
        break;
      default:
        break;
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
      setErrors({});
    }
  };

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: true,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = () => {
    alert("Trade Finance Process Completed!\n\n" + JSON.stringify(formData, null, 2));
      // Reset form state to initial
    setCurrentStep(0);
    setFormData(initialData);
    setErrors({});
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <>
          <Input label="Buyer Name" name="buyerName" value={formData.buyerName} onChange={handleChange} error={errors.buyerName} />
          <Input label="Seller Name" name="sellerName" value={formData.sellerName} onChange={handleChange} error={errors.sellerName} />
          <Input label="Trade Amount (USD)" name="tradeAmount" value={formData.tradeAmount} onChange={handleChange} error={errors.tradeAmount} type="number" />
          <Textarea label="Trade Description" name="tradeDescription" value={formData.tradeDescription} onChange={handleChange} error={errors.tradeDescription} />
        </>;
      case 1:
        return <>
          <Input label="LOC Number" name="locNumber" value={formData.locNumber} onChange={handleChange} error={errors.locNumber} />
          <Input label="LOC Issuing Bank" name="locBank" value={formData.locBank} onChange={handleChange} error={errors.locBank} />
          <Input label="LOC Expiry Date" name="locExpiry" type="date" value={formData.locExpiry} onChange={handleChange} error={errors.locExpiry} />
        </>;
      case 2:
        return <>
          <Input label="Shipment Date" name="shipmentDate" type="date" value={formData.shipmentDate} onChange={handleChange} error={errors.shipmentDate} />
          <Input label="Carrier Name" name="carrierName" value={formData.carrierName} onChange={handleChange} error={errors.carrierName} />
          <Input label="Tracking Number" name="trackingNumber" value={formData.trackingNumber} onChange={handleChange} error={errors.trackingNumber} />
        </>;
      case 3:
        return <>
          <FileUpload label="Upload Invoice" uploaded={formData.invoiceUploaded} onUpload={() => handleFileUpload("invoiceUploaded")} error={errors.invoiceUploaded} />
          <FileUpload label="Upload Shipping Documents" uploaded={formData.shippingDocsUploaded} onUpload={() => handleFileUpload("shippingDocsUploaded")} error={errors.shippingDocsUploaded} />
        </>;
      case 4:
        return <>
          <Checkbox label="Documents Verified by Bank" name="verified" checked={formData.verified} onChange={handleChange} error={errors.verified} />
          <Input label="Payment Date" name="paymentDate" type="date" value={formData.paymentDate} onChange={handleChange} error={errors.paymentDate} />
        </>;
      case 5:
        return <>
          <p>All steps completed! Review your information:</p>
          <pre style={{ textAlign: "left", backgroundColor: "#f3f3f3", padding: "10px", borderRadius: "5px" }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
          <Textarea label="Final Remarks" name="finalRemarks" value={formData.finalRemarks} onChange={handleChange} />
        </>;
      default:
        return null;
    }
  };

  return (
    
    <div style={styles.container}>
      <h1>Trade Finance Steps</h1>
      <ProgressBar steps={steps} currentStep={currentStep} />

      <div style={styles.stepContainer}>
        <h2>{steps[currentStep].title}</h2>
        <p>{steps[currentStep].description}</p>
        {renderStepContent()}
      </div>
      <div style={styles.navButtons}>
        <button onClick={handlePrev} disabled={currentStep === 0}>Previous</button>
        {currentStep < steps.length - 1 && <button onClick={handleNext}>Next</button>}
        {currentStep === steps.length - 1 && <button onClick={handleSubmit} style={{ backgroundColor: "green", color: "white" }}>Finish</button>}
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, error, type = "text" }) => (
  <div style={styles.inputGroup}>
    <label htmlFor={name}>{label}:</label>
    <input type={type} id={name} name={name} value={value} onChange={onChange} style={styles.input} />
    {error && <div style={styles.error}>{error}</div>}
  </div>
);

const Textarea = ({ label, name, value, onChange, error }) => (
  <div style={styles.inputGroup}>
    <label htmlFor={name}>{label}:</label>
    <textarea id={name} name={name} value={value} onChange={onChange} style={styles.textarea} />
    {error && <div style={styles.error}>{error}</div>}
  </div>
);

const Checkbox = ({ label, name, checked, onChange, error }) => (
  <div style={styles.inputGroup}>
    <label>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} /> {label}
    </label>
    {error && <div style={styles.error}>{error}</div>}
  </div>
);

const FileUpload = ({ label, uploaded, onUpload, error }) => (
  <div style={styles.inputGroup}>
    <label>{label}:</label>
    <div>{uploaded ? <span style={{ color: "green" }}>Uploaded &#10003;</span> : <button onClick={onUpload}>Upload File</button>}</div>
    {error && <div style={styles.error}>{error}</div>}
  </div>
);

const ProgressBar = ({ steps, currentStep }) => (
  <div style={styles.progressBar}>
    {steps.map((step, index) => (
      <div
        key={index}
        style={{
          ...styles.progressStep,
          backgroundColor: index <= currentStep ? "#4caf50" : "#ddd",
        }}
      >
        {step.title}
      </div>
    ))}
  </div>
);

const styles = {
  container: {
    maxWidth: "700px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    textAlign: "center",
  },
  progressBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  progressStep: {
    flex: 1,
    padding: "10px",
    margin: "0 5px",
    borderRadius: "5px",
    color: "white",
    fontWeight: "bold",
    fontSize: "12px",
  },
  stepContainer: {
    minHeight: "250px",
    marginBottom: "20px",
    backgroundColor: "#f3f3f3",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "left",
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "4px",
  },
  textarea: {
    width: "100%",
    minHeight: "60px",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "4px",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "4px",
  },
};

export default FinanceService;