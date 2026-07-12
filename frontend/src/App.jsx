// src/App.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import {
  NOT_FOUND_ROUTE,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
} from "./routes/routeData";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {PUBLIC_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

          {PROTECTED_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute roles={route.roles}>
                  {route.element}
                </ProtectedRoute>
              }
            />
          ))}

          <Route
            path={NOT_FOUND_ROUTE.path}
            element={NOT_FOUND_ROUTE.element}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;