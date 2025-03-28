package lk.ijse.legal_aid_and_case_management_system.controller;

import lk.ijse.legal_aid_and_case_management_system.dto.AppointmentDTO;
import lk.ijse.legal_aid_and_case_management_system.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/api")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/appointments")
    @PreAuthorize("hasRole('CLIENT')") // Ensure only clients can access
    public ResponseEntity<AppointmentDTO> scheduleAppointment(
            @RequestBody AppointmentDTO appointmentDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Set client email from authenticated user
            appointmentDTO.setClientEmail(userDetails.getUsername());
            AppointmentDTO scheduledAppointment = appointmentService.scheduleAppointment(appointmentDTO);
            return ResponseEntity.ok(scheduledAppointment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // Could improve with an error DTO
        }
    }
}