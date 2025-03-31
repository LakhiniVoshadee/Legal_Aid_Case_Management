package lk.ijse.legal_aid_and_case_management_system.service.impl;

import lk.ijse.legal_aid_and_case_management_system.dto.CaseDTO;
import lk.ijse.legal_aid_and_case_management_system.entity.Case;
import lk.ijse.legal_aid_and_case_management_system.entity.Clients;
import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import lk.ijse.legal_aid_and_case_management_system.repo.CaseRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.ClientRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.LawyerRepository;
import lk.ijse.legal_aid_and_case_management_system.service.CaseService;
import lk.ijse.legal_aid_and_case_management_system.util.Enum.CaseStatus;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CaseServiceImpl implements CaseService {
    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private LawyerRepository lawyerRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CaseDTO submitCase(CaseDTO caseDTO) {
        // Fetch the client based on clientId from CaseDTO
        Clients client = clientRepository.findById(caseDTO.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + caseDTO.getClientId()));

        // Map DTO to Entity
        Case newCase = new Case();
        newCase.setCaseNumber(caseDTO.getCaseNumber());
        newCase.setDescription(caseDTO.getDescription());
        newCase.setStatus(CaseStatus.valueOf("OPEN")); // Default status for new cases
        newCase.setClient(client);
        newCase.setLawyer(null); // No lawyer assigned initially
        newCase.setCreatedAt(LocalDateTime.now());
        newCase.setUpdatedAt(LocalDateTime.now());

        // Save the case to the database
        Case savedCase = caseRepository.save(newCase);

        // Map the saved entity back to DTO and return
        return modelMapper.map(savedCase, CaseDTO.class);
    }

    @Override
    public CaseDTO reviewCase(Long caseId, String status, Long lawyerId) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found with ID: " + caseId));

        Lawyer lawyer = lawyerRepository.findById(lawyerId)
                .orElseThrow(() -> new RuntimeException("Lawyer not found with ID: " + lawyerId));

        if (!caseEntity.getStatus().equals(CaseStatus.OPEN)) {
            throw new RuntimeException("Case is already processed.");
        }

        if ("ACCEPTED".equalsIgnoreCase(status)) {
            caseEntity.setStatus(CaseStatus.ASSIGNED);
            caseEntity.setLawyer(lawyer);
        } else if ("DECLINED".equalsIgnoreCase(status)) {
            caseEntity.setStatus(CaseStatus.CLOSED);
        } else {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        caseEntity.setUpdatedAt(LocalDateTime.now());
        Case updatedCase = caseRepository.save(caseEntity);

        return modelMapper.map(updatedCase, CaseDTO.class);
    }
    @Override
    public List<CaseDTO> getOpenCases() {
        List<Case> openCases = caseRepository.findByStatus(CaseStatus.OPEN);
        return openCases.stream()
                .map(caseEntity -> {
                    CaseDTO caseDTO = modelMapper.map(caseEntity, CaseDTO.class);
                    caseDTO.setClientName(caseEntity.getClient().getFull_name()); // Assuming Clients has getFullName()
                    if (caseEntity.getLawyer() != null) {
                        caseDTO.setLawyerName(caseEntity.getLawyer().getLawyer_name()); // Assuming Lawyer has getLawyerName()
                    }
                    return caseDTO;
                })
                .collect(Collectors.toList());
    }
}

