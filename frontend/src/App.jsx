import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

// --- PAGE 1: FORM (DECISION TREE VERSION) ---
const FormPage = ({ setPrediction }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Point this to your Decision Tree backend URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const applicantIncomeRef = useRef(null);
  const loanAmountRef = useRef(null);
  
  const [formData, setFormData] = useState({
    gender: 1, 
    married: 1, 
    dependents: 0, 
    education: 0,
    self_employed: 0, 
    coapplicant_income: 0,
    loan_term: 360, 
    credit_history: 1.0,
    property_area: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const applicantIncomeValue = parseFloat(applicantIncomeRef.current?.value ?? '');
      const loanAmountValue = parseFloat(loanAmountRef.current?.value ?? '');

      if (Number.isNaN(applicantIncomeValue) || Number.isNaN(loanAmountValue)) {
        alert("Please enter valid numeric values.");
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        applicant_income: applicantIncomeValue,
        coapplicant_income: parseFloat(formData.coapplicant_income),
        loan_amount: loanAmountValue
      };

      // Connects to the Decision Tree API
      const response = await axios.post(`${API_BASE_URL}/predict`, payload);
      setPrediction(response.data.status);
      navigate('/result');
    } catch (err) {
      console.error("Connection Error:", err);
      alert(`Backend Error: ${err.response?.data?.detail || "Check if your Decision Tree FastAPI is running!"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf7] py-12 px-4 sm:px-6 lg:px-10 font-sans text-black">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-12">
        
        {/* LEFT COLUMN: BRANDING (GREEN THEME) */}
        <section className="lg:w-2/5 space-y-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">ML Project 2</p>
            <h1 className="text-4xl font-black text-green-600 leading-tight uppercase tracking-tight">
              Decision <br /> Tree <br /> Portal
            </h1>
            <p className="text-gray-500 text-sm">
              Non-linear classification engine using entropy splits to predict loan approval.
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-100 rounded-2xl p-6 text-center lg:text-left uppercase tracking-[0.5em] text-xs text-gray-500">
            powered by&nbsp;
            <span className="text-green-700 font-semibold tracking-[0.2em]">Tree-Based Logic</span>
          </div>
        </section>

        {/* RIGHT COLUMN: FORM */}
        <form
          onSubmit={handleSubmit}
          className="w-full lg:flex-1 bg-white border border-gray-200 rounded-2xl shadow-lg px-6 sm:px-10 py-10 space-y-10"
        >
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-green-600 font-bold text-lg">Application Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputGroup label="Married">
                <select className="w-full border border-gray-600 rounded p-2"
                  value={formData.married} onChange={(e) => setFormData({...formData, married: parseInt(e.target.value)})}>
                  <option value="1">Yes</option><option value="0">No</option>
                </select>
              </InputGroup>
              <InputGroup label="Education">
                <select className="w-full border border-gray-600 rounded p-2"
                  value={formData.education} onChange={(e) => setFormData({...formData, education: parseInt(e.target.value)})}>
                  <option value="0">Graduate</option><option value="1">Undergraduate</option>
                </select>
              </InputGroup>
              <InputGroup label="Gender">
                <select className="w-full border border-gray-600 rounded p-2"
                  value={formData.gender} onChange={(e) => setFormData({...formData, gender: parseInt(e.target.value)})}>
                  <option value="1">Male</option><option value="0">Female</option>
                </select>
              </InputGroup>
              <InputGroup label="Property Area">
                <select className="w-full border border-gray-600 rounded p-2"
                  value={formData.property_area} onChange={(e) => setFormData({...formData, property_area: parseInt(e.target.value)})}>
                  <option value="0">Rural</option><option value="1">Urban</option><option value="2">Semiurban</option>
                </select>
              </InputGroup>
            </div>
          </div>

          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-green-600 font-bold text-lg">Financial Analysis</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputGroup label="Applicant Income">
                <div className="relative w-full">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    ref={applicantIncomeRef}
                    defaultValue="5000"
                    className="w-full border border-gray-600 rounded p-2 pl-8 text-left"
                  />
                </div>
              </InputGroup>
              <InputGroup label="Credit History">
                <select className="w-full border border-gray-600 rounded p-2"
                  value={formData.credit_history} onChange={(e) => setFormData({...formData, credit_history: parseFloat(e.target.value)})}>
                  <option value={1}>Good (1.0)</option>
                  <option value={0}>Bad (0.0)</option>
                </select>
              </InputGroup>
              <InputGroup label="Loan Amount">
                <div className="relative w-full">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    ref={loanAmountRef}
                    defaultValue="150"
                    className="w-full border border-gray-600 rounded p-2 pl-8 text-left"
                  />
                </div>
              </InputGroup>
              <InputGroup label="Dependents">
                <select className="w-full border border-gray-600 rounded p-2"
                  value={formData.dependents} onChange={(e) => setFormData({...formData, dependents: parseInt(e.target.value)})}>
                  <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3+</option>
                </select>
              </InputGroup>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg shadow-md hover:bg-green-700 transition uppercase mt-10"
          >
            {loading ? "Processing..." : "Run Tree Prediction"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- HELPERS ---
const InputGroup = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
    <label className="text-gray-700 font-medium text-left sm:w-1/3">{label}</label>
    <div className="w-full sm:w-2/3">{children}</div>
  </div>
);

// --- RESTORED RESULT PAGE WITH ICONS ---
const ResultPage = ({ prediction }) => {
  const navigate = useNavigate();
  const isApproved = prediction === 'Approved';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
      <div className="flex items-center gap-4 mb-6">
        {isApproved ? (
          <svg className="w-16 h-16 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" className="stroke-current" strokeWidth="2" fill="none" />
            <path className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l2.5 2.5L16 9" />
          </svg>
        ) : (
          <svg className="w-16 h-16 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" className="stroke-current" strokeWidth="2" fill="none" />
            <path className="stroke-current" strokeWidth="2" strokeLinecap="round" d="M9 9l6 6m0-6l-6 6" />
          </svg>
        )}
        <h1 className={`text-5xl font-bold ${isApproved ? 'text-green-500' : 'text-red-500'}`}>
          {isApproved ? 'APPROVED' : 'REJECTED'}
        </h1>
      </div>

     

      <button 
        onClick={() => navigate('/')} 
        className="bg-green-600 text-white px-8 py-3 rounded font-bold uppercase hover:bg-green-700 transition shadow-lg"
      >
        Back to Tree Engine
      </button>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [prediction, setPrediction] = useState(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage setPrediction={setPrediction} />} />
        <Route path="/result" element={<ResultPage prediction={prediction} />} />
      </Routes>
    </Router>
  );
}