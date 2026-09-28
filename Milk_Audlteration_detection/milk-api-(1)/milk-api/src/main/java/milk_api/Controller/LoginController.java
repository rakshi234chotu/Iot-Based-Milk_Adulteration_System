package milk_api.Controller;

import milk_api.DTO.LoginRequestDTO;
import milk_api.Entity.Admin;
import milk_api.Entity.MilkBoothManager;
import milk_api.Entity.User;
import milk_api.Repository.AdminRepository;
import milk_api.Repository.MilkBoothManagerRepository;
import milk_api.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@CrossOrigin("*")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private MilkBoothManagerRepository milkBoothManagerRepository;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {

        if (request.getUserType() == null ||
                request.getEmail() == null ||
                request.getPassword() == null) {

            return ResponseEntity.badRequest()
                    .body("UserType, Email and Password are required");
        }

        String userType = request.getUserType().toUpperCase();

        switch (userType) {

            case "USER":

                Optional<User> user = userRepository.findByEmail(request.getEmail());

                if (user.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("User not found");
                }

                if (!user.get().getPassword().equals(request.getPassword())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Invalid password");
                }

                return ResponseEntity.ok(user.get());


            case "ADMIN":

                Optional<Admin> admin = adminRepository.findByEmail(request.getEmail());

                if (admin.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Admin not found");
                }

                if (!admin.get().getPassword().equals(request.getPassword())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Invalid password");
                }

                return ResponseEntity.ok(admin.get());


            case "MANAGER":

                Optional<MilkBoothManager> manager =
                        milkBoothManagerRepository.findByEmail(request.getEmail());

                if (manager.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Milk Booth Manager not found");
                }

                if (!manager.get().getPassword().equals(request.getPassword())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Invalid password");
                }

                return ResponseEntity.ok(manager.get());


            default:
                return ResponseEntity.badRequest()
                        .body("Invalid userType. Use USER / ADMIN / MANAGER");
        }
    }



}
