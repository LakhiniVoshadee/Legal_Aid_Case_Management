package lk.ijse.legal_aid_and_case_management_system.controller;

import lk.ijse.legal_aid_and_case_management_system.dto.AppointmentDTO;
import lk.ijse.legal_aid_and_case_management_system.service.AppointmentService;
import lk.ijse.legal_aid_and_case_management_system.util.Enum.AppointmentStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/appointment")
@CrossOrigin(origins = "http://localhost:63342",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowCredentials = "true")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/schedule")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<AppointmentDTO> scheduleAppointment(@RequestBody AppointmentDTO appointmentDTO, Authentication authentication) {
        if (!appointmentDTO.getClientEmail().equals(authentication.getName())) {
            return ResponseEntity.status(403).build();
        }
        AppointmentDTO savedAppointment = appointmentService.scheduleAppointment(appointmentDTO);
        return ResponseEntity.ok(savedAppointment);
    }

    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<AppointmentDTO>> getClientAppointments(Authentication authentication) {
        List<AppointmentDTO> appointments = appointmentService.getClientAppointments(authentication.getName());
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/lawyer")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<List<AppointmentDTO>> getLawyerAppointments(Authentication authentication) {
        List<AppointmentDTO> appointments = appointmentService.getLawyerAppointments(authentication.getName());
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        List<AppointmentDTO> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<AppointmentDTO> updateAppointmentStatus(@PathVariable Long id, @RequestParam AppointmentStatus status, Authentication authentication) {
        if (status != AppointmentStatus.CONFIRMED && status != AppointmentStatus.REJECTED) {
            return ResponseEntity.badRequest().build();
        }
        AppointmentDTO updatedAppointment = appointmentService.updateAppointmentStatus(id, status, authentication.getName());
        return ResponseEntity.ok(updatedAppointment);
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('CLIENT', 'LAWYER')")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id, Authentication authentication) {
        appointmentService.cancelAppointment(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/manage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppointmentDTO> manageAppointment(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO, @RequestParam AppointmentStatus status) {
        AppointmentDTO updatedAppointment = appointmentService.manageAppointment(id, appointmentDTO, status);
        return ResponseEntity.ok(updatedAppointment);
    }
}