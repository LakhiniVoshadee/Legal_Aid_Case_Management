package lk.ijse.legal_aid_and_case_management_system.repo;

import lk.ijse.legal_aid_and_case_management_system.entity.Appointment;
import lk.ijse.legal_aid_and_case_management_system.entity.Clients;
import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByLawyerAndAppointmentTime(Lawyer lawyer, LocalDateTime appointmentTime);
    List<Appointment> findByLawyer(Lawyer lawyer);
    List<Appointment> findByClient(Clients client);
}