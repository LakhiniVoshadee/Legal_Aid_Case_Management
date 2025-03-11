package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID appointmentId;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client; // Client who booked the appointment

    @ManyToOne
    @JoinColumn(name = "lawyer_id", nullable = false)
    private User lawyer; // Lawyer assigned for the appointment

    @Column(nullable = false)
    private LocalDateTime appointmentTime; // Date & time of appointment

    private String meetingLink; // For online consultation (e.g., Zoom/Google Meet)

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL)
    private Payment payment; // Payment for this appointment
}
