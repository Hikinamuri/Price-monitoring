import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import RetailerDetailPage from "./pages/RetailerDetailPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/retailer/:retailerName" element={<RetailerDetailPage />} />
            <Route path="/retailer/:retailerName/category/:categorySlug" element={<CategoryDetailPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;