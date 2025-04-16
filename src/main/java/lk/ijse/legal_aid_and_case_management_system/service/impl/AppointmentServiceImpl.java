package lk.ijse.legal_aid_and_case_management_system.service.impl;

import lk.ijse.legal_aid_and_case_management_system.dto.AppointmentDTO;
import lk.ijse.legal_aid_and_case_management_system.entity.Appointment;
import lk.ijse.legal_aid_and_case_management_system.entity.Clients;
import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import lk.ijse.legal_aid_and_case_management_system.repo.*;
import lk.ijse.legal_aid_and_case_management_system.service.AppointmentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private LawyerRepository lawyerRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public AppointmentDTO scheduleAppointment(AppointmentDTO appointmentDTO) {
        // Validate lawyer and client
        Optional<Lawyer> lawyer = Optional.ofNullable(lawyerRepository.findByUser_Email(appointmentDTO.getLawyerEmail()));
        if (lawyer.isEmpty()) {
            throw new RuntimeException("Lawyer not found with email: " + appointmentDTO.getLawyerEmail());
        }
        Optional<Clients> client = Optional.ofNullable(clientRepository.findByUser_Email(appointmentDTO.getClientEmail()));
        if (client.isEmpty()) {
            throw new RuntimeException("Client not found with email: " + appointmentDTO.getClientEmail());
        }

        // Check for conflicts
        boolean isConflict = appointmentRepository.existsByLawyerAndAppointmentTime(lawyer.orElse(null), appointmentDTO.getAppointmentTime());
        if (isConflict) {
            throw new RuntimeException("Lawyer is unavailable at this time");
        }

        // Create and populate appointment entity
        Appointment appointment = new Appointment();
        appointment.setLawyer(lawyer.orElse(null));
        appointment.setClient(client.orElse(null));
        appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
        appointment.setStatus("PENDING");
        appointment.setGoogleMeetLink("https://meet.google.com/xyz-abc-def"); // Placeholder link

        // Save to database
        appointment = appointmentRepository.save(appointment);

        // Update DTO with Google Meet link and return
        appointmentDTO.setGoogleMeetLink(appointment.getGoogleMeetLink());
        return appointmentDTO;
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByLawyer(String lawyerEmail) {
        Optional<Lawyer> lawyer = Optional.ofNullable(lawyerRepository.findByUser_Email(lawyerEmail));
        if (lawyer.isEmpty()) {
            throw new RuntimeException("Lawyer not found with email: " + lawyerEmail);
        }
        List<Appointment> appointments = appointmentRepository.findByLawyer(lawyer.get());
        return appointments.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByClient(String clientEmail) {
        Optional<Clients> client = Optional.ofNullable(clientRepository.findByUser_Email(clientEmail));
        if (client.isEmpty()) {
            throw new RuntimeException("Client not found with email: " + clientEmail);
        }
        List<Appointment> appointments = appointmentRepository.findByClient(client.get());
        return appointments.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to map Appointment entity to AppointmentDTO
    private AppointmentDTO mapToDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setLawyerEmail(appointment.getLawyer().getUser().getEmail());
        dto.setClientEmail(appointment.getClient().getUser().getEmail());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setGoogleMeetLink(appointment.getGoogleMeetLink());
        return dto;
    }
}