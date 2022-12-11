import uniqId from "uniqid";
import {writeFileSync, readFileSync} from "fs";
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get all accounts
const loadAccounts = () => {
  try {
    const buffer = readFileSync("./database/accounts.json");
    const dataJSON = buffer.toString();
    return JSON.parse(dataJSON);
  } catch (err) {
    log.call(err)
    return [];
  }
};
// save changes to JSON
const saveData = (users) => {
  const dataJSON = JSON.stringify(users);
  writeFileSync("./database/accounts.json", dataJSON);
};
// Create a new account
const addNewAccount = (user) => {
  const users = loadAccounts();
  console.log(user)
  const newUser = {
    id: uniqId(),
    passportId: user.passportId,
    firstName: user.firstName,
    lastName: user.lastName,
    balance: 0,
    credit: 0,
    transactions: "[]",
    LastUpdated: new Date().toISOString(),
    ...user,
  };
  users.push(newUser);
  saveData(users);
  return newUser;
};
// Get a specific account by id
const findAccountById = (id) => {
  const users = loadAccounts();
  const findUser = users.find((user) => user.id === id);
  if (!findUser) {
    throw new Error("User not found.")
  }
  return findUser;
};
// get all customer accounts by passportId
const findAccountByPassportId = (passportId) => {
  const users = loadAccounts();
  const findUser = users.filter((user) => user.passportId === passportId);
  if (!findUser) {
    throw new Error("Passport ID not found");
  }
  return findUser;
};
// Update user details
const updateUser = (id, user) => {
  const users = loadAccounts();
  const foundUser = users.find((user) => {
    return user.id === id;
  });
  if (!foundUser) {
    throw new Error("User not found, update faild");
  }
  const updatedUser = {
    ...foundUser,
    ...user,
    id: foundUser.id,
    LastUpdated: new Date().toISOString(),
  };
  const index = users.findIndex((user) => user.id === id);
  users[index] = updatedUser;
  saveData(users);
  return updatedUser;
};
// Add funds to account
const deposit = (id, amount) => {
  const users = loadAccounts();
  const foundUser = users.find((account) => {
    return account.id === id;
  });
  if (!foundUser) {
    throw new Error("The user does not exist, cannot deposit!");
  }
  const updatedUser = {
    ...foundUser,
    balance: Number(foundUser.balance) + amount * 1,
    LastUpdated: new Date().toISOString(),
  };
  const index = users.findIndex((m) => m.id === id);
  users[index] = updatedUser;
  saveData(users);
  return updatedUser;
};
// Withdraw funds to account
const withdraw = (id, amount) => {
  const users = loadAccounts();
  const foundUser = users.find((account) => {
    return account.id === id;
  });
  if (!foundUser) {
    throw new Error("The user does not exist, cannot deposit!");
  }
  if (foundUser && (foundUser.balance * 1 + foundUser.credit * 1 < amount * 1)) {
    throw new Error("There is not enough money in the account");
  }
  const updatedUser = {
    ...foundUser,
    balance: Number(foundUser.balance) - amount * 1,
    updatedAt: new Date().toISOString(),
  };
  const index = users.findIndex((m) => m.id === id);
  users[index] = updatedUser;
  saveData(users);
  return updatedUser;
};
// Transfer between accounts
const transfer = (firstId, secondId, amount, user) => {
  const users = loadAccounts();
  const getMoneyFrom = users.find((account) => {
    return account.id === firstId;
  });
  const sendMoneyTo = users.find((account) => {
    return account.id === secondId;
  });
  if (!getMoneyFrom || !sendMoneyTo) {
    throw new Error("Account not found");
  }
  if (Number(getMoneyFrom.balance) + Number(getMoneyFrom.credit) < amount * 1) {
    throw new Error("There is not enough money");
  }
  const updateSender = {
    ...getMoneyFrom,
    id: getMoneyFrom.id,
    balance: Number(getMoneyFrom.balance) - amount * 1,
  };
  const updateReceiver = {
    ...sendMoneyTo,
    id: sendMoneyTo.id,
    balance: Number(sendMoneyTo.balance) + amount * 1,
  };
  const sender = users.findIndex((user) => user.id === firstId);
  const receiver = users.findIndex((user) => user.id === secondId);
  users[sender] = updateSender;
  users[receiver] = updateReceiver;
  saveData(users);
  return updateReceiver;
};
// delete an account
const deleteAccount = (id) => {
  const users = loadAccounts();
  const idx = users.findIndex((m) => m.id === id);
  if (idx !== -1) {
    users.splice(idx, 1);
    saveData(users);
    return users;
  } else {
    throw new Error("Account not found, delete failed");
  }
};

export {
  loadAccounts,
  addNewAccount,
  findAccountById,
  updateUser,
  transfer,
  deposit,
  withdraw,
  deleteAccount,
  findAccountByPassportId
};
