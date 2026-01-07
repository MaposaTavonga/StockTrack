import pool from "../database.js";

/**
 * @desc    Create product
 * @route   POST /api/products
 * @access  Public
 */
export const createProduct = async (req, res) => {
  const {
    user_id,
    name,
    image_url,
    selling_price,
    current_stock,
    low_stock_threshold
  } = req.body;

  if (!user_id || !name || selling_price === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO products (
        user_id,
        name,
        image_url,
        selling_price,
        current_stock,
        low_stock_threshold
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        user_id,
        name,
        image_url || null,
        selling_price,
        current_stock ?? 0,
        low_stock_threshold ?? 5
      ]
    );

    res.status(201).json({
      message: "Product created",
      product: rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get products for a user
 * @route   GET /api/products/:userId
 * @access  Public
 */
export const getProductsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT *
       FROM products
       WHERE user_id = $1
         AND archived = false
       ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({ products: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Public
 */
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    image_url,
    selling_price,
    current_stock,
    low_stock_threshold
  } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE products
       SET
         name = COALESCE($1, name),
         image_url = COALESCE($2, image_url),
         selling_price = COALESCE($3, selling_price),
         current_stock = COALESCE($4, current_stock),
         low_stock_threshold = COALESCE($5, low_stock_threshold),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [
        name,
        image_url,
        selling_price,
        current_stock,
        low_stock_threshold,
        id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Delete product (permanent)
 * @route   DELETE /api/products/:id
 * @access  Public
 */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM products WHERE id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
