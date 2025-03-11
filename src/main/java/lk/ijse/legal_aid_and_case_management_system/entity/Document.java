package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID documentId;

    private String documentUrl;

    @ManyToOne
    @JoinColumn(name = "case_id", referencedColumnName = "caseId")
    private Case legalCase;
}
