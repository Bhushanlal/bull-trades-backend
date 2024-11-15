export const loginOtp = (otp: number) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }
                .header {
                    background-color: #5dcc44;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px;
                }
                .content {
                    padding: 20px;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .otp {
                    font-size: 32px;
                    font-weight: bold;
                    color: #2c3e50;
                    text-align: center;
                    padding: 20px;
                    margin: 20px 0;
                    background-color: #ffffff;
                    border-radius: 5px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Trade Echo</h1>
                </div>
                <div class="content">
                    <p>Dear User,</p>
                    <p>Here is your OTP for login:</p>
                    <div class="otp">${otp}</div>
                    <p>Please use this OTP to complete your login process. This OTP is valid for a limited time.</p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>Best Regards,<br>Team Trade Echo</p>
                </div>
            </div>
        </body>
        </html>
    `;
};