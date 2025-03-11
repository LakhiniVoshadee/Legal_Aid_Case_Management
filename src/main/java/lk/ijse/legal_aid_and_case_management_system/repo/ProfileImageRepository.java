package lk.ijse.legal_aid_and_case_management_system.repo;

import lk.ijse.legal_aid_and_case_management_system.entity.ProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProfileImageRepository extends JpaRepository<ProfileImage, UUID> {
}
