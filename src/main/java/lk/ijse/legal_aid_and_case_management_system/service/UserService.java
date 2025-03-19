package lk.ijse.legal_aid_and_case_management_system.service;

import lk.ijse.legal_aid_and_case_management_system.dto.*;

import java.util.List;
import java.util.UUID;

public interface UserService {
    int saveUser(UserDTO userDTO);
    UserDTO searchUser(String username);
    int deleteUserByEmail(String email);
    int updateLawyerProfile(String email, LawyerUpdateDTO lawyerUpdateDTO);
    int updateClientProfile(String email, ClientUpdateDTO clientUpdateDTO);
    int updateAdminProfile(String email, AdminUpdateDTO adminUpdateDTO);
    int deleteLawyerByEmail(String email); //
    int deleteClientProfile(String email);
    List<LawyerDTO> getAllLawyers();
    List<LawyerDTO> getLawyersByProvinceAndDistrict(String province, String district);
}


