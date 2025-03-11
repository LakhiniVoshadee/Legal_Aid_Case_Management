package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "profile_image")
public class ProfileImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String imageUrl;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "uid")
    private User user;
}
