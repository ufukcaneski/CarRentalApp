const CarRentalPlatform = artifacts.require("CarRentalPlatform.sol");

contract("CarRentalPlatform", (accounts) => {
  let carRentalPlatform;
  const owner = accounts[0];
  const user1 = accounts[1];

  beforeEach(async () => {
    carRentalPlatform = await CarRentalPlatform.new();
  });

  describe("Add user and car", () => {
    it("adds a new user", async () => {
      await carRentalPlatform.addUser("Alice", "Smith", { from: user1 });
      const user = await carRentalPlatform.getUser(user1);
      assert.equal(user.name, "Alice", "Problem with user name");
      assert.equal(user.surname, "Smith", "Problem with user surname");
    });

    it("adds a car", async () => {
      await carRentalPlatform.addCar("Audi A6", "example url", 10, 50000, { from: owner });
      const car = await carRentalPlatform.getCar(1);
      assert.equal(car.name, "Audi A6", "Problem with car name");
      assert.equal(car.imgUrl, "example url", "Problem with car image url");
      assert.equal(car.rentFee, 10, "Problem with car rent fee");
      assert.equal(car.saleFee, 50000, "Problem with car sale fee");
    });
  })

  describe("Check out and check in car", () => {
    it("checks out a car", async () => {
      await carRentalPlatform.addUser("Alice", "Smith", { from: user1 });
      await carRentalPlatform.addCar("Audi A6", "example url", 10, 50000, { from: owner });
      await carRentalPlatform.checkOut(1, { from: user1 });

      const user = await carRentalPlatform.getUser(user1);
      assert.equal(user.rentedCarId, 1, "User could not check out the car");
    });

    it("checks in a car", async () => {
      await carRentalPlatform.addUser("Alice", "Smith", { from: user1 });
      await carRentalPlatform.addCar("Audi A6", "example url", 10, 50000, { from: owner });
      await carRentalPlatform.checkOut(1, { from: user1 });
      await new Promise(resolve => setTimeout(resolve, 10000));

      await carRentalPlatform.checkIn({ from: user1 });

      const user = await carRentalPlatform.getUser(user1);

      assert.equal(user.rentedCarId, 0, "User could not check in the car");
      assert.equal(user.debt, 10, "User debt did not get created");
    });
  });

  describe("Deposit token and make payment", () => {
    it("deposits token", async () => {
      await carRentalPlatform.addUser("Alice", "Smith", { from: user1 });
      await carRentalPlatform.deposit({ from: user1, value: 100 });
      const user = await carRentalPlatform.getUser(user1);
      assert.equal(user.balance, 100, "User could not deposit token");
    });

    it("makes payment", async () => {
      await carRentalPlatform.addUser("Alice", "Smith", { from: user1 });
      await carRentalPlatform.addCar("Audi A6", "example url", 10, 50000, { from: owner });
      await carRentalPlatform.checkOut(1, { from: user1 });
      await new Promise(resolve => setTimeout(resolve, 10000));
      await carRentalPlatform.checkIn({ from: user1 });

      await carRentalPlatform.deposit({ from: user1, value: 100 });
      await carRentalPlatform.makePayment({ from: user1 });
      const user = await carRentalPlatform.getUser(user1);

      assert.equal(user.debt, 0, "Something went wrong with trying to make the payment");
    });
  });

  describe("Edit car", () => {
    it("should edit an existing car's metadata with valid parameters", async () => {
      await carRentalPlatform.addCar("Audi A6", "example url", 10, 50000, { from: owner });

      const newName = "Audi A7";
      const newImgUrl = "new example url";
      const newRentFee = 20;
      const newSaleFee = 100000;
      await carRentalPlatform.editCarMetadata(1, newName, newImgUrl, newRentFee, newSaleFee, { from: owner });

      const car = await carRentalPlatform.getCar(1);
      assert.equal(car.name, newName, "Problem editing car name");
      assert.equal(car.imgUrl, newImgUrl, "Problem updating the car image url");
      assert.equal(car.rentFee, newRentFee, "Problem editing car rent fee");
      assert.equal(car.saleFee, newSaleFee, "Problem with editing car sale fee");
    });

    it("should edit an existing car's status", async () => {
      await carRentalPlatform.addCar("Audi A6", "example url", 10, 50000, { from: owner });
      const newStatus = 0;
      await carRentalPlatform.editCarStatus(1, newStatus, { from: owner });
      const car = await carRentalPlatform.getCar(1);
      assert.equal(car.status, newStatus, "Problem editing car status");
    });
  });

  describe("Withdraw balance", () => {
    it("should send the desired amount of tokens to the user", async () => {
      await carRentalPlatform.addUser("Alice", "Smith", { from: user1 });
      await carRentalPlatform.deposit({ from: user1, value: 100 });
      await carRentalPlatform.withdrawBalance(50, { from: user1 });

      const user = await carRentalPlatform.getUser(user1);
      assert.equal(user.balance, 50, "User could not withdraw token");
    });

    it("should send the desired amount of tokens to the owner", async () => {
      await carRentalPlatform.addUser("Alice", "Smith", { from: user1 });
      await carRentalPlatform.addCar("Audi A6", "example url", 10, 50000, { from: owner });
      await carRentalPlatform.checkOut(1, { from: user1 });
      await new Promise(resolve => setTimeout(resolve, 10000));
      await carRentalPlatform.checkIn({ from: user1 });
      await carRentalPlatform.deposit({ from: user1, value: 1000 });
      await carRentalPlatform.makePayment({ from: user1 });

      const totalPaymentAmount = await carRentalPlatform.getTotalPayments({ from: owner });
      const amountToWithdraw = totalPaymentAmount - 10;
      await carRentalPlatform.withdrawOwnerBalance(amountToWithdraw, { from: owner });
      const totalPayment = await carRentalPlatform.getTotalPayments({ from: owner });
      assert.equal(totalPayment, 10, "Owner could not withdraw token");
    });
  });
});
