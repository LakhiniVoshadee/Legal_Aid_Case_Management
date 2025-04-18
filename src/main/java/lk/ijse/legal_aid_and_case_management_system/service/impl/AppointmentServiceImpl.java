package lk.ijse.legal_aid_and_case_management_system.service.impl;

import lk.ijse.legal_aid_and_case_management_system.dto.AppointmentDTO;
import lk.ijse.legal_aid_and_case_management_system.entity.Appointment;
import lk.ijse.legal_aid_and_case_management_system.entity.Clients;
import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import lk.ijse.legal_aid_and_case_management_system.repo.AppointmentRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.ClientRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.LawyerRepository;
import lk.ijse.legal_aid_and_case_management_system.service.AppointmentService;
import lk.ijse.legal_aid_and_case_management_system.util.Enum.AppointmentStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private LawyerRepository lawyerRepository;

    @Override
    public AppointmentDTO scheduleAppointment(AppointmentDTO appointmentDTO) {
        Clients client = clientRepository.findByUser_Email(appointmentDTO.getClientEmail());
        Lawyer lawyer = lawyerRepository.findByUser_Email(appointmentDTO.getLawyerEmail());

        if (client == null || lawyer == null) {
            throw new RuntimeException("Client or Lawyer not found");
        }

        Appointment appointment = new Appointment();
        appointment.setClient(client);
        appointment.setLawyer(lawyer);
        appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
        appointment.setGoogleMeetLink(appointmentDTO.getGoogleMeetLink());
        appointment.setStatus(AppointmentStatus.PENDING.name());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToDTO(savedAppointment);
    }

    @Override
    public List<AppointmentDTO> getClientAppointments(String clientEmail) {
        List<Appointment> appointments = appointmentRepository.findByClient_User_Email(clientEmail);
        return appointments.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getLawyerAppointments(String lawyerEmail) {
        List<Appointment> appointments = appointmentRepository.findByLawyer_User_Email(lawyerEmail);
        return appointments.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public AppointmentDTO updateAppointmentStatus(Long appointmentId, AppointmentStatus status, String lawyerEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getLawyer().getUser().getEmail().equals(lawyerEmail)) {
            throw new RuntimeException("Unauthorized: Lawyer does not own this appointment");
        }

        if (status == AppointmentStatus.CONFIRMED || status == AppointmentStatus.REJECTED) {
            appointment.setStatus(status.name());
        } else {
            throw new RuntimeException("Invalid status for lawyer action");
        }

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToDTO(updatedAppointment);
    }

    @Override
    public void cancelAppointment(Long appointmentId, String userEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        boolean isClient = appointment.getClient().getUser().getEmail().equals(userEmail);
        boolean isLawyer = appointment.getLawyer().getUser().getEmail().equals(userEmail);

        if (!isClient && !isLawyer) {
            throw new RuntimeException("Unauthorized: User does not own this appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED.name());
        appointmentRepository.save(appointment);
    }

    @Override
    public AppointmentDTO manageAppointment(Long appointmentId, AppointmentDTO appointmentDTO, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Clients client = clientRepository.findByUser_Email(appointmentDTO.getClientEmail());
        Lawyer lawyer = lawyerRepository.findByUser_Email(appointmentDTO.getLawyerEmail());

        if (client == null || lawyer == null) {
            throw new RuntimeException("Client or Lawyer not found");
        }

        appointment.setClient(client);
        appointment.setLawyer(lawyer);
        appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
        appointment.setGoogleMeetLink(appointmentDTO.getGoogleMeetLink());
        appointment.setStatus(status.name());

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToDTO(updatedAppointment);
    }

    private AppointmentDTO mapToDTO(Appointment appointment) {
        return new AppointmentDTO(
                appointment.getLawyer().getUser().getEmail(),
                appointment.getClient().getUser().getEmail(),
                appointment.getAppointmentTime(),
                appointment.getGoogleMeetLink(),
                appointment.getStatus() // Include status
        );
    }
}