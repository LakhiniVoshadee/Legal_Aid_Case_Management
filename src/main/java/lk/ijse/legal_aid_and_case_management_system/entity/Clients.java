package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "client")
public class Clients {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long client_id;

    private String full_name;
    @Column(nullable = false)
    private String phone_number;
    private LocalDate date_of_birth;

    private String address;

    private String preferred_language;

    private String gender;

    private String NIC;

    private long lawyersCount;


    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    public Clients() {
    }

    public Clients(Long client_id, String full_name, String phone_number, LocalDate date_of_birth, String address, String preferred_language, String gender, String NIC, long lawyersCount, User user) {
        this.client_id = client_id;
        this.full_name = full_name;
        this.phone_number = phone_number;
        this.date_of_birth = date_of_birth;
        this.address = address;
        this.preferred_language = preferred_language;
        this.gender = gender;
        this.NIC = NIC;
        this.lawyersCount = lawyersCount;
        this.user = user;
    }

    public Long getClient_id() {
        return client_id;
    }

    public void setClient_id(Long client_id) {
        this.client_id = client_id;
    }

    public String getFull_name() {
        return full_name;
    }

    public void setFull_name(String full_name) {
        this.full_name = full_name;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public long getLawyersCount() {
        return lawyersCount;
    }

    public void setLawyersCount(long lawyersCount) {
        this.lawyersCount = lawyersCount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
