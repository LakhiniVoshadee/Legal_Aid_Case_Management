package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;
import lk.ijse.legal_aid_and_case_management_system.util.Enum.CaseStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cases")
public class Case {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID caseId;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private CaseStatus status;

    @ManyToOne
    @JoinColumn(name = "client_id", referencedColumnName = "uid")
    private User client;

    @ManyToOne
    @JoinColumn(name = "lawyer_id", referencedColumnName = "uid")
    private User lawyer;

    private LocalDateTime createdAt;
}
