package lk.ijse.legal_aid_and_case_management_system.service;

public interface EmailService {
    void sendEmail(String lawyerEmail, String subject, String body);

    void testEmail();
}
