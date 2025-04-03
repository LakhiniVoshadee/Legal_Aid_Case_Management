package lk.ijse.legal_aid_and_case_management_system.repo;

import lk.ijse.legal_aid_and_case_management_system.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE (m.senderEmail = :senderEmail AND m.recipientEmail = :recipientEmail) OR (m.senderEmail = :recipientEmail AND m.recipientEmail = :senderEmail) ORDER BY m.timestamp ASC")
    List<Message> findBySenderEmailAndRecipientEmail(String senderEmail, String recipientEmail);

}
