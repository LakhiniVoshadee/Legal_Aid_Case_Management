package lk.ijse.legal_aid_and_case_management_system.service;

import lk.ijse.legal_aid_and_case_management_system.dto.ClientDTO;

import java.util.List;

public interface LawyerService {
    List<ClientDTO> getClientsForLawyer(Long lawyerId);
}
