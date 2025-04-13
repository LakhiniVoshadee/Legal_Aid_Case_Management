package lk.ijse.legal_aid_and_case_management_system.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface CloudinaryService {
    Map uploadImage(MultipartFile file) throws IOException;
    void deleteImage(String publicId) throws IOException;
}
