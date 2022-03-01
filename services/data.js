const bcrypt = require("bcrypt");

//empty user array
let users = [];

async function checkUser(email, password) {
  const user = users.find((user) => {
    return user.email == email;
  });
  if (user) {
    valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

async function getAllUsers() {
  return users;
}

async function getUser(id) {
  const user = users.find((user) => {
    return user.id == id;
  });
  return user;
}

async function insertUser(user) {
  users.push(user);
  return user;
}

async function deleteUser(id) {
  const user = getUser(id);
  if (user) {
    const updatesUsers = users.filter((user) => {
      return user.id !== id;
    });
    users = updatesUsers;
    return users;
  } else {
    return null;
  }
}

async function updateUser(id, payload) {
  let index = users.findIndex((user) => user.id == id);
  if (index !== -1) {
    let newuser = { ...users[index] };
    newuser.username = payload.username || newuser.username;
    newuser.email = payload.email || newuser.email;
    newuser.phoneno = payload.phoneno || newuser.phoneno;
    users[index] = newuser;
    return newuser;
  }
  return null;
}

async function changePassword(id, oldPass, newPass) {
  let index = users.findIndex((user) => user.id == id);
  if (index != -1) {
    valid = await bcrypt.compare(oldPass, users[index].password);
    if (valid) {
      const salt = await bcrypt.genSalt();
      const newPassword = await bcrypt.hash(newPass, salt);
      users[index].password = newPassword;
      return users[index];
    }
  } else {
    return null;
  }
}

module.exports = {
  checkUser,
  getUser,
  getAllUsers,
  insertUser,
  deleteUser,
  updateUser,
  changePassword,
};
