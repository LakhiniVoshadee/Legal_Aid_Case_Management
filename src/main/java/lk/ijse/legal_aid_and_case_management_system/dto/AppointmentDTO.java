package lk.ijse.legal_aid_and_case_management_system.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private String lawyerEmail; // To identify the lawyer
    private String clientEmail; // To identify the client
    private LocalDateTime appointmentTime;
}