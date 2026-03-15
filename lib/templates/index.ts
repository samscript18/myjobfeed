export const ContactSubmissionEmailTemplate = (context: { name: string; email: string; message: string }) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #0EA5E9;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            margin-top: 0;
            font-size: 20px;
            color: #0f172a;
        }
        .content p {
            color: #334155;
        }
        .footer {
            background-color: #f1f5f9;
            color: #64748b;
            text-align: center;
            padding: 10px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Information Inquiry from ${context.name}</h1>
        </div>
        <div class="content">
            <h2>Hi,</h2>
             <p>You have received a new contact form submission from ${context.name} (${context.email}). Below are the details of the submission:</p>
          <p>Name: ${context.name}</p>
          <p>Email: ${context.email}</p>
          <p style="
            margin-bottom: 30px;
          ">Message: ${context.message}</p>
          <p>
          You can reply to this email ${context.email} to respond to their inquiry.
        </p>
        <p>Thank you,<br>MyJobFeed Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} MyJobFeed. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};
