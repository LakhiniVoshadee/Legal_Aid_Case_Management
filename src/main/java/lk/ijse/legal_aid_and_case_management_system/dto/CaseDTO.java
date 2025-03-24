package lk.ijse.legal_aid_and_case_management_system.dto;

import java.time.LocalDateTime;

public class CaseDTO {
    private Long caseId;
    private String caseNumber;
    private String description;
    private String status;
    private Long clientId;
    private String clientName;
    private Long lawyerId;
    private String lawyerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public CaseDTO() {
    }

    // All-arg constructor
    public CaseDTO(Long caseId, String caseNumber, String description, String status,
                   Long clientId, String clientName, Long lawyerId, String lawyerName,
                   LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.caseId = caseId;
        this.caseNumber = caseNumber;
        this.description = description;
        this.status = status;
        this.clientId = clientId;
        this.clientName = clientName;
        this.lawyerId = lawyerId;
        this.lawyerName = lawyerName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public Long getCaseId() {
        return caseId;
    }

    public void setCaseId(Long caseId) {
        this.caseId = caseId;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Long getLawyerId() {
        return lawyerId;
    }

    public void setLawyerId(Long lawyerId) {
        this.lawyerId = lawyerId;
    }

    public String getLawyerName() {
        return lawyerName;
    }

    public void setLawyerName(String lawyerName) {
        this.lawyerName = lawyerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "CaseDTO{" +
                "caseId=" + caseId +
                ", caseNumber='" + caseNumber + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", clientId=" + clientId +
                ", clientName='" + clientName + '\'' +
                ", lawyerId=" + lawyerId +
                ", lawyerName='" + lawyerName + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}