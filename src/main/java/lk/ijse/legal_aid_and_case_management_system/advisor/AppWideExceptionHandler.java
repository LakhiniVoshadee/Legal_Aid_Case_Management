package lk.ijse.legal_aid_and_case_management_system.advisor;


import lk.ijse.legal_aid_and_case_management_system.util.ResponseUtil;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class AppWideExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseUtil exceptionHandler(Exception e) {
        return new ResponseUtil(500,"e.getMessage()",null);
    }

}
