const jwt = require("jsonwebtoken");
const data = require("../services/data");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function loginUser(req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await data.checkUser(email, password);
    if (user) {
      const accessToken = jwt.sign(
        { email: user.email },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ accessTokem: accessToken });
    } else {
      res.json({ status: 404, message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
}

async function registerUser(req, res, next) {
  try {
    const id = new Date().getTime().toString();
    const username = req.body.username;
    const password = req.body.password;
    const phoneno = req.body.phoneno;
    const email = req.body.email;
    const profileImage = req.file.path;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      id: id,
      username: username,
      email: email,
      phoneno: phoneno,
      password: hashedPassword,
      profileimage: profileImage,
    };

    await data.insertUser(user);

    const accessToken = jwt.sign(
      { email: email },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status = 200;
    res.json({ status: 200, user: user, accessTokem: accessToken });
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const id = req.params.id;
    const user = await data.getUser(id);
    if (user) {
      res.status = 200;
      res.json(user);
    } else {
      res.status = 404;
      res.json({ status: 404, message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await data.getAllUsers();
    res.status = 200;
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const id = req.params.id;
    const user = await data.updateUser(id, req.body);
    if (user) {
      res.status = 200;
      res.json({
        status: 200,
        message: "User updated successfully",
        user: user,
      });
    } else {
      res.status = 404;
      res.json({ status: 404, message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const id = req.params.id;
    users = await data.deleteUser(id);
    if (users) {
      res.status(200);
      res.json({
        status: 200,
        message: "User deleted successfully!",
        users: users,
      });
    } else {
      res.status = 404;
      res.json({ status: 404, message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
}

async function changepassword(req, res, next) {
  try {
    const id = req.params.id;
    const oldPass = req.body.oldpassword;
    const newPass = req.body.newpassword;
    const user = await data.changePassword(id, oldPass, newPass);
    if (!user) {
      res.status(404).json({ status: 500, message: "Password doesn't match" });
    } else {
      res.status(200);
      res.json({
        status: 200,
        message: "Password changed successfully",
        user: user,
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  loginUser,
  registerUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  changepassword,
};
