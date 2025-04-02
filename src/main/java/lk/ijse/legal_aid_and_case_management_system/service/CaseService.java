package lk.ijse.legal_aid_and_case_management_system.service;

import lk.ijse.legal_aid_and_case_management_system.dto.CaseDTO;

import java.util.List;

public interface CaseService {
    CaseDTO submitCase(CaseDTO caseDTO);
    CaseDTO reviewCase(Long caseId, String status, Long lawyerId);

    List<CaseDTO> getOpenCases();
    CaseDTO getCaseStatusByCaseNumber(String caseNumber);
    CaseDTO assignLawyerToCase(Long caseId, Long lawyerId);
}
