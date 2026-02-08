import emailjs from '@emailjs/browser';

export interface EmailData {
    yourEmail: string;
    girlfriendEmail: string;
    zoomLink: string;
    suggestions?: string;
    movieTitle?: string;
    movieEmoji?: string;
}

export const sendValentineEmail = async (data: EmailData): Promise<boolean> => {
    try {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        // Check if EmailJS is configured
        if (!serviceId || !templateId || !publicKey ||
            serviceId.includes('your_') || templateId.includes('your_') || publicKey.includes('your_')) {
            console.warn('EmailJS not configured. Email sending skipped.');
            // Return true to simulate success for development
            return true;
        }

        // Initialize EmailJS
        emailjs.init(publicKey);

        // Prepare template parameters
        const templateParams = {
            zoom_link: data.zoomLink,
            suggestions: data.suggestions || 'No suggestions - the plan looks perfect!',
            selected_movie: data.movieTitle ? `${data.movieEmoji || '🎬'} ${data.movieTitle}` : 'None chosen yet',
        };

        // Send to your email
        await emailjs.send(serviceId, templateId, {
            ...templateParams,
            to_email: data.yourEmail,
            recipient_name: 'You',
        });

        // Send to girlfriend's email
        await emailjs.send(serviceId, templateId, {
            ...templateParams,
            to_email: data.girlfriendEmail,
            recipient_name: 'Ms. Pamela Moronio',
        });

        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};

export const getEmailConfig = () => ({
    yourEmail: import.meta.env.VITE_YOUR_EMAIL || 'faborjaylordvhan@gmail.com',
    girlfriendEmail: import.meta.env.VITE_GIRLFRIEND_EMAIL || 'girlfriend@example.com',
    zoomLink: import.meta.env.VITE_ZOOM_LINK || 'https://zoom.us/j/your-meeting-id',
});
