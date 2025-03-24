package lk.ijse.legal_aid_and_case_management_system.controller;

import lk.ijse.legal_aid_and_case_management_system.dto.LawyerDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.ResponseDTO;
import lk.ijse.legal_aid_and_case_management_system.service.UserService;
import lk.ijse.legal_aid_and_case_management_system.util.JwtUtil;
import lk.ijse.legal_aid_and_case_management_system.util.VarList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/user")
@CrossOrigin(origins = "http://localhost:63342")
public class ClientController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public ClientController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
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
