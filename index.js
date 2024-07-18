const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    const Fname = capitalizeFirstLetter(name);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    try {
        const mailToMe = {
            from: `"Peter" <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            subject: 'Contact From Portfolio',
            html: `
                    <h3>New Message from Contact Form</h3>
                    <p><strong>Name:</strong> ${Fname}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr>
                    <div class="message">
                        <p><strong>Message:</strong></p>
                        <p>${message}</p>
                    </div>
                    
                `,
        };  
        const mailToUser = {
            from: `"Peter" <${process.env.EMAIL}>`,
            to: email,
            subject: 'Thank You for Reaching Out!',
            html: `
                    <p>Dear ${Fname},</p>
                    <p>Thank you for contacting me through my portfolio. I will get back to you shortly.</p>
                    <p>Best regards,<br>Peter</p>
                    
                `,
        };  
        const sendToUser = await transporter.sendMail(mailToUser);
        const sendToMe = await transporter.sendMail(mailToMe);
        
        res.status(200).send('Message sent successfully!');
    } catch (error) {
        res.status(500).send('Failed to send email. Please try again later.');
    }  
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
