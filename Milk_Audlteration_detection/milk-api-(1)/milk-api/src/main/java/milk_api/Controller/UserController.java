package milk_api.Controller;

import milk_api.DTO.PasswordUpdateRequest;
import milk_api.Entity.User;
import milk_api.Repository.MilkBoothManagerRepository;
import milk_api.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private MilkBoothManagerRepository milkBoothManagerRepository;

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already registered");
        }

        User savedUser = userRepository.save(user);

        try {

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(savedUser.getEmail());
            message.setSubject("Milk Booth User Login Credentials");

            message.setText(
                    "Dear " + savedUser.getUsername() + ",\n\n" +
                            "Your account has been created successfully.\n\n" +
                            "Your MILK-ID: " + savedUser.getId() + "\n" +
                            "Login Email: " + savedUser.getEmail() + "\n" +
                            "Password: " + savedUser.getPassword() + "\n\n" +
                            "Please login and change your password.\n\n" +
                            "Regards,\nMilk Automation Team"
            );

            mailSender.send(message);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("User created but email sending failed: " + e.getMessage());
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User created successfully and credentials sent to email");
    }



    // 2️⃣ READ ALL USERS
    @GetMapping
    public ResponseEntity<?> getAllUsers() {

        List<User> users = userRepository.findAll();

        if (users.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .body("No users found");
        }

        return ResponseEntity.ok(users);
    }

    @GetMapping("/manager/{id}")
    public ResponseEntity<?> getUsersByManager(@PathVariable Long id) {

        List<User> users = userRepository.findByMilkBoothManagerId(id);

        if (users.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .body("No users found for this MilkBoothManager");
        }

        return ResponseEntity.ok(users);
    }



    // 3️⃣ UPDATE USER
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedData) {

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        User existing = optionalUser.get();

        // Email duplicate check (if changed)
        if (!existing.getEmail().equals(updatedData.getEmail()) &&
                userRepository.existsByEmail(updatedData.getEmail())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already in use");
        }

        existing.setUsername(updatedData.getUsername());
        existing.setEmail(updatedData.getEmail());
        existing.setPassword(updatedData.getPassword());
        existing.setMilkBooth(updatedData.getMilkBooth());
        existing.setMobile(updatedData.getMobile());
        existing.setAddress(updatedData.getAddress());

        return ResponseEntity.ok(userRepository.save(existing));
    }


    // 4️⃣ DELETE USER
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        if (!userRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        userRepository.deleteById(id);

        return ResponseEntity.ok("User deleted successfully");
    }


    @PutMapping("/updatePasswordForUser")
    public ResponseEntity<String> updatePasswordForLen(@RequestBody PasswordUpdateRequest request) {
        // Validate input
        if (request.getNewPassword() == null || request.getOldPassword() == null || request.getConfirmPassword() == null) {
            return ResponseEntity.badRequest().body("Old password, new password, and confirm password are required.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("New password and confirm password do not match.");
        }

        // Find  user by email
        Optional<User> optionalAdmin = userRepository.findByEmail(request.getEmail());
        if (optionalAdmin.isEmpty()) {
            return ResponseEntity.status(404).body(" User not found.");
        }

        User user = optionalAdmin.get();

        // Validate old password
        if (!user.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.badRequest().body("Invalid current password.");
        }

        // Update password
        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully.");
    }
}

