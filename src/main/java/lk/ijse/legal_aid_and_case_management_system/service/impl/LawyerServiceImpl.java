package lk.ijse.legal_aid_and_case_management_system.service.impl;

import lk.ijse.legal_aid_and_case_management_system.dto.ClientDTO;
import lk.ijse.legal_aid_and_case_management_system.entity.Case;
import lk.ijse.legal_aid_and_case_management_system.entity.Clients;
import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import lk.ijse.legal_aid_and_case_management_system.repo.CaseRepository;
import lk.ijse.legal_aid_and_case_management_system.service.LawyerService;
import lk.ijse.legal_aid_and_case_management_system.util.Enum.CaseStatus;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LawyerServiceImpl implements LawyerService {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<ClientDTO> getClientsForLawyer(Long lawyerId) {
        Lawyer lawyer = new Lawyer();
        lawyer.setLawyer_id(lawyerId);
        List<Case> assignedCases = caseRepository.findByLawyerAndStatus(lawyer, CaseStatus.ASSIGNED);
        return assignedCases.stream()
                .map(caseEntity -> caseEntity.getClient())
                .distinct()
                .map(client -> {
                    ClientDTO clientDTO = modelMapper.map(client, ClientDTO.class);
                    clientDTO.setLawyersCount(1); // Set to 1 as this client is associated with this lawyer
                    return clientDTO;
                })
                .collect(Collectors.toList());
    }
}