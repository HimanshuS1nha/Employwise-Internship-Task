import { useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignedInUsersOnly = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("token-expiry");
    if (token && tokenExpiry) {
      const tokenExpiryDate = new Date(tokenExpiry);
      if (new Date() > tokenExpiryDate) {
        toast.error("Token expired. Please login again");
        navigate("/login", { replace: true }); // Push to login screen if token has expired
      } else {
        setShowChildren(true);
      }
    } else {
      toast.error("Please login first");
      navigate("/login", { replace: true }); // Push to login screen if user is not logged in
    }
  }, []);
  return <>{showChildren && children}</>;
};

export default SignedInUsersOnly;
