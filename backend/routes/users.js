const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const userSchema = require("../schemas/user.json");
const userPatchSchema = require("../schemas/userPatch.json");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const validateJSON = require("../helpers/validateJson");
const { SECRET_KEY } = require("../config");

const router = new express.Router();


router.get("/", async (req, res, next) => {
  try {
    // get all user objects
    const detailedUsers = await User.getAll();
    // filter out unwanted properties
    const users = detailedUsers.map(u => {
      const { password, ...user } = u;
      return user;
    });

    return res.json({ users });

  } catch (error) {
    return next(error);
  }
});


router.get("/:userId", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    const detailedUser = await User.getById(+req.params.userId);
    const { password, ...user } = detailedUser;

    return res.json({ user });

  } catch (error) {
    return next(error);
  }
});


router.post("/", async (req, res, next) => {
  try {
    validateJSON(req.body, userSchema);

    const { username, password, first_name, last_name, email } = req.body;
    const detailedUser = await User.register(
      username, password, first_name, last_name, email
    );

    const { password: hashedPassword, ...user } = detailedUser;
    const payload = { id: user.id, username: user.username };

    return res.status(201).json({ user, token: jwt.sign(payload, SECRET_KEY) });

  } catch (error) {
    return next(error);
  }
});


router.patch("/:userId", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    // get user instance from db
    const detailedUser = await User.getById(+req.params.userId);
    //validte and update user instance
    validateJSON(req.body, userPatchSchema);
    const fields = ["username", "password", "first_name", "last_name", "email"];
    fields.forEach(function(field) {
      if (field in req.body) {
        detailedUser[field] = req.body[field];
      }
    });
    // save and update user instance to db
    const updatedUser = await detailedUser.update();
    // filter out password
    const { password, ...user } = updatedUser;
    return res.json({ user });

  } catch (error) {
    return next(error);
  }
});


router.delete("/:userId", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    const user = await User.getById(+req.params.userId);
    await user.remove();

    return res.json({ message: `User(${user.username}) deleted` });

  } catch (error) {
    return next(error);
  }
});


module.exports = router;