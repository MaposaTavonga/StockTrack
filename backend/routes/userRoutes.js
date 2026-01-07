import express from 'express';
const userRoutes = express.Router();

import { getUser, createAccount } from "../controllers/userController.js";

export default userRoutes;



userRoutes.route("/login").post(getUser);

userRoutes.route("/register").post(createAccount);

console.log("Loaded userController:", getUser?.name);