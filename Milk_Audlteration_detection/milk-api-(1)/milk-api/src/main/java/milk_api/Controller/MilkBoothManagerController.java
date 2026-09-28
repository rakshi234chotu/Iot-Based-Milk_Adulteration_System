package milk_api.Controller;

import milk_api.DTO.PasswordUpdateRequest;
import milk_api.Entity.MilkBoothManager;
import milk_api.Repository.MilkBoothManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/milk-booth-managers")
@CrossOrigin("*")
public class MilkBoothManagerController {

    @Autowired
    private MilkBoothManagerRepository repository;

    @Autowired
    private JavaMailSender mailSender;

    // 1️⃣ CREATE
    @PostMapping
    public ResponseEntity<?> create(@RequestBody MilkBoothManager manager) {

        if (repository.existsByEmail(manager.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already registered");
        }

        MilkBoothManager saved = repository.save(manager);

        try {

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(saved.getEmail());
            message.setSubject("Milk Booth Manager Login Credentials");

            message.setText(
                    "Dear " + saved.getName() + ",\n\n" +
                            "Your Milk Booth Manager account has been created successfully.\n\n" +
                            "Login Email: " + saved.getEmail() + "\n" +
                            "Password: " + saved.getPassword() + "\n\n" +
                            "Please login and change your password.\n\n" +
                            "Regards,\nMilk Automation Team"
            );

            mailSender.send(message);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Manager created but email sending failed: " + e.getMessage());
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Manager created successfully and credentials sent to email");
    }


    // 2️⃣ READ (All)
    @GetMapping
    public ResponseEntity<?> getAll() {

        List<MilkBoothManager> managers = repository.findAll();

        if (managers.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .body("No Milk Booth Managers found");
        }

        return ResponseEntity.ok(managers);
    }


    // 3️⃣ UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody MilkBoothManager updatedData) {

        Optional<MilkBoothManager> optionalManager = repository.findById(id);

        if (optionalManager.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Milk Booth Manager not found");
        }

        MilkBoothManager existing = optionalManager.get();

        existing.setName(updatedData.getName());
        existing.setEmail(updatedData.getEmail());
        existing.setPassword(updatedData.getPassword());
        existing.setMilkBooth(updatedData.getMilkBooth());
        existing.setMobile(updatedData.getMobile());
        existing.setAddress(updatedData.getAddress());

        MilkBoothManager saved = repository.save(existing);

        return ResponseEntity.ok(saved);
    }


    // 4️⃣ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Milk Booth Manager not found");
        }

        repository.deleteById(id);

        return ResponseEntity.ok("Milk Booth Manager deleted successfully");
    }


    @PutMapping("/updatePasswordForManager")
    public ResponseEntity<String> updatePasswordForManager(@RequestBody PasswordUpdateRequest request) {

        // Validate input
        if (request.getNewPassword() == null ||
                request.getOldPassword() == null ||
                request.getConfirmPassword() == null) {

            return ResponseEntity.badRequest()
                    .body("Old password, new password, and confirm password are required.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest()
                    .body("New password and confirm password do not match.");
        }

        // Find MilkBoothManager by email
        Optional<MilkBoothManager> optionalManager = repository.findByEmail(request.getEmail());

        if (optionalManager.isEmpty()) {
            return ResponseEntity.status(404)
                    .body("Milk Booth Manager not found.");
        }

        MilkBoothManager manager = optionalManager.get();

        // Validate old password
        if (!manager.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.badRequest()
                    .body("Invalid current password.");
        }

        // Update password
        manager.setPassword(request.getNewPassword());
        repository.save(manager);

        return ResponseEntity.ok("Password updated successfully.");
    }


}

