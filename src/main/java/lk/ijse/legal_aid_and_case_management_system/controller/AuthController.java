package lk.ijse.legal_aid_and_case_management_system.controller;

import lk.ijse.legal_aid_and_case_management_system.dto.AuthDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.ResponseDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.UserDTO;
import lk.ijse.legal_aid_and_case_management_system.service.impl.UserServiceImpl;
import lk.ijse.legal_aid_and_case_management_system.util.JwtUtil;
import lk.ijse.legal_aid_and_case_management_system.util.VarList;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin(origins = "http://localhost:63342")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserServiceImpl userService;
    private final ResponseDTO responseDTO;

    @Value("${google.client-id}")
    private String googleClientId;

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
        String email = jwtUtil.extractUsername(token.substring(7));
        UserDTO user = userService.loadUserDetailsByUsername(email);

        if (user != null) {
            Map<String, String> response = new HashMap<>();
            response.put("role", user.getRole());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/google")
    public ResponseEntity<ResponseDTO> googleSignIn(@RequestBody Map<String, String> request) {
        try {
            String idTokenString = request.get("idToken");

            // Verify Google ID token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ResponseDTO(VarList.Unauthorized, "Invalid Google ID token", null));
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String role = "CLIENT"; // Default role for Google Sign-In (adjust as needed)

            // Check if user exists
            UserDTO existingUser = userService.loadUserDetailsByUsername(email);
            UserDTO userDTO;

            if (existingUser == null) {
                // Register new user
                userDTO = new UserDTO();
                userDTO.setEmail(email);
                userDTO.setName(name);
                userDTO.setRole(role);
                userDTO.setPassword("GOOGLE_AUTH_" + UUID.randomUUID().toString()); // Dummy password
                int res = userService.saveUser(userDTO);
                if (res != VarList.Created) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(new ResponseDTO(VarList.Internal_Server_Error, "Failed to register user", null));
                }
            } else {
                userDTO = existingUser;
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(userDTO);
            AuthDTO authDTO = new AuthDTO();
            authDTO.setEmail(userDTO.getEmail());
            authDTO.setToken(token);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseDTO(VarList.OK, "Google Sign-In successful", authDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }
}