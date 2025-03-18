package lk.ijse.legal_aid_and_case_management_system.dto;

public class AdminUpdateDTO {
    private String admin_name;

    public AdminUpdateDTO() {}

    public AdminUpdateDTO(String admin_name) {
        this.admin_name = admin_name;
    }

    public String getAdmin_name() {
        return admin_name;
    }

    public void setAdmin_name(String admin_name) {
        this.admin_name = admin_name;
    }
}