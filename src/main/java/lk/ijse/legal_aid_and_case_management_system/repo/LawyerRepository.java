package lk.ijse.legal_aid_and_case_management_system.repo;

import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import lk.ijse.legal_aid_and_case_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LawyerRepository extends JpaRepository<Lawyer, Long> {
    boolean existsByUser(User user);

    boolean existsByUser_Email(String email);

    Lawyer findByUser_Email(String email);

    void deleteByUser_Email(String email);

    List<Lawyer> findByProvinceAndDistrict(String province, String district);
}
