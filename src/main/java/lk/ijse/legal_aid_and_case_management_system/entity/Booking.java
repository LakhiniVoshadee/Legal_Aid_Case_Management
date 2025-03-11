package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID bookingId;

    @ManyToOne
    @JoinColumn(name = "client_id", referencedColumnName = "uid")
    private User client;

    @ManyToOne
    @JoinColumn(name = "lawyer_id", referencedColumnName = "uid")
    private User lawyer;

    private LocalDateTime bookedAt;
}
