import { Route, Routes } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignedInUsersOnly from "@/components/SignedInUsersOnly";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <SignedInUsersOnly>
            <HomePage />
          </SignedInUsersOnly>
        }
      />
      <Route path="/login" Component={LoginPage} />
    </Routes>
  );
};

export default App;
