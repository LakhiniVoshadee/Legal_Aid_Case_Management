package lk.ijse.legal_aid_and_case_management_system.dto;

public class ProfileImageDTO {
    private String imageUrl;

    public ProfileImageDTO() {
    }

    public ProfileImageDTO(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
