package lk.ijse.legal_aid_and_case_management_system.dto;

import java.time.LocalDateTime;

public class MessageDTO {
    private Long id;
    private String senderEmail;
    private String recipientEmail;
    private String content;
    private LocalDateTime timestamp;

    public MessageDTO() {}

    public MessageDTO(Long id, String senderEmail, String recipientEmail, String content, LocalDateTime timestamp) {
        this.id = id;
        this.senderEmail = senderEmail;
        this.recipientEmail = recipientEmail;
        this.content = content;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}