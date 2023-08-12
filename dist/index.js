"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
// Create the connection pool
const pool = mysql_1.default.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10,
    multipleStatements: true,
});
// Get user details by ID
app.get('/details/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.error('Error during connection:', err);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Error during connection',
            });
        }
        if (!conn) {
            console.error('Connection is null');
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Connection is null',
            });
        }
        conn.query('SELECT * FROM User WHERE user_id = ?', [req.params.id], (err, rows) => {
            conn.release();
            if (err) {
                console.error('Error during query:', err);
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                });
            }
            return res.status(200).json({
                message: 'success',
                statusCode: 200,
                data: rows,
            });
        });
    });
});
// Register a new user
app.post('/register', (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.error('Error during connection:', err);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Error during connection',
            });
        }
        if (!conn) {
            console.error('Connection is null');
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Connection is null',
            });
        }
        const { user_name, email, password } = req.body;
        const sqlQuery = 'INSERT INTO User (user_name, email, password) VALUES (?, ?, ?)';
        conn.query(sqlQuery, [user_name, email, password], (err, rows) => {
            conn.release();
            if (err) {
                console.error('Error during registration:', err);
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Error during registration',
                });
            }
            return res.status(200).json({
                message: 'Registration successful',
                statusCode: 200,
                data: rows
            });
        });
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}!`);
});
