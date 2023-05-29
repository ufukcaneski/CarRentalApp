import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Information from "./components/Information";
import AdminDashboard from "./components/AdminDashboard";
import Web3 from "web3";
const web3 = new Web3();
import {
  getUserAddress,
  register,
  getCarByStatus,
  getCar,
  getOwner,
  login,
} from "./Web3Client";
function App() {
  const [address, setAddress] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [car, setCar] = useState([]);
  const [name, setName] = useState({});
  const [surname, setSurname] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [userCredit, setUserCredit] = useState("0");
  const [due, setDue] = useState(0);
  const [isAvailable, setIsAvailable] = useState("You can rent a car");
  const [rideMins, setRideMins] = useState("0");

  const emptyAddress = "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    let handleInit = async () => {
      let isAUser = await login();
      console.log(isAUser);
      if (isAUser?.address !== emptyAddress) {
        if (isAUser?.name) {
          setLoggedIn(true);
          setUserCredit(web3.utils.fromWei(isAUser[4], "ether"));
        }
        setUserName(isAUser?.name);
        setSurname(isAUser[2]);
        setAddress(isAUser?.walletAddress);
        let userDue = Web3.utils.fromWei(isAUser.debt, "ether");
        setDue(Number(userDue));

        let address = await getUserAddress();
        let owner = await getOwner();
        if (address === owner.toLowerCase()) {
          setIsAdmin(true);
        }
        // get houses
        let carArray = [];
        let carByStatus = await getCarByStatus(2); // 2 means available
        carArray.push(...carByStatus);
        if (isAUser.rentedCarId !== "0") {
          let rentedHouse = await getCar(Number(isAUser.rentedCarId));
          carArray.push(rentedHouse);
        }
        setCar(carArray);

        if (isAUser.rentedHouseId !== "0") {
          let rentedCar = await getCar(Number(isAUser.rentedCarId));
          setIsAvailable(`Rented: ${rentedCar.name} - Id :${rentedCar.id}`);
        }

        let rideMins = "0";
        if (isAUser.rentedHouseId !== "0") {
          rideMins = Math.floor(
            Math.floor(Date.now() / 1000 - isAUser.start) / 60
          ).toString();
        }
        setRideMins(rideMins);
      }
    };
    handleInit();
  }, []);
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
      <div className="bg-dark">
      <Header name={userName} surname={surname} address={address} />
      <div className="d-flex bg-dark justify-content-center">
        {loggedIn ? (
          <div className="flex flex-col items-center justify-center">
            <Information
              userCredit={userCredit}
              due={due}
              rideMins={rideMins}
              isAvailable={isAvailable}
            />
            <div className=" mt-[10rem] flex justify-center mb-20 items-center gap-16">
              {car.length > 0 ? (
                car.map((car) => {
                  return (
                    <CarCard
                      key={car.id}
                      name={car.name}
                      id={car.id}
                      image={car.imgUrl}
                      saleFee={car.saleFee}
                      rentFee={car.rentFee}
                      carStatus={car.status}
                      due={due}
                    />
                  );
                })
              ) : (
                <div className="text-white text-2xl"></div>
              )}
            </div>
          </div>
        ) : (
          <form
            className="border rounded-md border-light d-flex flex-column p-6"
            onSubmit={handleRegister}
          >
            <div className="rounded-sm border-b border-light  px-3 pt-3">
              <span className="text-white">
                Name
              </span>
              <input
                type="text"
                onChange={handleNameChange}
                placeholder="Name"
                className="form-control"
              />

            </div>
            <div className="rounded-sm border-b border-light px-3 pt-3 mb-4">
              <span className="text-white">
                Surname
              </span>
              <input
                type="text"
                onChange={handleSurnameChange}
                placeholder="Surname"
                className="form-control"
              />

            </div>
            <button type="submit" className="btn btn-light mb-3 m-3">
              Register
            </button>
          </form>
        )}
      </div>
      <Footer />
      {isAdmin && <AdminDashboard />}
      </div>
    </>
  );
}

export default App;