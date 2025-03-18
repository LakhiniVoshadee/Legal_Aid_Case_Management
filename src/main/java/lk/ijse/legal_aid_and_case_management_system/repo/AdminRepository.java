package lk.ijse.legal_aid_and_case_management_system.repo;

import lk.ijse.legal_aid_and_case_management_system.entity.Admin;
import lk.ijse.legal_aid_and_case_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByUser(User user);

    boolean existsByUser_Email(String email);

    Admin findByUser_Email(String email);

    void deleteByUser_Email(String email);

}
