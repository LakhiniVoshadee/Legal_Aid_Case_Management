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

import java.util.List;

@RestController
@RequestMapping("api/v1/api")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Existing endpoint for scheduling appointments
    @PostMapping("/appointments")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<AppointmentDTO> scheduleAppointment(
            @RequestBody AppointmentDTO appointmentDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            appointmentDTO.setClientEmail(userDetails.getUsername());
            AppointmentDTO scheduledAppointment = appointmentService.scheduleAppointment(appointmentDTO);
            return ResponseEntity.ok(scheduledAppointment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    // New endpoint for clients to view their appointments
    @GetMapping("/appointments/client")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> getClientAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String clientEmail = userDetails.getUsername();
            List<AppointmentDTO> appointments = appointmentService.getAppointmentsByClient(clientEmail);
            return ResponseEntity.ok(new ApiResponse<>(200, "Appointments retrieved successfully", appointments));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Error retrieving appointments: " + e.getMessage(), null));
        }
    }

    // New endpoint for lawyers to view their appointments
    @GetMapping("/appointments/lawyer")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<?> getLawyerAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String lawyerEmail = userDetails.getUsername();
            List<AppointmentDTO> appointments = appointmentService.getAppointmentsByLawyer(lawyerEmail);
            return ResponseEntity.ok(new ApiResponse<>(200, "Appointments retrieved successfully", appointments));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Error retrieving appointments: " + e.getMessage(), null));
        }
    }

    // Helper class for consistent API responses
    private static class ApiResponse<T> {
        private int code;
        private String message;
        private T data;

        public ApiResponse(int code, String message, T data) {
            this.code = code;
            this.message = message;
            this.data = data;
        }

        public int getCode() {
            return code;
        }

        public String getMessage() {
            return message;
        }

        public T getData() {
            return data;
        }
    }
}