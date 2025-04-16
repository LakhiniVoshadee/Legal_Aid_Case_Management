package lk.ijse.legal_aid_and_case_management_system.service;

import lk.ijse.legal_aid_and_case_management_system.dto.AppointmentDTO;

import java.util.List;

public interface AppointmentService {
    AppointmentDTO scheduleAppointment(AppointmentDTO appointmentDTO);

    List<AppointmentDTO> getAppointmentsByLawyer(String lawyerEmail);

    List<AppointmentDTO> getAppointmentsByClient(String clientEmail);
}