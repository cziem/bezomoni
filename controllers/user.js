const {
  Users,
  validateAddUser,
  validatePhone,
} = require("../models/user.schema");
const { hashPassword, createToken } = require("../lib/utils");

// Get all users
module.exports = {
  // Get a user by ID or phone
  getUser: async (req, res) => {
    try {
      const { phone } = req.params;
      const result = await Users.findOne(
        { $or: [{ phone: phone }] },
        { phone: 1, createdAt: 1 }
      );

      if (!result) {
        res.status(404).json({
          message: "No record found",
        });
      }

      res.status(200).json({
        user: result,
      });
    } catch (error) {
      res.status(500).send(`Oppsss, an error occurred: ${error.message}`);
    }
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const result = await Users.find({}, { phone: 1, createdAt: 1 });

      res.status(200).json({
        users: result,
      });
    } catch (error) {
      res.status(500).send(`Oppsss, an error occurred: ${error.message}`);
    }
  },

  // Subscribe a user to newsletter
  addUser: async (req, res) => {
    try {
      const { error } = validateAddUser(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      let { phone, password } = req.body;
      const foundUser = await Users.findOne({ phone });

      if (foundUser) {
        return res.status(400).json({
          message: "User already registered",
        });
      }

      password = await hashPassword(password);
      const newUser = await Users.create({ phone, password });

      const token = await createToken({
        phone: newUser.phone,
        id: newUser._id,
      });

      res.status(200).send(token);
    } catch (error) {
      console.log(error, "error");
      res.status(500).send(`Oppsss, an error occurred: ${error.message}`);
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { error } = validatePhone(req.params);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const { phone } = req.params;
      const deletedUser = await Users.findOneAndDelete({ phone });

      if (!deletedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "Account deleted successfully",
      });
    } catch (error) {
      res.status(500).send(`Oppsss, an error occurred: ${error.message}`);
    }
  },
};
