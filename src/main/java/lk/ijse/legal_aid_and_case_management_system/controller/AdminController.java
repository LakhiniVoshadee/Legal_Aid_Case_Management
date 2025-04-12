package lk.ijse.legal_aid_and_case_management_system.controller;

import lk.ijse.legal_aid_and_case_management_system.dto.CaseDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.ClientDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.LawyerDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.ResponseDTO;
import lk.ijse.legal_aid_and_case_management_system.service.CaseService;
import lk.ijse.legal_aid_and_case_management_system.service.ClientService;
import lk.ijse.legal_aid_and_case_management_system.service.UserService;
import lk.ijse.legal_aid_and_case_management_system.util.JwtUtil;
import lk.ijse.legal_aid_and_case_management_system.util.VarList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/dashboard")
@CrossOrigin(origins = "http://localhost:63342")
public class AdminController {
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess(){
        return "Admin logged in successfully";
    }

    @GetMapping("/lawyer")
    @PreAuthorize("hasRole('LAWYER')")
    public String lawyerAccess(){
        return "Lawyer logged in successfully";
    }

    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    public String clientAccess(){
        return "Client logged in successfully";
    }

    private final UserService userService;
    private final CaseService caseService;
    private final JwtUtil jwtUtil;

    //constructor injection
    public AdminController(UserService userService, CaseService caseService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.caseService = caseService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/lawyers-byAdmin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> getAllLawyers() {
        try {
            List<LawyerDTO> lawyers = userService.getAllLawyers();
            return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Success", lawyers));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }
    @GetMapping("/clients-byAdmin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> getAllClients() {
        try {
            List<ClientDTO> clients = userService.getAllClients();
            return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Success", clients));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }

    @GetMapping("/cases-byAdmin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> getAllCases() {
        try {
            List<CaseDTO> cases = caseService.getAllCases();
            return ResponseEntity.ok(new ResponseDTO(VarList.OK, "All cases retrieved successfully", cases));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, "Error retrieving cases: " + e.getMessage(), null));
        }
    }
    @DeleteMapping("/lawyers/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> deleteLawyer(@PathVariable String email) {
        int result = userService.deleteLawyerByEmailByAdmin(email);
        if (result == VarList.OK) {
            return ResponseEntity.ok(new ResponseDTO(200, "Lawyer deleted successfully", null));
        } else if (result == VarList.Not_Found) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(404, "Lawyer not found", null));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ResponseDTO(403, "User is not a lawyer", null));
        }
    }
    @DeleteMapping("/clients/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> deleteClient(@PathVariable String email) {
        int result = userService.deleteClientProfileByAdmin(email);
        if (result == VarList.OK) {
            return ResponseEntity.ok(new ResponseDTO(200, "Client deleted successfully", null));
        } else if (result == VarList.Not_Found) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(404, "Client not found", null));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ResponseDTO(403, "User is not a client", null));
        }
    }

}