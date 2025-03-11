package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "lawyer_profile")
public class LawyerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID profileId;

    @OneToOne
    @JoinColumn(name = "lawyer_id", referencedColumnName = "uid")
    private User lawyer;

    private String specialization;
    private int yearsOfExperience;
    private String availabilitySchedule;
}
