const express = require('express');
const app = express();

const cors = require("cors");
const db = require('./db');
db.query(`
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
)
`);

db.query(`
CREATE TABLE IF NOT EXISTS expense (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    category_id INT,
    type VARCHAR(50),
    description VARCHAR(255),
    amount DECIMAL(10,2),
    expense_date DATE
)
`);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://your-vercel-link.vercel.app"
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// =================================================================
// 🛡️ JWT VERIFICATION MIDDLEWARE (Moved up so every route can see it)
// =================================================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("🔒 Middleware Block: No token provided");
        return res.status(401).send("Access Denied: No Token Provided!");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            console.log("🔒 Middleware Block: Token is invalid or expired");
            return res.status(403).send("Invalid or Expired Token!");
        }
        
        req.user = decodedUser;
        console.log(`🔓 Middleware Pass: User ID ${req.user.id} authenticated successfully`);
        next();
    });
};


// =================================================================
// 🔑 AUTHENTICATION ROUTES
// =================================================================
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // STEP 1: CHECK EMAIL FIRST
        const checkUser = "SELECT * FROM users WHERE email = ?";

        db.query(checkUser, [email], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length > 0) {
                return res.status(409).json({ message: "Email already exists" });
            }

            // STEP 2: INSERT USER (ONLY IF NOT EXISTS)
            const sqlInsert =
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

            db.query(sqlInsert, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Insert error" });
                }

                res.status(201).json({
                    message: "User registered successfully"
                });
            });
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
app.post('/login', async (req, res) => {
    console.log("Request Body:", req.body);
    const { email, password } = req.body;
    if (!email || !password) { 
        return res.status(400).send("Email and password are required!");
    }
    const sqlSearch = "SELECT * FROM users WHERE email = ?";

    new Promise((resolve, reject) => {
        db.query(sqlSearch, [email], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    })
    .then(async (result) => {
       if (!result || result.length === 0) {
    return res.status(404).json({ message: "Email not registered" });
}

        const user = result[0];
        const dbPassword = user.password;
        
        if (!dbPassword) {
            console.log("❌ Error: Could not find password column in your table.");
            return res.status(500).send("Server database configuration mismatch. Check terminal logs.");
        }

        const isMatch = await bcrypt.compare(password, dbPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user.id || user.user_id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: "Login successful!",
            token: token,
            user: { id: user.id || user.user_id, name: user.name, email: user.email }
        });
    })
    .catch((error) => {
        console.error("Login processing failure:", error);
        return res.status(500).send("Internal server processing error.");
    });
});


// =================================================================
// 👥 USER CRUD ROUTES
// =================================================================
app.get('/api/users', authenticateToken, (req, res) => {
    const sqlQuery = "SELECT id, name, email FROM users";
    db.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});


app.put('/update-user/:id', authenticateToken, (req, res) => {
    const targetID = req.params.id; 
    const authenticatedUserID = req.user.id; 
    const newName = req.body.name;

    if (parseInt(targetID) !== parseInt(authenticatedUserID)) {
        return res.status(403).send("Access Denied: You cannot modify another user's data!");
    }

    const sqlUpdate = "UPDATE users SET name = ? WHERE id = ?";
    db.query(sqlUpdate, [newName, targetID], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("User updated securely!");
    });
});

app.delete('/delete-user/:id', authenticateToken, (req, res) => {
    const targetID = req.params.id; 
    const authenticatedUserID = req.user.id; 

    if (parseInt(targetID) !== parseInt(authenticatedUserID)) {
        return res.status(403).send("Access Denied: You cannot delete another user's data!");
    }

    const sqlDelete = "DELETE FROM users WHERE id = ?";
    db.query(sqlDelete, [targetID], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("User deleted securely!");
    });
});


// =================================================================
// 💰 EXPENSE TRACKER CRUD FEATURES
// =================================================================

// 1. CREATE: Add an expense linked to the logged-in user
app.post('/api/expenses', authenticateToken, (req, res) => {
    const { category_id, type, description, amount, expense_date } = req.body;
    const userId = req.user.id; 

    // Target table is singular 'expense' to match your schema layout
    const sqlInsert = "INSERT INTO expense (user_id, category_id, type, description, amount, expense_date) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sqlInsert, [userId, category_id, type, description, amount, expense_date], (err, result) => {
        if (err) {
            console.error("❌ SQL Error saving expense:", err);
            return res.status(500).send("Database error while adding expense");
        }
        res.status(201).json({ message: "Expense added successfully!", expenseId: result.insertId });
    });
});

// 2. READ ALL EXPENSES: Fetch all records linked to logged-in user
app.get('/api/expenses', authenticateToken, (req, res) => {
    console.log("HIT /api/expenses");
    const userId = req.user.id;

    console.log("USER ID:", userId);

    const sqlSelect =
      "SELECT * FROM expense WHERE user_id = ? ORDER BY id DESC";

    db.query(sqlSelect, [userId], (err, results) => {

        console.log("DATABASE RESULTS:", results);

        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        res.json(results);
    });
});

// 3. UPDATE: Edit a specific expense record (Only if it belongs to you)
app.put('/api/expenses/:id', authenticateToken, (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;

    let { category_id, type, description, amount, expense_date } = req.body;
    expense_date = expense_date.split("T")[0];

    // Checks BOTH expense id and user_id to ensure unauthorized users cannot edit it
    const sqlUpdate = "UPDATE expense SET category_id = ?, type = ?, description = ?, amount = ?, expense_date = ? WHERE id = ? AND user_id = ?";

console.log("Expense ID:", expenseId);
console.log("User ID:", userId);
console.log("Request Body:", req.body);

console.log("Data being sent to SQL:", {
    category_id,
    type,
    description,
    amount,
    expense_date
});

    db.query(sqlUpdate, [category_id, type, description, amount, expense_date, expenseId, userId], (err, result) => {
        if (err) {
            console.error("❌ SQL Update Error:", err);
            return res.status(500).send("Database error while updating expense");
        }
        if (result.affectedRows === 0) {
            return res.status(403).send("Access Denied or Expense Not Found!");
        }
        res.send("Expense updated securely!");
    });
});

// 4. DELETE: Remove a specific expense record (Only if it belongs to you)
app.delete('/api/expenses/:id', authenticateToken, (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;

    // Checks BOTH expense id and user_id to block unauthorized deletions
    const sqlDelete = "DELETE FROM expense WHERE id = ? AND user_id = ?";

    db.query(sqlDelete, [expenseId, userId], (err, result) => {
        if (err) {
            console.error("❌ SQL Delete Error:", err);
            return res.status(500).send("Database error while deleting expense");
        }
        if (result.affectedRows === 0) {
            return res.status(403).send("Access Denied or Expense Not Found!");
        }
        res.send("Expense deleted securely!");
    });
});


// =================================================================
// 🚀 SERVER START SYSTEM
// =================================================================
app.get('/', (req, res) => {
    res.send('Server is running !');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
