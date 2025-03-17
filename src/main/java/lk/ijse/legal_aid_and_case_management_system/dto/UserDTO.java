package lk.ijse.legal_aid_and_case_management_system.dto;

import lk.ijse.legal_aid_and_case_management_system.util.Enum.UserRole;
import lombok.*;

import java.time.LocalDate;


public class UserDTO {
    private String email;
    private String password;
    private String name;
    private String role; // Changed to UserRole enum
    private String admin_name;

    //Client
    private String full_name;
    private String phone_number;
    private LocalDate date_of_birth;
    private String preferred_language;
    private String gender;
    private String NIC;

    //Lawyer
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



    public UserDTO() {
    }


    public UserDTO(String email, String password, String name, String role, String admin_name, String full_name, String lawyer_name, String address, String specialization, Integer yearsOfExperience, String barAssociationNumber, String contactNumber, String officeLocation, String bio, String province, String district, String phone_number, LocalDate date_of_birth, String preferred_language, String gender, String NIC) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.admin_name = admin_name;
        this.full_name = full_name;
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
        this.phone_number = phone_number;
        this.date_of_birth = date_of_birth;
        this.preferred_language = preferred_language;
        this.gender = gender;
        this.NIC = NIC;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAdmin_name() {
        return admin_name;
    }

    public void setAdmin_name(String admin_name) {
        this.admin_name = admin_name;
    }

    public String getFull_name() {
        return full_name;
    }

    public void setFull_name(String full_name) {
        this.full_name = full_name;
    }

    public String getLawyer_name() {
        return lawyer_name;
    }

    public void setLawyer_name(String lawyer_name) {
        this.lawyer_name = lawyer_name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getBarAssociationNumber() {
        return barAssociationNumber;
    }

    public void setBarAssociationNumber(String barAssociationNumber) {
        this.barAssociationNumber = barAssociationNumber;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getOfficeLocation() {
        return officeLocation;
    }

    public void setOfficeLocation(String officeLocation) {
        this.officeLocation = officeLocation;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public LocalDate getDate_of_birth() {
        return date_of_birth;
    }

    public void setDate_of_birth(LocalDate date_of_birth) {
        this.date_of_birth = date_of_birth;
    }

    public String getPreferred_language() {
        return preferred_language;
    }

    public void setPreferred_language(String preferred_language) {
        this.preferred_language = preferred_language;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getNIC() {
        return NIC;
    }

    public void setNIC(String NIC) {
        this.NIC = NIC;
    }
}
