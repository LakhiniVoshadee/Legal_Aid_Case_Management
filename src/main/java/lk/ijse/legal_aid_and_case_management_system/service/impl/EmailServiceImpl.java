package lk.ijse.legal_aid_and_case_management_system.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lk.ijse.legal_aid_and_case_management_system.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

        @Autowired
        private JavaMailSender mailSender;

        public void sendEmail(String to, String subject, String body) {
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(body, true); // true indicates HTML content
                helper.setFrom("lakhinivoshadee24@gmail.com"); // Match this with spring.mail.username

                mailSender.send(mimeMessage);
                System.out.println("Email sent successfully to " + to);
            } catch (MessagingException e) {
                System.err.println("Failed to send email: " + e.getMessage());
                throw new RuntimeException("Failed to send email", e);
            }
        }
    public void testEmail() {
        sendEmail("test-recipient@example.com", "Test Email", "This is a test email from LegalPro.");
    }
    }

