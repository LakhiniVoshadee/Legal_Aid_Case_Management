package lk.ijse.legal_aid_and_case_management_system.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class AppointmentDTO {
    private UUID appointmentId;
    private UUID clientId;
    private UUID lawyerId;
    private LocalDateTime appointmentTime;
    private String meetingLink;
    private UUID paymentId; // If payment exists

    public AppointmentDTO() {
    }

    public AppointmentDTO(UUID appointmentId, UUID clientId, UUID lawyerId, LocalDateTime appointmentTime, String meetingLink, UUID paymentId) {
        this.appointmentId = appointmentId;
        this.clientId = clientId;
        this.lawyerId = lawyerId;
        this.appointmentTime = appointmentTime;
        this.meetingLink = meetingLink;
        this.paymentId = paymentId;
    }

    public UUID getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(UUID appointmentId) {
        this.appointmentId = appointmentId;
    }

    public UUID getClientId() {
        return clientId;
    }

    public void setClientId(UUID clientId) {
        this.clientId = clientId;
    }

    public UUID getLawyerId() {
        return lawyerId;
    }

    public void setLawyerId(UUID lawyerId) {
        this.lawyerId = lawyerId;
    }

    public LocalDateTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalDateTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public UUID getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(UUID paymentId) {
        this.paymentId = paymentId;
    }
}
