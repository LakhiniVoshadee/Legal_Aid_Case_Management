package lk.ijse.legal_aid_and_case_management_system.service;

import lk.ijse.legal_aid_and_case_management_system.dto.AppointmentDTO;

public interface AppointmentService {
    AppointmentDTO scheduleAppointment(AppointmentDTO appointmentDTO);

}