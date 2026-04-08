# Guest Details - Electron & PHP Application

This repository contains a full-stack desktop and web application designed to manage guest entry and scanning details.

## Project Architecture
- **Frontend**: Built using standard HTML/CSS/JS and wrapped in an **Electron** shell (`main.js`).
- **Scanner Backend**: Built in **PHP** (`Scanners_DB`), designed to be hosted via XAMPP/WAMP.
- **Email Server**: Built in **Express** (`GUEST_DETAILS/server.js`), utilized for sending email notifications through Nodemailer.

## Setup Instructions

### 1. Database Setup (MySQL/XAMPP)
- Start **Apache** and **MySQL** from your XAMPP or WAMP control panel.
- Ensure you have a MySQL database named `uid`.
- You will need a table called `guest_details` (containing columns like `roll_number`, `name`, `phone_number`, `car_number`, `scan_time`, `scan2_time`, `exit_time`).

### 2. Node Dependencies
Open your terminal and install dependencies for both the Electron client and the Express backend:
```bash
# In the root project folder
npm install

# In the GUEST_DETAILS folder
cd GUEST_DETAILS
npm install
```

### 3. Environment Variables
Inside the `GUEST_DETAILS` folder, you must add an `.env` file that includes credentials for the Node email service.
```env
PORT=3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```
*(Note: Never upload your `.env` file to GitHub!)*

## Running the Application
1. **Start XAMPP** (Apache and MySQL).
2. **Start the Express Server**: Navigate to `GUEST_DETAILS` and run `node server.js`.
3. **Start the App**: In the root folder, run `npm start` to launch the Electron application.
