package lk.ijse.legal_aid_and_case_management_system.repo;

import ch.qos.logback.core.net.server.Client;
import lk.ijse.legal_aid_and_case_management_system.entity.Clients;
import lk.ijse.legal_aid_and_case_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Clients, Long> {

    boolean existsByUser(User user);

    boolean existsByUser_Email(String email);

    Clients findByUser_Email(String email);

    void deleteByUser_Email(String email);


}
