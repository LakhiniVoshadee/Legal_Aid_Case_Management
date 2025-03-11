package lk.ijse.legal_aid_and_case_management_system.service;

import lk.ijse.legal_aid_and_case_management_system.dto.UserDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.UserProfileUpdateDTO;
import lk.ijse.legal_aid_and_case_management_system.entity.User;

import java.util.UUID;

public interface UserService {
    int saveUser(UserDTO userDTO);
    UserDTO searchUser(String username);
   // User updateUserProfile(UUID userId, UserProfileUpdateDTO profileUpdateDTO);
}
