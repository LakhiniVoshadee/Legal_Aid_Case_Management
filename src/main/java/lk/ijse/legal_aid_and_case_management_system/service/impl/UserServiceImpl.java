package lk.ijse.legal_aid_and_case_management_system.service.impl;

import ch.qos.logback.core.net.server.Client;
import lk.ijse.legal_aid_and_case_management_system.dto.*;
import lk.ijse.legal_aid_and_case_management_system.entity.Admin;
import lk.ijse.legal_aid_and_case_management_system.entity.Clients;
import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import lk.ijse.legal_aid_and_case_management_system.entity.User;
import lk.ijse.legal_aid_and_case_management_system.repo.AdminRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.ClientRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.LawyerRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.UserRepository;
import lk.ijse.legal_aid_and_case_management_system.service.UserService;
import lk.ijse.legal_aid_and_case_management_system.util.Enum.UserRole;
import lk.ijse.legal_aid_and_case_management_system.util.VarList;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserDetailsService, UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private LawyerRepository lawyerRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), getAuthority(user));
    }

    public UserDTO loadUserDetailsByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        return modelMapper.map(user, UserDTO.class);
    }

    private Set<SimpleGrantedAuthority> getAuthority(User user) {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();

        if (adminRepository.existsByUser(user)) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else if (clientRepository.existsByUser(user)) {
            authorities.add(new SimpleGrantedAuthority("ROLE_CLIENT"));
        } else if (lawyerRepository.existsByUser(user)) {
            authorities.add(new SimpleGrantedAuthority("ROLE_LAWYER"));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }
        return authorities;
    }

    @Override
    public UserDTO searchUser(String username) {
        if (userRepository.existsByEmail(username)) {
            User user = userRepository.findByEmail(username);
            return modelMapper.map(user, UserDTO.class);
        } else {
            return null;
        }
    }

    @Override
    public int deleteUserByEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            userRepository.deleteByEmail(email);
            return VarList.OK;
        } else {
            return VarList.Not_Acceptable;
        }
    }


    @Override
    public int saveUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            return VarList.Not_Acceptable;
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        User user = modelMapper.map(userDTO, User.class);
        user.setRole(userDTO.getRole().toUpperCase());
        userRepository.save(user);

        switch (userDTO.getRole().toUpperCase()) {
            case "ADMIN" -> {
                Admin admin = new Admin();
                admin.setUser(user);
                admin.setAdmin_name(userDTO.getAdmin_name());
                adminRepository.save(admin);
            }
            case "CLIENT" -> {
                Clients client = new Clients();
                client.setUser(user);
                client.setFull_name(userDTO.getFull_name());
                client.setPhone_number(userDTO.getPhone_number());
                client.setDate_of_birth(userDTO.getDate_of_birth());
                client.setAddress(userDTO.getAddress());
                client.setPreferred_language(userDTO.getPreferred_language());
                client.setGender(userDTO.getGender());
                client.setNIC(userDTO.getNIC());
                clientRepository.save(client);
            }
            case "LAWYER" -> {
                Lawyer lawyer = new Lawyer();
                lawyer.setUser(user);
                lawyer.setLawyer_name(userDTO.getLawyer_name());
                lawyer.setAddress(userDTO.getAddress());
                lawyer.setSpecialization(userDTO.getSpecialization());
                lawyer.setYearsOfExperience(userDTO.getYearsOfExperience());
                lawyer.setBarAssociationNumber(userDTO.getBarAssociationNumber());
                lawyer.setContactNumber(userDTO.getContactNumber());
                lawyer.setOfficeLocation(userDTO.getOfficeLocation());
                lawyer.setBio(userDTO.getBio());
                lawyer.setProvince(userDTO.getProvince());
                lawyer.setDistrict(userDTO.getDistrict());
                lawyerRepository.save(lawyer);
            }
            default -> {
                return VarList.Not_Acceptable;
            }
        }
        return VarList.Created;
    }
    @Override
    public int updateLawyerProfile(String email, LawyerUpdateDTO lawyerUpdateDTO) {
        if (!lawyerRepository.existsByUser_Email(email)) {
            return VarList.Not_Found;
        }

        Lawyer lawyer = lawyerRepository.findByUser_Email(email);

        // Update only non-null fields (partial update)
        if (lawyerUpdateDTO.getLawyer_name() != null) {
            lawyer.setLawyer_name(lawyerUpdateDTO.getLawyer_name());
        }
        if (lawyerUpdateDTO.getAddress() != null) {
            lawyer.setAddress(lawyerUpdateDTO.getAddress());
        }
        if (lawyerUpdateDTO.getSpecialization() != null) {
            lawyer.setSpecialization(lawyerUpdateDTO.getSpecialization());
        }
        if (lawyerUpdateDTO.getYearsOfExperience() != null) {
            lawyer.setYearsOfExperience(lawyerUpdateDTO.getYearsOfExperience());
        }
        if (lawyerUpdateDTO.getBarAssociationNumber() != null) {
            lawyer.setBarAssociationNumber(lawyerUpdateDTO.getBarAssociationNumber());
        }
        if (lawyerUpdateDTO.getContactNumber() != null) {
            lawyer.setContactNumber(lawyerUpdateDTO.getContactNumber());
        }
        if (lawyerUpdateDTO.getOfficeLocation() != null) {
            lawyer.setOfficeLocation(lawyerUpdateDTO.getOfficeLocation());
        }
        if (lawyerUpdateDTO.getBio() != null) {
            lawyer.setBio(lawyerUpdateDTO.getBio());
        }
        if (lawyerUpdateDTO.getProvince() != null) {
            lawyer.setProvince(lawyerUpdateDTO.getProvince());
        }
        if (lawyerUpdateDTO.getDistrict() != null) {
            lawyer.setDistrict(lawyerUpdateDTO.getDistrict());
        }

        lawyerRepository.save(lawyer);
        return VarList.OK;
    }
    @Override
    public int updateClientProfile(String email, ClientUpdateDTO clientUpdateDTO) {
        if (!clientRepository.existsByUser_Email(email)) {
            return VarList.Not_Found;
        }

        Clients client = clientRepository.findByUser_Email(email);

        // Update only non-null fields (partial update)
        if (clientUpdateDTO.getFull_name() != null) {
            client.setFull_name(clientUpdateDTO.getFull_name());
        }
        if (clientUpdateDTO.getPhone_number() != null) {
            client.setPhone_number(clientUpdateDTO.getPhone_number());
        }
        if (clientUpdateDTO.getDate_of_birth() != null) {
            client.setDate_of_birth(clientUpdateDTO.getDate_of_birth());
        }
        if (clientUpdateDTO.getAddress() != null) {
            client.setAddress(clientUpdateDTO.getAddress());
        }
        if (clientUpdateDTO.getPreferred_language() != null) {
            client.setPreferred_language(clientUpdateDTO.getPreferred_language());
        }
        if (clientUpdateDTO.getGender() != null) {
            client.setGender(clientUpdateDTO.getGender());
        }
        if (clientUpdateDTO.getNIC() != null) {
            client.setNIC(clientUpdateDTO.getNIC());
        }

        clientRepository.save(client);
        return VarList.OK;
    }
    @Override
    public int updateAdminProfile(String email, AdminUpdateDTO adminUpdateDTO) {
        if (!adminRepository.existsByUser_Email(email)) {
            return 404; // Admin not found
        }

        Admin admin = adminRepository.findByUser_Email(email);

        // Update admin_name if provided
        if (adminUpdateDTO.getAdmin_name() != null) {
            admin.setAdmin_name(adminUpdateDTO.getAdmin_name());
        }

        adminRepository.save(admin);
        return 200; // Success
    }
    @Override
    public int deleteLawyerByEmail(String email) {
        if (!userRepository.existsByEmail(email)) {
            return VarList.Not_Found;
        }

        User user = userRepository.findByEmail(email);
        if (!user.getRole().equals("LAWYER")) {
            return VarList.Forbidden; // Only lawyers can be deleted this way
        }

        // Delete Lawyer entity
        lawyerRepository.deleteByUser_Email(email);
        // Delete User entity
        userRepository.deleteByEmail(email);

        return VarList.OK;
    }
    @Override
    public int deleteClientProfile(String email) {
        if (!userRepository.existsByEmail(email)) {
            return VarList.Not_Found;
        }

        User user = userRepository.findByEmail(email);
        if (!user.getRole().equals("CLIENT")) {
            return VarList.Forbidden; // Only lawyers can be deleted this way
        }

        // Delete Lawyer entity
        clientRepository.deleteByUser_Email(email);
        // Delete User entity
        userRepository.deleteByEmail(email);

        return VarList.OK;
    }

    @Override
    public int deleteAdminProfile(String email) {
        if (!userRepository.existsByEmail(email)) {
            return VarList.Not_Found;
        }

        User user = userRepository.findByEmail(email);
        if (!user.getRole().equals("ADMIN")) {
            return VarList.Forbidden; // Only lawyers can be deleted this way
        }

        // Delete Lawyer entity
        adminRepository.deleteByUser_Email(email);
        // Delete User entity
        userRepository.deleteByEmail(email);

        return VarList.OK;
    }
    @Override
    public List<LawyerDTO> getAllLawyers() {
        List<Lawyer> lawyers = lawyerRepository.findAll();
        return lawyers.stream()
                .map(lawyer -> modelMapper.map(lawyer, LawyerDTO.class))
                .collect(Collectors.toList());
    }
    @Override
    public List<LawyerDTO> getLawyersByProvinceAndDistrict(String province, String district) {
        List<Lawyer> lawyers = lawyerRepository.findByProvinceAndDistrict(province, district);
        return lawyers.stream()
                .map(lawyer -> modelMapper.map(lawyer, LawyerDTO.class))
                .collect(Collectors.toList());
    }
}