package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lawyer")
public class Lawyer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lawyer_id;

    private String lawyer_name;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    public Lawyer() {
    }

    public Lawyer(Long lawyer_id, String lawyer_name, User user) {
        this.lawyer_id = lawyer_id;
        this.lawyer_name = lawyer_name;
        this.user = user;
    }

    public Long getLawyer_id() {
        return lawyer_id;
    }

    public void setLawyer_id(Long lawyer_id) {
        this.lawyer_id = lawyer_id;
    }

    public String getLawyer_name() {
        return lawyer_name;
    }

    public void setLawyer_name(String lawyer_name) {
        this.lawyer_name = lawyer_name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
