package milk_api.Controller;

import milk_api.DTO.PasswordUpdateRequest;
import milk_api.Entity.Admin;
import milk_api.Repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @PutMapping("/updatePasswordForAdmin")
    public ResponseEntity<String> updatePasswordForAd(@RequestBody PasswordUpdateRequest request) {
        // Validate input
        if (request.getNewPassword() == null || request.getOldPassword() == null || request.getConfirmPassword() == null) {
            return ResponseEntity.badRequest().body("Old password, new password, and confirm password are required.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("New password and confirm password do not match.");
        }

        // Find Admin user by email
        Optional<Admin> optionalAdmin = adminRepository.findByEmail(request.getEmail());
        if (optionalAdmin.isEmpty()) {
            return ResponseEntity.status(404).body("Admin user not found.");
        }

        Admin admin = optionalAdmin.get();

        // Validate old password
        if (!admin.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.badRequest().body("Invalid current password.");
        }

        // Update password
        admin.setPassword(request.getNewPassword());
        adminRepository.save(admin);

        return ResponseEntity.ok("Password updated successfully.");
    }
}
