import {Router} from "express";
import {loadAccounts, addNewAccount, findAccountByPassportId, findAccountById, updateUser, deleteAccount, withdraw, transfer, deposit,} from "../controllers/controllers.js";
const router = Router();
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get all accounts
router.get("/", (req, res) => {
  res.status(200).send(loadAccounts());
});
// Create a new account
router.post("/addAccount/", (req, res) => {
  console.log(req.body);
  try {
    const createUser = addNewAccount(req.body);
    res.status(200).send(createUser);
  } catch (err) {
    res.status(418).send({error: err.message});
  }
});
// Get a specific account by id
router.get("/getById/:id", (req, res) => {
  console.log(req.params.id);
  try {
    res.status(200).send(findAccountById(req.params.id));
  } catch (err) {
    res.status(418).send({error: err.message});
  }
});
// get all accounts by passportId
router.get("/getByPassportId/:passportId", (req, res) => {
  console.log(req.params.id);
  try {
    res.status(200).send(findAccountByPassportId(req.params.passportId));
  } catch (err) {
    res.status(418).send({error: err.message});
  }
});
// Update a specific account
router.put("/:id", (req, res) => {
  const {id} = req.params;
  const user = req.body;
  try {
    res.status(200).send(updateUser(id, user));
  } catch (err) {
    res.status(418).send({error: err.message});
  }
});
// Deposit to account by account id.
router.put("/deposit/:id/:amount", (req, res) => {
  const {id, amount} = req.params;
  // const user = req.body;
  try {
    res.status(200).send(deposit(id, amount));
  } catch (err) {
    res.status(418).send({error: err.message});
  }
});
// Withdraw from account by account id.
router.put("/withdraw/:id/:amount", (req, res) => {
  const {id, amount} = req.params;
  try {
    res.status(200).send(withdraw(id, amount));
  } catch (err) {
    res.status(418).send({error: err.message});
  }
});
// Transfer between accounts by id
router.put("/transfer/:firstId/:secondId/:amount", (req, res) => {
  const {firstId, secondId, amount} = req.params;
  try {
    res.status(200).send(transfer(firstId, secondId, amount));
  } catch (err) {
    res.status(418).send({error: err.message});
  }
});
// Delete account by id
router.delete("/:id", (req, res) => {
  try {
    res.status(200).send(deleteAccount(req.params.id));
  } catch (err) {
    res.status(418).send({error: err.message});
  }
});

export default router;
