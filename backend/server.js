const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Task = require("./models/Task");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const PendingUser = require("./models/PendingUser");
const sendVerificationEmail = require("./emailService");
const crypto = require("crypto");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const { ObjectId } = mongoose.Types;



app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "⚠️ Email already in use" });
        }

            const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const pendingUser = new PendingUser({
            email,
            password: hashedPassword,
            verificationToken,
        });
        await pendingUser.save();

        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: "✅ Verification email sent. Please check your inbox!" });
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error });
    }
});

app.get("/verify-email", async (req, res) => {
    try {
        const { token } = req.query;

        const pendingUser = await PendingUser.findOne({ verificationToken: token });
        if (!pendingUser) {
            return res.status(400).json({ message: "❌ Invalid or expired verification link" });
        }

        const newUser = new User({
            email: pendingUser.email,
            password: pendingUser.password,
        });
        await newUser.save();

        await PendingUser.deleteOne({ _id: pendingUser._id });

        res.send("<h1>✅ Email verified! You can now log in.</h1>");
    } catch (error) {
        console.error("❌ Error verifying email:", error);
        res.status(500).json({ message: "Error verifying email", error });
    }
});


//  Fetch tasks by userId
app.get("/tasks", async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId || !ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Valid User ID is required" });
        }

        const tasks = await Task.find({ userId: new ObjectId(userId) });
        res.json(tasks);
    } catch (error) {
        console.error("❌ Error retrieving tasks:", error);
        res.status(500).json({ message: "Error retrieving tasks", error });
    }
});

// Create new task
app.post("/tasks", async (req, res) => {
    try {
        const { title, description, dueDate, status, userId } = req.body;
        if (!userId || !ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Valid User ID is required" });
        }

        const task = new Task({ title, description, dueDate, status, userId: new ObjectId(userId) });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error("❌ Error creating task:", error);
        res.status(500).json({ message: "Error creating task", error });
    }
});

// Register user
app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({ _id: user._id, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

//  Login user
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.json({ _id: user._id, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});
//  Update Task
app.put("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "❌ Invalid Task ID" });
        }

        const { title, description, dueDate, status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, dueDate, status },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "⚠️ Task not found" });
        }

        console.log(`✅ Task updated: ${updatedTask.title}`);
        res.json(updatedTask);
    } catch (error) {
        console.error("❌ Error updating task:", error);
        res.status(500).json({ message: "Error updating task", error });
    }
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "❌ Invalid Task ID" });
        }

        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: "⚠️ Task not found" });
        }

        console.log(`🗑️ Task deleted: ${deletedTask.title}`);
        res.json({ message: "✅ Task successfully deleted" });
    } catch (error) {
        console.error("❌ Error deleting task:", error);
        res.status(500).json({ message: "Error deleting task", error });
    }
});


// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
