package lk.ijse.legal_aid_and_case_management_system.controller;

import lk.ijse.legal_aid_and_case_management_system.dto.MessageDTO;
import lk.ijse.legal_aid_and_case_management_system.dto.ResponseDTO;
import lk.ijse.legal_aid_and_case_management_system.service.UserService;
import lk.ijse.legal_aid_and_case_management_system.util.JwtUtil;
import lk.ijse.legal_aid_and_case_management_system.util.VarList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/user")
@CrossOrigin(origins = "http://localhost:63342")
public class MessageController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public MessageController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/messages")
    @PreAuthorize("hasAnyRole('CLIENT', 'LAWYER')")
    public ResponseEntity<ResponseDTO> getMessages(
            @RequestParam String senderEmail,
            @RequestParam String recipientEmail,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (!userDetails.getUsername().equals(senderEmail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ResponseDTO(VarList.Forbidden, "Unauthorized access", null));
            }
            List<MessageDTO> messages = userService.getMessages(senderEmail, recipientEmail);
            return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Success", messages));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }
}
