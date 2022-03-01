const router = require("express").Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authenticateUser");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + file.originalname
    );
  },
});

const upload = multer({ storage: storage });

router.post("/users/login", userController.loginUser);

router.post(
  "/users/register",
  upload.single("profileimage"),
  userController.registerUser
);

router.get("/users", authMiddleware, userController.getAllUsers);

router.get("/users/:id", authMiddleware, userController.getUser);

router.patch("/users/:id", authMiddleware, userController.updateUser);

router.patch(
  "/users/changepassword/:id",
  authMiddleware,
  userController.changepassword
);

router.delete("/users/:id", authMiddleware, userController.deleteUser);

module.exports = router;
