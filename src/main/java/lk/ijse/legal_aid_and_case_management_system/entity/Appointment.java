package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lawyer_id", nullable = false)
    private Lawyer lawyer;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Clients client; // Updated to Clients

    private LocalDateTime appointmentTime;
    private String status; // e.g., "PENDING", "CONFIRMED", "CANCELLED"
    private String googleMeetLink;

    public Appointment() {}

    public Appointment(Long id, Lawyer lawyer, Clients client, LocalDateTime appointmentTime, String status, String googleMeetLink) {
        this.id = id;
        this.lawyer = lawyer;
        this.client = client;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.googleMeetLink = googleMeetLink;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Lawyer getLawyer() { return lawyer; }
    public void setLawyer(Lawyer lawyer) { this.lawyer = lawyer; }

    public Clients getClient() { return client; }
    public void setClient(Clients client) { this.client = client; }

    public LocalDateTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalDateTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getGoogleMeetLink() { return googleMeetLink; }
    public void setGoogleMeetLink(String googleMeetLink) { this.googleMeetLink = googleMeetLink; }
}