import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./page/home/Home";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./errorboundary/errorboundary";
// import PrivateComponent from "./components/PrivateComponent";
import Login from "./page/login/Login";

function App() {
  return (
    <div className="App" data-testid="app-component">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
      />
     
        <ErrorBoundary>
          <Routes>
            
            <Route path="/" element={<Login></Login>} />
            {/* <Route element={<PrivateComponent />}> */}
            <Route path="/home" element={<Home></Home>} />
            {/* </Route> */}
          </Routes>
        </ErrorBoundary>
     
    </div>
  );
}

export default App;
