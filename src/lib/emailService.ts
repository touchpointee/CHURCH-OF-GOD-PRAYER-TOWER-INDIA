import nodemailer from 'nodemailer';
import path from 'path';

const port = parseInt(process.env.SMTP_PORT || '587');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'contact@touchpointe.digital';
const FROM_NAME = process.env.SMTP_FROM_NAME || 'Church of God Prayer Tower';
const TO_EMAIL = 'ajmalj2003@gmail.com'; // Admin email to receive notifications

const logoPath = path.join(process.cwd(), 'public', 'logo.jpg');

const headerHtml = `
    <div style="text-align: center; padding: 20px; background-color: #f8f9fa;">
        <img src="cid:churchlogo" alt="${FROM_NAME}" style="max-height: 100px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <h2 style="color: #2c3e50; margin-top: 15px; font-family: sans-serif;">${FROM_NAME}</h2>
    </div>
`;

const footerHtml = `
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 12px; text-align: center; font-family: sans-serif;">
        <p>This is an automated message from ${FROM_NAME}. Please do not reply directly to this email.</p>
    </div>
`;

export const sendContactNotification = async (data: { firstName?: string, lastName?: string, email: string, phone?: string, message: string }) => {
    const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Someone';
    
    const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
            ${headerHtml}
            <div style="padding: 30px; background-color: #ffffff; color: #333333;">
                <h3 style="color: #2c3e50; margin-top: 0;">New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                <br/>
                <p><strong>Message:</strong></p>
                <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; border-radius: 4px;">
                    ${data.message.replace(/\n/g, '<br/>')}
                </div>
            </div>
            ${footerHtml}
        </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
            to: TO_EMAIL,
            subject: `New Contact Request from ${name}`,
            html: htmlBody,
            attachments: [
                {
                    filename: 'logo.jpg',
                    path: logoPath,
                    cid: 'churchlogo' // same cid value as in the html img src
                }
            ]
        });
        console.log('Contact notification email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending contact notification email:', error);
    }
};

export const sendPrayerRequestNotification = async (data: { name?: string, contact?: string, message: string, isConfidential?: boolean }) => {
    const name = data.name || 'Anonymous';
    
    const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
            ${headerHtml}
            <div style="padding: 30px; background-color: #ffffff; color: #333333;">
                <h3 style="color: #2c3e50; margin-top: 0;">New Prayer Request</h3>
                ${data.isConfidential ? '<p style="color: #e74c3c; font-weight: bold; padding: 10px; background-color: #fdf2f0; border-radius: 4px;">Private & Confidential</p>' : ''}
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Contact Info:</strong> ${data.contact || 'N/A'}</p>
                <br/>
                <p><strong>Prayer Request:</strong></p>
                <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #9b59b6; border-radius: 4px;">
                    ${data.message.replace(/\n/g, '<br/>')}
                </div>
            </div>
            ${footerHtml}
        </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
            to: TO_EMAIL,
            subject: `New Prayer Request from ${name}`,
            html: htmlBody,
            attachments: [
                {
                    filename: 'logo.jpg',
                    path: logoPath,
                    cid: 'churchlogo'
                }
            ]
        });
        console.log('Prayer request notification email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending prayer request notification email:', error);
    }
};
