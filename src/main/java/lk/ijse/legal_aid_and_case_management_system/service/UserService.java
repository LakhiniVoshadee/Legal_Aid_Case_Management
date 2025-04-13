package lk.ijse.legal_aid_and_case_management_system.service;

import lk.ijse.legal_aid_and_case_management_system.dto.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {
    int saveUser(UserDTO userDTO);

    UserDTO searchUser(String username);

    int deleteUserByEmail(String email);

    int updateLawyerProfile(String email, LawyerUpdateDTO lawyerUpdateDTO);

    int updateClientProfile(String email, ClientUpdateDTO clientUpdateDTO);

    int updateAdminProfile(String email, AdminUpdateDTO adminUpdateDTO);

    int deleteLawyerByEmail(String email); //

    int deleteClientProfile(String email);

    int deleteAdminProfile(String email);

    List<LawyerDTO> getAllLawyers();

    List<ClientDTO> getAllClients();

    List<LawyerDTO> getLawyersByProvinceAndDistrict(String province, String district);

    long getRegisteredLawyersCount();

    ClientDTO getClientProfile(String email);

    List<MessageDTO> getMessages(String senderEmail, String recipientEmail);

    MessageDTO saveMessage(MessageDTO messageDTO);

    UserDetails loadUserByUsername(String email);

    int deleteLawyerByEmailByAdmin(String email);

    int deleteClientProfileByAdmin(String email);

    UserDTO uploadProfilePicture(String email, MultipartFile file) throws IOException;

    void deleteProfilePicture(String email) throws IOException;
}


