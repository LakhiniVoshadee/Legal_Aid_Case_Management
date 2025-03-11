package lk.ijse.legal_aid_and_case_management_system.dto;

public class UserProfileUpdateDTO {
    private String name;
    private String email;
    private ProfileImageDTO profileImage;

    public UserProfileUpdateDTO() {
    }

    public UserProfileUpdateDTO(String name, String email, ProfileImageDTO profileImage) {
        this.name = name;
        this.email = email;
        this.profileImage = profileImage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ProfileImageDTO getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(ProfileImageDTO profileImage) {
        this.profileImage = profileImage;
    }
}
