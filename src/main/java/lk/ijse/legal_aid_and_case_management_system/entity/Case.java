package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;
import lk.ijse.legal_aid_and_case_management_system.util.Enum.CaseStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "`case`")
public class Case {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long caseId;

    @Column(unique = true, nullable = false)
    private String caseNumber;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStatus status;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Clients client; // Reference to the client who submitted the case

    @ManyToOne
    @JoinColumn(name = "lawyer_id")
    private Lawyer lawyer; // Reference to the assigned lawyer, nullable if not assigned

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Default constructor
    public Case() {
    }

    public Case(Long caseId, String caseNumber, String description, CaseStatus status, Clients client, Lawyer lawyer, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.caseId = caseId;
        this.caseNumber = caseNumber;
        this.description = description;
        this.status = status;
        this.client = client;
        this.lawyer = lawyer;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

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

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public Clients getClient() {
        return client;
    }

    public void setClient(Clients client) {
        this.client = client;
    }

    public Lawyer getLawyer() {
        return lawyer;
    }

    public void setLawyer(Lawyer lawyer) {
        this.lawyer = lawyer;
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

    @Override
    public String toString() {
        return "Case{" +
                "caseId=" + caseId +
                ", caseNumber='" + caseNumber + '\'' +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", client=" + client +
                ", lawyer=" + lawyer +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}