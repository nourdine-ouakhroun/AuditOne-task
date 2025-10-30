import React from "react";
import { Routes, Route } from "react-router-dom";
import PolicyUploader from "./components/PolicyUploader";
import UserUploader from "./components/UserUploader";
import SuccessPage from "./components/SuccessPage";
import ResultsTable from "./components/resulte";
function App() {
  return (
    <Routes>
      {/* Home page: Policy upload */}
      <Route path="/" element={<PolicyUploader />} />
      
      {/* Policy upload success */}
      <Route path="/success" element={<SuccessPage />} />

      {/* User upload page */}
      <Route path="/users" element={<UserUploader />} />
      
      <Route path="/resulte" element={<ResultsTable />} />
      {/* User upload success */}
    </Routes>
  );
}

export default App;
