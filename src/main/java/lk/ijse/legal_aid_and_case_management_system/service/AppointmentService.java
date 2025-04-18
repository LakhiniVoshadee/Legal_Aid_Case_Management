package lk.ijse.legal_aid_and_case_management_system.service;

import lk.ijse.legal_aid_and_case_management_system.dto.AppointmentDTO;
import lk.ijse.legal_aid_and_case_management_system.util.Enum.AppointmentStatus;

import java.util.List;

public interface AppointmentService {
    AppointmentDTO scheduleAppointment(AppointmentDTO appointmentDTO);
    List<AppointmentDTO> getClientAppointments(String clientEmail);
    List<AppointmentDTO> getLawyerAppointments(String lawyerEmail);
    List<AppointmentDTO> getAllAppointments();
    AppointmentDTO updateAppointmentStatus(Long appointmentId, AppointmentStatus status, String lawyerEmail);
    void cancelAppointment(Long appointmentId, String userEmail);
    AppointmentDTO manageAppointment(Long appointmentId, AppointmentDTO appointmentDTO, AppointmentStatus status);
}