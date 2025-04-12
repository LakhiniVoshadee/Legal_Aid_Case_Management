package lk.ijse.legal_aid_and_case_management_system.controller;

import lk.ijse.legal_aid_and_case_management_system.dto.CaseDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.ResponseDTO;
import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import lk.ijse.legal_aid_and_case_management_system.repo.LawyerRepository;
import lk.ijse.legal_aid_and_case_management_system.service.CaseService;
import lk.ijse.legal_aid_and_case_management_system.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/case")
@CrossOrigin(origins = "http://localhost:63342", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.PUT})
public class CaseController {

    private final CaseService caseService;
    private final JwtUtil jwtUtil;
    private final LawyerRepository lawyerRepository;

    public CaseController(CaseService caseService, JwtUtil jwtUtil, LawyerRepository lawyerRepository) {
        this.caseService = caseService;
        this.jwtUtil = jwtUtil;
        this.lawyerRepository = lawyerRepository;
    }


    @PostMapping("/submit")
    @PreAuthorize("hasRole('CLIENT')") // Restrict to clients only
    public ResponseEntity<ResponseDTO> submitCase(@RequestBody CaseDTO caseDTO) {
        try {
            CaseDTO submittedCase = caseService.submitCase(caseDTO);
            return ResponseEntity.ok().body(new ResponseDTO(200, "Case submitted successfully", submittedCase));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(500, "Error submitting case: " + e.getMessage(), null));
        }
    }

    @PutMapping("/review/{caseId}")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<ResponseDTO> reviewCase(
            @PathVariable Long caseId,
            @RequestParam String status,
            @RequestParam Long lawyerId) {
        try {
            CaseDTO reviewedCase = caseService.reviewCase(caseId, status, lawyerId);
            return ResponseEntity.ok().body(new ResponseDTO(200, "Case " + status + " successfully", reviewedCase));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO(400, "Error reviewing case: " + e.getMessage(), null));
        }
    }

    @GetMapping("/open-cases")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<ResponseDTO> getOpenCases() {
        try {
            List<CaseDTO> openCases = caseService.getOpenCases();
            return ResponseEntity.ok().body(new ResponseDTO(200, "Open cases retrieved successfully", openCases));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(500, "Error retrieving open cases: " + e.getMessage(), null));
        }
    }

    @GetMapping("/status/{caseNumber}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ResponseDTO> getCaseStatus(@PathVariable String caseNumber) {
        try {
            CaseDTO caseDTO = caseService.getCaseStatusByCaseNumber(caseNumber);
            return ResponseEntity.ok()
                    .body(new ResponseDTO(200, "Case status retrieved successfully", caseDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(404, "Case not found: " + e.getMessage(), null));
        }
    }
    @PutMapping("/assign/case-number/{caseNumber}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> assignLawyerToCaseByCaseNumber(
            @PathVariable String caseNumber,
            @RequestParam Long lawyerId) {
        try {
            CaseDTO updatedCase = caseService.assignLawyerToCaseByCaseNumber(caseNumber, lawyerId);
            return ResponseEntity.ok()
                    .body(new ResponseDTO(200, "Lawyer assigned to case successfully", updatedCase));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO(400, "Error assigning lawyer to case: " + e.getMessage(), null));
        }
    }
    @GetMapping("/assigned")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<ResponseDTO> getAssignedCases() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Lawyer lawyer = lawyerRepository.findByUser_Email(email);
        if (lawyer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(404, "Lawyer not found for email: " + email, null));
        }
        List<CaseDTO> assignedCases = caseService.getAssignedCasesForLawyer(lawyer.getLawyer_id());
        return ResponseEntity.ok().body(new ResponseDTO(200, "Assigned cases retrieved successfully", assignedCases));
    }
}


