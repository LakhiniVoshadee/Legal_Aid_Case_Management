package lk.ijse.legal_aid_and_case_management_system.util.Enum;

public enum CaseStatus {
    OPEN,        // Case is submitted and available for lawyers to accept
    ASSIGNED,    // Lawyer has been assigned (via acceptance or admin assignment)
    IN_PROGRESS, // Case is being worked on
    CLOSED       // Case is completed
}
