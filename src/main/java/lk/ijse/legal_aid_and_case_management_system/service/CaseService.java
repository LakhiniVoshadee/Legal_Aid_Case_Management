package lk.ijse.legal_aid_and_case_management_system.service;

import lk.ijse.legal_aid_and_case_management_system.dto.CaseDTO;

public interface CaseService {
    CaseDTO submitCase(CaseDTO caseDTO);
}
