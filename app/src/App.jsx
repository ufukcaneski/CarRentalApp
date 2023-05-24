import { getUserAddress, register, getCarByStatus, getCar, getOwner, login } from "./Web3Client";
import { useState, useEffect } from "react";
import Web3 from "web3";

import Header from "./components/Header";
import Footer from "./components/Footer";
function App() {
  const [address, setAddress] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const emptyAddress = "0x0000000000000000000000000000000000000000";

  const handleNameChange = async (e) => {
    setName(e.target.value);
  };

  const handleSurnameChange = async (e) => {
    setSurname(e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let res = await register(name, surname);
      if (res) {
        setLoggedIn(true);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (due !== 0) {
      setIsAvailable("You have to pay your debt");
    }
  }, [due]);

  return (
    <>
      <Header name={userName} surname={surname} address={address} />
      <Footer />
      {isAdmin && <AdminDashboard />}
    </>
  );
}

export default App;