package lk.ijse.legal_aid_and_case_management_system;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LegalAidAndCaseManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(LegalAidAndCaseManagementSystemApplication.class, args);

    }
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

}
