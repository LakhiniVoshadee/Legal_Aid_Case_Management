package lk.ijse.legal_aid_and_case_management_system.repo;

import lk.ijse.legal_aid_and_case_management_system.entity.Case;
import lk.ijse.legal_aid_and_case_management_system.util.Enum.CaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseRepository extends JpaRepository<Case, Long> {
    List<Case> findByStatus(CaseStatus status);
}
