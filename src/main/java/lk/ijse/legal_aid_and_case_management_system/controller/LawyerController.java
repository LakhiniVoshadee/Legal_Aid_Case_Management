package lk.ijse.legal_aid_and_case_management_system.controller;

import lk.ijse.legal_aid_and_case_management_system.dto.ClientDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.ResponseDTO;
import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import lk.ijse.legal_aid_and_case_management_system.repo.LawyerRepository;
import lk.ijse.legal_aid_and_case_management_system.service.LawyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/lawyer")
@CrossOrigin(origins = "http://localhost:63342", allowedHeaders = "*", methods = {RequestMethod.GET})
public class LawyerController {

    @Autowired
    private LawyerService lawyerService;

    @Autowired
    private LawyerRepository lawyerRepository;

    @GetMapping("/clients")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<ResponseDTO> getClientsForLawyer() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Lawyer lawyer = lawyerRepository.findByUser_Email(email);
            if (lawyer == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO(404, "Lawyer not found for email: " + email, null));
            }
            List<ClientDTO> clients = lawyerService.getClientsForLawyer(lawyer.getLawyer_id());
            return ResponseEntity.ok()
                    .body(new ResponseDTO(200, "Clients retrieved successfully", clients));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(500, "Error retrieving clients: " + e.getMessage(), null));
        }
    }
}