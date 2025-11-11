// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import LoginPage from "./pages/LoginPage";
// // import Dashboard from "./components/Dashboard";

// // function App() {
// //   const [token, setToken] = useState(localStorage.getItem("token"));

// //   // Whenever token changes in localStorage (e.g., login/logout), sync it
// //   useEffect(() => {
// //     const handleStorageChange = () => {
// //       setToken(localStorage.getItem("token"));
// //     };
// //     window.addEventListener("storage", handleStorageChange);
// //     return () => window.removeEventListener("storage", handleStorageChange);
// //   }, []);

// //   return (
// //     <Router>
// //       <Routes>
// //         <Route
// //           path="/"
// //           element={!token ? <LoginPage setToken={setToken} /> : <Navigate to="/dashboard" replace />}
// //         />
// //         <Route
// //           path="/dashboard"
// //           element={token ? <Dashboard setToken={setToken} /> : <Navigate to="/" replace />}
// //         />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;


// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import LoginPage from "./pages/LoginPage";
// import Dashboard from "./components/Dashboard"; // Admin dashboard
// import UserDashboard from "./components/UserDashboard"; // New user dashboard

// function App() {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [role, setRole] = useState(localStorage.getItem("role")); // "admin" or "user"

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setToken(localStorage.getItem("token"));
//       setRole(localStorage.getItem("role"));
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         {/* Default route — redirects after login */}
//         <Route
//           path="/"
//           element={
//             !token ? (
//               <LoginPage setToken={setToken} setRole={setRole} />
//             ) : role === "admin" ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <Navigate to="/userdashboard" replace />
//             )
//           }
//         />

//         {/* Admin Dashboard */}
//         <Route
//           path="/dashboard"
//           element={
//             token && role === "admin" ? (
//               <Dashboard setToken={setToken} />
//             ) : (
//               <Navigate to="/" replace />
//             )
//           }
//         />

//         {/* User Dashboard */}
//         <Route
//           path="/userdashboard"
//           element={
//             token && role === "user" ? (
//               <UserDashboard setToken={setToken} />
//             ) : (
//               <Navigate to="/" replace />
//             )
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./components/Dashboard"; // Admin dashboard
import UserDashboard from "./components/UserDashboard"; // Node/User dashboard

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default route — login or redirect */}
        <Route
          path="/"
          element={
            !token ? (
              <LoginPage setToken={setToken} setRole={setRole} />
            ) : role === "admin" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate
                to={`/userdashboard/${localStorage.getItem("nodeID")}`}
                replace
              />
            )
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard"
          element={
            token && role === "admin" ? (
              <Dashboard setToken={setToken} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* User Dashboard */}
        <Route
          path="/userdashboard/:nodeID"
          element={
            token && role === "user" ? (
              <UserDashboard setToken={setToken} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
