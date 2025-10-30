import React, { useEffect, useState } from "react";
import "./ResultsList.css";
import { useNavigate } from "react-router-dom";
function ResultsList() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch results from backend
  const fetchResults = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/results")
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch results:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Handler for updating users
  const handleUpdateUsers = () => {
    navigate("/users")
  };

  // Handler for updating policies
  const handleUpdatePolicies = () => {
    navigate("/success")
  };

  return (
    <div className="results-container">
      <h1 className="results-title">Policy Evaluation Results</h1>

      {/* Buttons for updating users and policies */}
      <div className="update-buttons" style={{ marginBottom: "1rem" }}>
        <button className="update-button" onClick={handleUpdateUsers}>
          Update Users
        </button>
        <button className="update-button" onClick={handleUpdatePolicies}>
          Update Policies
        </button>
      </div>

      <div className="results-list">
        {loading ? (
          <p className="loading-text">Loading results...</p>
        ) : results.length === 0 ? (
          <p className="loading-text">No results found.</p>
        ) : (
          results.map((user, idx) => (
            <div key={idx} className="user-card">
              <div className="user-header">
                <span className="user-avatar">{user.username[0].toUpperCase()}</span>
                <h2 className="user-name">{user.username}</h2>
              </div>

              <div className="policy-badges">
                {user.policies.map((p, i) => (
                  <span
                    key={i}
                    className={`policy-badge ${p.result ? "pass" : "fail"}`}
                  >
                    {p.policy_name}
                    <span className="policy-icon">{p.result ? "✅" : "❌"}</span>
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ResultsList;
