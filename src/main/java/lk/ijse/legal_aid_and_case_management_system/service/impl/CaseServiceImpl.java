package lk.ijse.legal_aid_and_case_management_system.service.impl;

import lk.ijse.legal_aid_and_case_management_system.dto.CaseDTO;
import lk.ijse.legal_aid_and_case_management_system.entity.Case;
import lk.ijse.legal_aid_and_case_management_system.entity.Clients;
import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import lk.ijse.legal_aid_and_case_management_system.repo.CaseRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.ClientRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.LawyerRepository;
import lk.ijse.legal_aid_and_case_management_system.service.CaseService;
import lk.ijse.legal_aid_and_case_management_system.service.EmailService;
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

    @Autowired
    private EmailService emailService;

    @Override
    public CaseDTO submitCase(CaseDTO caseDTO) {
        Clients client = clientRepository.findById(caseDTO.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + caseDTO.getClientId()));

        Case newCase = new Case();
        newCase.setCaseNumber(caseDTO.getCaseNumber());
        newCase.setDescription(caseDTO.getDescription());
        newCase.setStatus(CaseStatus.OPEN);
        newCase.setClient(client);
        newCase.setLawyer(null);
        newCase.setCreatedAt(LocalDateTime.now());
        newCase.setUpdatedAt(LocalDateTime.now());

        Case savedCase = caseRepository.save(newCase);
        return modelMapper.map(savedCase, CaseDTO.class);
    }

    @Override
    public CaseDTO reviewCase(Long caseId, String status, Long lawyerId) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found with ID: " + caseId));

        Lawyer lawyer = lawyerRepository.findById(lawyerId)
                .orElseThrow(() -> new RuntimeException("Lawyer not found with ID: " + lawyerId));

        if (!caseEntity.getStatus().equals(CaseStatus.OPEN) && !caseEntity.getStatus().equals(CaseStatus.ASSIGNED)) {
            throw new RuntimeException("Case cannot be reviewed; it is not open or assigned.");
        }

        if ("ACCEPTED".equalsIgnoreCase(status)) {
            caseEntity.setStatus(CaseStatus.ASSIGNED);
            caseEntity.setLawyer(lawyer);
        } else if ("DECLINED".equalsIgnoreCase(status)) {
            caseEntity.setStatus(CaseStatus.CLOSED);
        } else {
            throw new IllegalArgumentException("Invalid status: " + status + ". Must be 'ACCEPTED' or 'DECLINED'.");
        }

        caseEntity.setUpdatedAt(LocalDateTime.now());
        Case updatedCase = caseRepository.save(caseEntity);

        String clientEmail = caseEntity.getClient().getUser().getEmail();
        String subject = "Case Review Update: " + caseEntity.getCaseNumber();
        String body;

        if ("ACCEPTED".equalsIgnoreCase(status)) {
            body = "<h3>Case Accepted</h3>" +
                    "<p>Dear " + caseEntity.getClient().getFull_name() + ",</p>" +
                    "<p>Your case <strong>" + caseEntity.getCaseNumber() + "</strong> has been accepted by " +
                    lawyer.getLawyer_name() + ".</p>" +
                    "<p><strong>Description:</strong> " + caseEntity.getDescription() + "</p>" +
                    "<p><strong>Lawyer Contact:</strong> " + lawyer.getContactNumber() + "</p>" +
                    "<p>You can now proceed with further communication through the Legal Pro dashboard.</p>";
        } else {
            body = "<h3>Case Declined</h3>" +
                    "<p>Dear " + caseEntity.getClient().getFull_name() + ",</p>" +
                    "<p>We regret to inform you that your case <strong>" + caseEntity.getCaseNumber() +
                    "</strong> has been declined by " + lawyer.getLawyer_name() + ".</p>" +
                    "<p><strong>Description:</strong> " + caseEntity.getDescription() + "</p>" +
                    "<p>Please contact the administrator through the Legal Pro dashboard for further assistance.</p>";
        }

        try {
            emailService.sendEmail(clientEmail, subject, body);
        } catch (RuntimeException e) {
            System.err.println("Failed to send email to client " + clientEmail + ": " + e.getMessage());
        }

        CaseDTO caseDTO = modelMapper.map(updatedCase, CaseDTO.class);
        caseDTO.setClientName(caseEntity.getClient().getFull_name());
        if (caseEntity.getLawyer() != null) {
            caseDTO.setLawyerName(caseEntity.getLawyer().getLawyer_name());
        }
        return caseDTO;
    }

    @Override
    public List<CaseDTO> getOpenCases() {
        List<Case> openCases = caseRepository.findByStatus(CaseStatus.OPEN);
        return openCases.stream()
                .map(caseEntity -> {
                    CaseDTO caseDTO = modelMapper.map(caseEntity, CaseDTO.class);
                    caseDTO.setClientName(caseEntity.getClient().getFull_name());
                    if (caseEntity.getLawyer() != null) {
                        caseDTO.setLawyerName(caseEntity.getLawyer().getLawyer_name());
                    }
                    return caseDTO;
                })
                .collect(Collectors.toList());
    }

    @Override
    public CaseDTO getCaseStatusByCaseNumber(String caseNumber) {
        Case caseEntity = caseRepository.findByCaseNumber(caseNumber)
                .orElseThrow(() -> new RuntimeException("Case not found with number: " + caseNumber));

        CaseDTO caseDTO = modelMapper.map(caseEntity, CaseDTO.class);
        caseDTO.setClientName(caseEntity.getClient().getFull_name());
        if (caseEntity.getLawyer() != null) {
            caseDTO.setLawyerName(caseEntity.getLawyer().getLawyer_name());
        }
        return caseDTO;
    }

    @Override
    public CaseDTO assignLawyerToCaseByCaseNumber(String caseNumber, Long lawyerId) {
        Case caseEntity = caseRepository.findByCaseNumber(caseNumber)
                .orElseThrow(() -> new RuntimeException("Case not found with number: " + caseNumber));

        Lawyer lawyer = lawyerRepository.findById(lawyerId)
                .orElseThrow(() -> new RuntimeException("Lawyer not found with ID: " + lawyerId));

        if (!caseEntity.getStatus().equals(CaseStatus.OPEN)) {
            throw new RuntimeException("Cannot assign lawyer: Case is not open.");
        }

        caseEntity.setLawyer(lawyer);
        caseEntity.setStatus(CaseStatus.ASSIGNED);
        caseEntity.setUpdatedAt(LocalDateTime.now());

        Case updatedCase = caseRepository.save(caseEntity);

        String lawyerEmail = lawyer.getUser().getEmail();
        String subject = "New Case Assignment: " + caseEntity.getCaseNumber();
        String body = "<h3>New Case Assigned</h3>" +
                "<p>You have been assigned to case <strong>" + caseEntity.getCaseNumber() + "</strong>.</p>" +
                "<p><strong>Description:</strong> " + caseEntity.getDescription() + "</p>" +
                "<p><strong>Client:</strong> " + caseEntity.getClient().getFull_name() + "</p>" +
                "<p>Please log in to the Legal Pro dashboard to review and accept/decline the case.</p>";
        try {
            emailService.sendEmail(lawyerEmail, subject, body);
        } catch (RuntimeException e) {
            System.err.println("Failed to send email to lawyer " + lawyerEmail + ": " + e.getMessage());
        }

        CaseDTO caseDTO = modelMapper.map(updatedCase, CaseDTO.class);
        caseDTO.setClientName(caseEntity.getClient().getFull_name());
        caseDTO.setLawyerName(caseEntity.getLawyer().getLawyer_name());
        return caseDTO;
    }

    @Override
    public List<CaseDTO> getAllCases() {
        List<Case> allCases = caseRepository.findAll();
        return allCases.stream()
                .map(caseEntity -> {
                    CaseDTO caseDTO = modelMapper.map(caseEntity, CaseDTO.class);
                    caseDTO.setClientName(caseEntity.getClient().getFull_name());
                    if (caseEntity.getLawyer() != null) {
                        caseDTO.setLawyerName(caseEntity.getLawyer().getLawyer_name());
                    }
                    return caseDTO;
                })
                .collect(Collectors.toList());
    }
}