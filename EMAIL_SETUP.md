# Email Configuration Guide

## Setting Up EmailJS for Valentine's Invitation

To enable email notifications when your girlfriend accepts the proposal, follow these steps:

### 1. Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create an Email Service

1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended)
4. Follow the instructions to connect your email account
5. Copy the **Service ID** (you'll need this later)

### 3. Create an Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Set the **Subject**: `💕 Valentine's Day Date Confirmed!`
4. Use this template content (copy exactly as shown):

```
Hi {{recipient_name}}! 💖

Exciting news - our Valentine's Day virtual date is all set! 

═══════════════════════════════════════

📅 DATE: Friday, February 14th, 2026

🔗 ZOOM LINK: {{zoom_link}}

═══════════════════════════════════════

✨ OUR DATE SCHEDULE ✨

🍕 7:00 PM - Dinner Date
   We'll order our favorite pizzas and eat "together" 
   on video call!

🍿 8:30 PM - Movie Night  
   Teleparty session watching "About Time"
   (or whatever you'd prefer!)

🎮 10:30 PM - Co-op Gaming
   It Takes Two / Overcooked / Stardew Valley
   Let's see if we survive without chaos! 😄

🎁 11:30 PM - Gift Exchange
   Time to open the digital surprise!

═══════════════════════════════════════

💭 YOUR SUGGESTIONS:
{{suggestions}}

═══════════════════════════════════════

Can't wait to spend this special day with you! 
See you on the 14th! 💕

With love,
Jaylord

P.S. Make sure to test your Zoom link before our date! 
```

5. **Important**: In the template settings, make sure these variable names are exactly as shown:
   - `{{recipient_name}}`
   - `{{zoom_link}}`
   - `{{suggestions}}`

4. Save the template and copy the **Template ID**

### 4. Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key**
3. Copy it

### 5. Update Environment Variables

Edit the `.env.local` file in your project root:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_YOUR_EMAIL=faborjaylordvhan@gmail.com
VITE_GIRLFRIEND_EMAIL=her_email@example.com
VITE_ZOOM_LINK=https://zoom.us/j/your-meeting-id
```

Replace:
- `your_service_id_here` with your Service ID from step 2
- `your_template_id_here` with your Template ID from step 3
- `your_public_key_here` with your Public Key from step 4
- `her_email@example.com` with your girlfriend's actual email
- `https://zoom.us/j/your-meeting-id` with your actual Zoom link

### 6. Restart the Development Server

```bash
npm run dev
```

### 7. Test It!

1. Navigate to the proposal slide
2. Optionally add a suggestion
3. Click "YES! 💕"
4. Check both email inboxes for the notification

## Troubleshooting

- **Emails not sending?** Check the browser console for error messages
- **Wrong email addresses?** Double-check the `.env.local` file
- **Template not working?** Make sure the variable names in the template match exactly: `{{recipient_name}}`, `{{date_plan}}`, `{{suggestions}}`, `{{zoom_link}}`, `{{to_email}}`, `{{reply_to}}`

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- No credit card required
- Perfect for this Valentine's project!

---

💡 **Tip**: Test the email functionality before the big day to make sure everything works perfectly!
