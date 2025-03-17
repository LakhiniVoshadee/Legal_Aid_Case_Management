package lk.ijse.legal_aid_and_case_management_system.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/dashboard")
@CrossOrigin(origins = "http://localhost:8080")
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

}