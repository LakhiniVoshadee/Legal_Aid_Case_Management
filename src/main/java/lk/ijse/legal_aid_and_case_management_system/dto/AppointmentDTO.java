package lk.ijse.legal_aid_and_case_management_system.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private String lawyerEmail; // To identify the lawyer
    private String clientEmail; // To identify the client
    private LocalDateTime appointmentTime;
    private String googleMeetLink;

    public AppointmentDTO() {}

    public AppointmentDTO(String lawyerEmail, String clientEmail, LocalDateTime appointmentTime, String googleMeetLink) {
        this.lawyerEmail = lawyerEmail;
        this.clientEmail = clientEmail;
        this.appointmentTime = appointmentTime;
        this.googleMeetLink = googleMeetLink;
    }

    public String getLawyerEmail() {
        return lawyerEmail;
    }

    public void setLawyerEmail(String lawyerEmail) {
        this.lawyerEmail = lawyerEmail;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public LocalDateTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalDateTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getGoogleMeetLink() {
        return googleMeetLink;
    }

    public void setGoogleMeetLink(String googleMeetLink) {
        this.googleMeetLink = googleMeetLink;
    }
}