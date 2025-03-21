package lk.ijse.legal_aid_and_case_management_system.controller;

import jakarta.validation.Valid;
import lk.ijse.legal_aid_and_case_management_system.dto.*;
import lk.ijse.legal_aid_and_case_management_system.service.UserService;
import lk.ijse.legal_aid_and_case_management_system.util.JwtUtil;
import lk.ijse.legal_aid_and_case_management_system.util.VarList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/user")
@CrossOrigin(origins = "http://localhost:63342")
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    //constructor injection
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping(value = "/register")
    public ResponseEntity<ResponseDTO> registerUser(@RequestBody @Valid UserDTO userDTO) {
        try {
            int res = userService.saveUser(userDTO);
            switch (res) {
                case VarList.Created -> {
                    String token = jwtUtil.generateToken(userDTO);
                    AuthDTO authDTO = new AuthDTO();
                    authDTO.setEmail(userDTO.getEmail());
                    authDTO.setToken(token);
                    return ResponseEntity.status(HttpStatus.CREATED)
                            .body(new ResponseDTO(VarList.Created, "Success", authDTO));
                }
                case VarList.Not_Acceptable -> {
                    return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                            .body(new ResponseDTO(VarList.Not_Acceptable, "Email Already Used", null));
                }
                default -> {
                    return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                            .body(new ResponseDTO(VarList.Bad_Gateway, "Error", null));
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }
    @PutMapping("/update-lawyer")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<ResponseDTO> updateLawyerProfile(@RequestBody LawyerUpdateDTO lawyerUpdateDTO,
                                                           @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String email = userDetails.getUsername(); // Email from JWT token
            int res = userService.updateLawyerProfile(email, lawyerUpdateDTO);

            switch (res) {
                case VarList.OK:
                    return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Profile updated successfully", null));
                case VarList.Not_Found:
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ResponseDTO(VarList.Not_Found, "Lawyer profile not found", null));
                default:
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(new ResponseDTO(VarList.Internal_Server_Error, "Error updating profile", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }

    @PutMapping("/update-client")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ResponseDTO> updateClientProfile(@RequestBody ClientUpdateDTO clientUpdateDTO,
                                                           @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String email = userDetails.getUsername(); // Email from JWT token
            int res = userService.updateClientProfile(email, clientUpdateDTO);

            if (res == VarList.OK) {
                return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Profile updated successfully", null));
            } else if (res == VarList.Not_Found) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO(VarList.Not_Found, "Client profile not found", null));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ResponseDTO(VarList.Internal_Server_Error, "Error updating profile", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }

    @PutMapping("/update-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> updateAdminProfile(@RequestBody AdminUpdateDTO adminUpdateDTO,
                                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String email = userDetails.getUsername(); // Email from JWT token
            int res = userService.updateAdminProfile(email, adminUpdateDTO);

            if (res == 200) {
                return ResponseEntity.ok(new ResponseDTO(200, "Profile updated successfully", null));
            } else if (res == 404) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO(404, "Admin profile not found", null));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ResponseDTO(500, "Error updating profile", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(500, e.getMessage(), null));
        }
    }
    @PostMapping(value = "/delete-lawyer-account")
    @PreAuthorize("hasRole('LAWYER')") // Restrict to lawyers only
    public ResponseEntity<ResponseDTO> deleteLawyerAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid LawyerDTO lawyerDTO) {
        try {
            String authenticatedEmail = userDetails.getUsername(); // Email from JWT
            if (!authenticatedEmail.equals(lawyerDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ResponseDTO(VarList.Forbidden, "You can only delete your own account", null));
            }

            int res = userService.deleteLawyerByEmail(lawyerDTO.getEmail());
            if (res == VarList.OK) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ResponseDTO(VarList.OK, "Account deleted successfully", null));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO(VarList.Not_Found, "Lawyer not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }


    @PostMapping(value = "/delete-client-account")
    @PreAuthorize("hasRole('CLIENT')") // Restrict to lawyers only
    public ResponseEntity<ResponseDTO> deleteClientAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ClientDTO clientDTO) {
        try {
            String authenticatedEmail = userDetails.getUsername(); // Email from JWT
            if (!authenticatedEmail.equals(clientDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ResponseDTO(VarList.Forbidden, "You can only delete your own account", null));
            }

            int res = userService.deleteClientProfile(clientDTO.getEmail());
            if (res == VarList.OK) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ResponseDTO(VarList.OK, "Account deleted successfully", null));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO(VarList.Not_Found, "Lawyer not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }

    @PostMapping(value = "/delete-admin-account")
    @PreAuthorize("hasRole('ADMIN')") // Restrict to lawyers only
    public ResponseEntity<ResponseDTO> deleteAdminAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid AdminDTO adminDTO) {
        try {
            String authenticatedEmail = userDetails.getUsername(); // Email from JWT
            if (!authenticatedEmail.equals(adminDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ResponseDTO(VarList.Forbidden, "You can only delete your own account", null));
            }

            int res = userService.deleteAdminProfile(adminDTO.getEmail());
            if (res == VarList.OK) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ResponseDTO(VarList.OK, "Account deleted successfully", null));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO(VarList.Not_Found, "Lawyer not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }

    @GetMapping("/lawyers")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ResponseDTO> getAllLawyers() {
        try {
            List<LawyerDTO> lawyers = userService.getAllLawyers();
            return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Success", lawyers));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }

    @GetMapping("/lawyers-byProvinceDistrict")
    @PreAuthorize("hasRole('CLIENT')")

    public ResponseEntity<ResponseDTO> getLawyers(
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String district) {
        try {
            List<LawyerDTO> lawyers;
            if (province != null && district != null) {
                lawyers = userService.getLawyersByProvinceAndDistrict(province, district);
            } else {
                lawyers = userService.getAllLawyers();
            }
            return ResponseEntity.ok(new ResponseDTO(200, "Success", lawyers));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(500, e.getMessage(), null));
        }
    }
}
