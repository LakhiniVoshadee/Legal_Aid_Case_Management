package lk.ijse.legal_aid_and_case_management_system.repo;

import lk.ijse.legal_aid_and_case_management_system.entity.Appointment;
import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository  extends JpaRepository<Appointment, Long> {
}
