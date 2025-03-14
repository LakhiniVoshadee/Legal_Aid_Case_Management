package lk.ijse.legal_aid_and_case_management_system.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/admin")
@CrossOrigin(origins = "http://localhost:8080")
public class AdminController {
    @GetMapping("/test1")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String check(){
        return "Admin logged in successfully";
    }

    @GetMapping("/lawyer")
    @PreAuthorize("hasAuthority('LAWYER')")
    public String checks(){
        return "Lawyer logged in successfully";
    }

    @GetMapping("/client")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String checkss(){
        return "Client logged in successfully";
    }

}