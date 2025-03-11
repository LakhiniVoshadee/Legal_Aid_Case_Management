package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID paymentId;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client; // The client who made the payment

    @ManyToOne
    @JoinColumn(name = "lawyer_id", nullable = false)
    private User lawyer; // The lawyer who receives the payment

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment; // Payment is linked to a booked appointment

    @Column(nullable = false)
    private BigDecimal amount; // Payment amount

    @Column(nullable = false)
    private String paymentMethod; // Example: "Credit Card", "Bank Transfer"

    @Column(nullable = false)
    private String status; // Example: "Pending", "Completed", "Failed"

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp; // Time when payment was made

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
