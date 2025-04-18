package lk.ijse.legal_aid_and_case_management_system.repo;

import lk.ijse.legal_aid_and_case_management_system.entity.Appointment;
import lk.ijse.legal_aid_and_case_management_system.util.Enum.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByClient_User_Email(String clientEmail);
    List<Appointment> findByLawyer_User_Email(String lawyerEmail);
    List<Appointment> findByStatus(AppointmentStatus status);
}