package lk.ijse.legal_aid_and_case_management_system.controller;

import lk.ijse.legal_aid_and_case_management_system.dto.CaseDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.ResponseDTO;
import lk.ijse.legal_aid_and_case_management_system.service.CaseService;
import lk.ijse.legal_aid_and_case_management_system.service.UserService;
import lk.ijse.legal_aid_and_case_management_system.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/case")
@CrossOrigin(origins = "http://localhost:63342")
public class CaseController {

    private final CaseService caseService;
    private final JwtUtil jwtUtil;

    public CaseController(CaseService caseService, JwtUtil jwtUtil) {
        this.caseService = caseService;
        this.jwtUtil = jwtUtil;
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
    }


