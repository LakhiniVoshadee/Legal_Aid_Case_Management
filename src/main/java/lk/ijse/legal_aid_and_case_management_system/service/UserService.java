package lk.ijse.legal_aid_and_case_management_system.service;

import lk.ijse.legal_aid_and_case_management_system.dto.UserDTO;

import java.util.List;
import java.util.UUID;

public interface UserService {
    int saveUser(UserDTO userDTO);
    UserDTO searchUser(String username);
   // UserDTO updateUserProfile(UUID userId, UserProfileUpdateDTO profileUpdateDTO);

    UserDTO updateUserProfile(UUID userId, UserDTO userDTO);
    List<UserDTO> searchLawyers();

}
