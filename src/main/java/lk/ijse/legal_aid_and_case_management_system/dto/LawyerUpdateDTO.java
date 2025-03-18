package lk.ijse.legal_aid_and_case_management_system.dto;

public class LawyerUpdateDTO {
    private String lawyer_name;
    private String address;
    private String specialization;
    private Integer yearsOfExperience;
    private String barAssociationNumber;
    private String contactNumber;
    private String officeLocation;
    private String bio;
    private String province;
    private String district;

    // Default constructor
    public LawyerUpdateDTO() {}

    // Constructor with all fields (optional)
    public LawyerUpdateDTO(String lawyer_name, String address, String specialization, Integer yearsOfExperience,
                           String barAssociationNumber, String contactNumber, String officeLocation, String bio,
                           String province, String district) {
        this.lawyer_name = lawyer_name;
        this.address = address;
        this.specialization = specialization;
        this.yearsOfExperience = yearsOfExperience;
        this.barAssociationNumber = barAssociationNumber;
        this.contactNumber = contactNumber;
        this.officeLocation = officeLocation;
        this.bio = bio;
        this.province = province;
        this.district = district;
    }

    // Getters and Setters
    public String getLawyer_name() { return lawyer_name; }
    public void setLawyer_name(String lawyer_name) { this.lawyer_name = lawyer_name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
    public String getBarAssociationNumber() { return barAssociationNumber; }
    public void setBarAssociationNumber(String barAssociationNumber) { this.barAssociationNumber = barAssociationNumber; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getOfficeLocation() { return officeLocation; }
    public void setOfficeLocation(String officeLocation) { this.officeLocation = officeLocation; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
}