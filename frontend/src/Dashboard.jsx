import { useEffect, useState } from "react";
import PatientDashboard from "./PatientDashboard";
import HCPDashboard from "./HCPDashboard";
import { getUserType } from "./components/GetUserType";

function Dashboard() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
        setLoading(false);
        return;
      }

      const type = await getUserType(token, userId);
      setUserType(type);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!userType) return <p>User not found</p>;

  return userType === "patient" ? <PatientDashboard /> : <HCPDashboard />;
}

export default Dashboard;
