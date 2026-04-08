require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const approvals = {}; // Store guest approval statuses

const studentEmailMap = {
    "CB.SC.U4CSE24408": "ananya1008.bottu@gmail.com",
    "CB.SC.U4CSE24456": "nehatutika07@gmail.com",
    "CB.SC.U4CSE24452": "swethambariv7@gmail.com"
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route to send email with approval/rejection links
app.post("/send-email", (req, res) => {
    const { guestName, phoneNumber, studentID, carNumber } = req.body;
    const receiverEmail = studentEmailMap[studentID];

    if (!receiverEmail) {
        return res.status(400).json({ success: false, message: "Student ID not recognized." });
    }

    approvals[studentID] = "pending";

    const approveLink = `http://localhost:${port}/approve?studentID=${studentID}`;
    const rejectLink = `http://localhost:${port}/reject?studentID=${studentID}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: receiverEmail,
        subject: "New Guest Entry Request",
        html: `
            <h2>Guest Entry Request</h2>
            <p><strong>Guest Name:</strong> ${guestName}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Student ID:</strong> ${studentID}</p>
            <p><strong>Car Number:</strong> ${carNumber || "N/A"}</p>
            <br>
            <a href="${approveLink}" style="padding: 10px 20px; background: green; color: white; text-decoration: none; border-radius: 5px;">Approve</a>
            <a href="${rejectLink}" style="padding: 10px 20px; background: red; color: white; text-decoration: none; border-radius: 5px; margin-left: 10px;">Reject</a>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Email Error:", error);
            return res.status(500).json({ success: false, message: "Failed to send email" });
        }
        console.log("Email sent successfully:", info.response);
        res.status(200).json({ success: true, message: "Email sent successfully" });
    });
});

// Route to approve guest entry
app.get("/approve", (req, res) => {
    const { studentID } = req.query;
    if (approvals[studentID]) {
        approvals[studentID] = "approved";
        res.send(`
            <h1 style="color: green;">✅ Approved</h1>
            <p>The guest entry for <strong>${studentID}</strong> has been approved.</p>
        `);
    } else {
        res.status(400).send("<h2>Error ❌</h2><p>Invalid approval request.</p>");
    }
});

// Route to reject guest entry
app.get("/reject", (req, res) => {
    const { studentID } = req.query;
    if (approvals[studentID]) {
        approvals[studentID] = "rejected";
        res.send(`
            <h1 style="color: red;">❌ Rejected</h1>
            <p>The guest entry for <strong>${studentID}</strong> has been rejected.</p>
        `);
    } else {
        res.status(400).send("<h2>Error ❌</h2><p>Invalid rejection request.</p>");
    }
});

// Route to check approval status
app.get("/check-approval", (req, res) => {
    const { studentID } = req.query;
    if (!studentID) {
        return res.status(400).json({ success: false, message: "Missing studentID parameter." });
    }
    
    const status = approvals[studentID];
    if (status) {
        res.json({ success: true, status });
    } else {
        res.status(404).json({ success: false, message: "Student ID not found." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
