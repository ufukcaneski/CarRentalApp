import React from "react";

const Header = ({ name, surname, address }) => {
  let stringName = null;
  let stringSurname = null;
  let stringAddress = JSON.stringify(address, null, 2);
  let firstThree = stringAddress.slice(0, 6);
  let lastFour = stringAddress.slice(-5);

  if (name) {
    stringName = JSON.stringify(name, null, 2);
  }
  if (surname) {
    stringSurname = JSON.stringify(surname, null, 2);
  }

  return (
    <header
      className="bg-dark"
    >
      <div className="mx-auto px-4 py-8 px-6 py-12 px-8">
        <div className="d-flex align-items-center justify-content-between">
          <div className="text-center">
            <h1 className="text-3xl text-white font-bold">
              Welcome{" "}
              {stringName ? (
                <span>
                  {stringName.replace(/"/g, "")}{" "}
                  {stringSurname.replace(/"/g, "")}
                </span>
              ) : (
                <span></span>
              )}
            </h1>

            <p className="mt-1.5  text-sm text-white ">
              {stringName ? (
                <span>Time to rent a car 🔥</span>
              ) : (
                <span className="text-[18px]">
                  If you want to take advantage of our service and rent a car
                  right away, please login 🚀
                </span>
              )}
            </p>
          </div>

          <h1 className="border border-light p-4 m-2 text-white rounded">
            {name ? (
              <span>
                Hi, {stringName.replace(/"/g, "")} <br />
                {address ? (
                  <span>Connected with {firstThree + "..." + lastFour}</span>
                ) : (
                  <span></span>
                )}
              </span>
            ) : (
              <span> Please Connect Your Wallet</span>
            )}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;