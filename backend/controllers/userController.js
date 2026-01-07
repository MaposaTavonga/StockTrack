import pool from "../database.js";

//desc Check User exists
//@access Private
/**
 * Check if user exists
 */
const userExists = async (email) => {
  const { rows } = await pool.query(
    "SELECT 1 FROM users WHERE email = $1",
    [email]
  );
  return rows.length > 0;
};


// @desc    Login user
// @route   POST /api/users/login
// @access  Public



export const getUser = async (req, res) => {
    console.log("Login route hit! Body:", req.body); // << add this
  const { email, pin } = req.body;

  if (!email || !pin) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, full_name, email
       FROM users
       WHERE email = $1 AND password_hash = $2`,
      [email, pin]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    res.status(200).json({
      success: true,
      user,
        message: "Login successful"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// @desc    Create account
// @route   POST /api/users/register
// @access  Public
export const createAccount = async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    if (await userExists(email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const { rows } = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email`,
      [full_name, email, password]
    );

    res.status(201).json({
      message: "Account created",
      user: rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
