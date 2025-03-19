package lk.ijse.legal_aid_and_case_management_system.dto;

public class AdminDTO {
    private String email;
    private String admin_name;

    public AdminDTO() {
    }

    public AdminDTO(String email, String admin_name) {
        this.email = email;
        this.admin_name = admin_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAdmin_name() {
        return admin_name;
    }

    public void setAdmin_name(String admin_name) {
        this.admin_name = admin_name;
    }
}
