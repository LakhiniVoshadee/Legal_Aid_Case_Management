package lk.ijse.legal_aid_and_case_management_system.controller;

import lk.ijse.legal_aid_and_case_management_system.dto.AuthDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.ResponseDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.UserDTO;
import lk.ijse.legal_aid_and_case_management_system.service.impl.UserServiceImpl;
import lk.ijse.legal_aid_and_case_management_system.util.JwtUtil;
import lk.ijse.legal_aid_and_case_management_system.util.VarList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin(origins = "http://localhost:63342")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserServiceImpl userService;
    private final ResponseDTO responseDTO;

    //constructor injection
    public AuthController(JwtUtil jwtUtil, AuthenticationManager authenticationManager, UserServiceImpl userService, ResponseDTO responseDTO) {
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.responseDTO = responseDTO;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<ResponseDTO> authenticate(@RequestBody UserDTO userDTO) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDTO.getEmail(), userDTO.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDTO(VarList.Unauthorized, "Invalid Credentials", e.getMessage()));
        }

        UserDTO loadedUser = userService.loadUserDetailsByUsername(userDTO.getEmail());
        if (loadedUser == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ResponseDTO(VarList.Conflict, "Authorization Failure! Please Try Again", null));
        }

        String token = jwtUtil.generateToken(loadedUser);
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ResponseDTO(VarList.Conflict, "Authorization Failure! Please Try Again", null));
        }

        AuthDTO authDTO = new AuthDTO();
        authDTO.setEmail(loadedUser.getEmail());
        authDTO.setToken(token);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseDTO(VarList.Created, "Success", authDTO));
    }

    @GetMapping("/userRole")
    public ResponseEntity<Map<String, String>> getUserRole(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractUsername(token.substring(7)); // Remove 'Bearer ' prefix
        UserDTO user = userService.loadUserDetailsByUsername(email);

        if (user != null) {
            Map<String, String> response = new HashMap<>();
            response.put("role", user.getRole()); // Assuming `getRole()` returns "ADMIN", "LAWYER", or "CLIENT"
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


}