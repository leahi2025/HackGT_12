import { useEffect, useState } from "react";
import PatientAppointment from "./PatientAppointment";
import HCPAppointment from "./HCPAppointment";
import { getUserType } from "./components/GetUserType";

function Appointment() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

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

  if (userType === "hcp") {
    return <HCPAppointment id={userId} />;
  } else if (userType === "patient") {
    return <PatientAppointment id={userId} />;
  }
}

export default Appointment;
