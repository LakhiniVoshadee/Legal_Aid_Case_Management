package lk.ijse.legal_aid_and_case_management_system.service.impl;

import lk.ijse.legal_aid_and_case_management_system.dto.LawyerDTO;
import lk.ijse.legal_aid_and_case_management_system.entity.Lawyer;
import lk.ijse.legal_aid_and_case_management_system.repo.AdminRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.ClientRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.LawyerRepository;
import lk.ijse.legal_aid_and_case_management_system.repo.UserRepository;
import lk.ijse.legal_aid_and_case_management_system.service.ClientService;
import lk.ijse.legal_aid_and_case_management_system.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClientServiceImpl implements ClientService {
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




}
