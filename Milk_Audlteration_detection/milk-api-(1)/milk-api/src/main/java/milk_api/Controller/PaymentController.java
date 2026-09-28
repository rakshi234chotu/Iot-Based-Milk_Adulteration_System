package milk_api.Controller;

import jakarta.mail.internet.MimeMessage;
import milk_api.DTO.PaymentRequestDTO;
import milk_api.DTO.SimplePaymentRequestDTO;
import milk_api.Entity.MilkBoothManager;
import milk_api.Entity.MilkProduction;
import milk_api.Entity.Payment;
import milk_api.Entity.User;
import milk_api.Repository.MilkBoothManagerRepository;
import milk_api.Repository.MilkProductionRepository;
import milk_api.Repository.PaymentRepository;
import milk_api.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MilkBoothManagerRepository milkBoothManagerRepository;

    @Autowired
    private MilkProductionRepository milkProductionRepository;

    @Autowired
    private JavaMailSender mailSender;




    @PostMapping("/api/payment/user/request")
    public ResponseEntity<?> requestPayment(@RequestBody PaymentRequestDTO dto) {

        // 🔎 Find User
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔎 Find MilkBoothManager
        MilkBoothManager manager = milkBoothManagerRepository
                .findById(dto.getMilkBoothManagerId())
                .orElseThrow(() -> new RuntimeException("Milk Booth Manager not found"));

        // 🔎 Find MilkProduction records between dates
        List<MilkProduction> productions =
                milkProductionRepository
                        .findByUserIdAndDateBetweenAndPaymentRequestFalse(
                                dto.getUserId(),
                                dto.getFromDate(),
                                dto.getToDate()
                        );

        if (productions.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("No milk records found for selected date range");
        }

        // 💰 Calculate total amount
        double totalAmount = productions.stream()
                .mapToDouble(MilkProduction::getPrice) // make sure amount field exists
                .sum();

        // ✅ Mark paymentRequest = true
        productions.forEach(p -> p.setPaymentRequest(true));
        milkProductionRepository.saveAll(productions);

        // 🧾 Create Payment record
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setMilkBoothManager(manager);
        payment.setAmount(totalAmount);
        payment.setFromDate(dto.getFromDate());
        payment.setToDate(dto.getToDate());
        payment.setPaymentRequestDate(LocalDate.now());

        paymentRepository.save(payment);

        return ResponseEntity.ok("Payment request created successfully");
    }


    @PostMapping("/api/payment/request/all")
    public ResponseEntity<?> requestPaymentWithoutDate(
            @RequestBody SimplePaymentRequestDTO dto) {

        // 🔎 Find User
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔎 Find Manager
        MilkBoothManager manager = milkBoothManagerRepository
                .findById(dto.getMilkBoothManagerId())
                .orElseThrow(() -> new RuntimeException("Milk Booth Manager not found"));

        // 🔎 Find all unpaid milk productions
        List<MilkProduction> productions =
                milkProductionRepository
                        .findByUserIdAndPaymentRequestFalse(dto.getUserId());

        if (productions.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("No pending milk records found");
        }

        // 📅 Auto detect date range
        LocalDate fromDate = productions.stream()
                .map(MilkProduction::getDate)  // replace with your date field
                .min(LocalDate::compareTo)
                .get();

        LocalDate toDate = productions.stream()
                .map(MilkProduction::getDate)
                .max(LocalDate::compareTo)
                .get();

        // 💰 Calculate total amount
        double totalAmount = productions.stream()
                .mapToDouble(MilkProduction::getPrice) // make sure amount field exists
                .sum();

        // ✅ Mark paymentRequest = true
        productions.forEach(p -> p.setPaymentRequest(true));
        milkProductionRepository.saveAll(productions);

        // 🧾 Create Payment record
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setMilkBoothManager(manager);
        payment.setAmount(totalAmount);
        payment.setFromDate(fromDate);
        payment.setToDate(toDate);
        payment.setPaymentRequestDate(LocalDate.now());

        paymentRepository.save(payment);

        return ResponseEntity.ok("Payment request created successfully");
    }


    @GetMapping("/api/payment/pending/{managerId}")
    public ResponseEntity<?> getPendingPaymentsByManager(
            @PathVariable Long managerId) {

        List<Payment> payments =
                paymentRepository
                        .findByMilkBoothManagerIdAndPaymentDateIsNull(managerId);

        if (payments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No pending payments found");
        }

        return ResponseEntity.ok(payments);
    }

    @GetMapping("/api/payment/completed/{managerId}")
    public ResponseEntity<?> getCompletedPaymentsByManager(
            @PathVariable Long managerId) {

        List<Payment> payments =
                paymentRepository
                        .findByMilkBoothManagerIdAndPaymentDateIsNotNull(managerId);

        if (payments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No completed payments found");
        }

        return ResponseEntity.ok(payments);
    }



    @GetMapping("/api/payment/user/{userId}/pending")
    public ResponseEntity<?> getPendingPaymentsByUser(
            @PathVariable Long userId) {

        List<Payment> payments =
                paymentRepository
                        .findByUserIdAndPaymentDateIsNull(userId);

        if (payments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No pending payments found for this user");
        }

        return ResponseEntity.ok(payments);
    }

    @GetMapping("/api/payment/user/{userId}/completed")
    public ResponseEntity<?> getCompletedPaymentsByUser(
            @PathVariable Long userId) {

        List<Payment> payments =
                paymentRepository
                        .findByUserIdAndPaymentDateIsNotNull(userId);

        if (payments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No completed payments found for this user");
        }

        return ResponseEntity.ok(payments);
    }



    @PostMapping("/api/payment/make/{paymentId}")
    public ResponseEntity<?> makePayment(@PathVariable Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getPaymentDate() != null) {
            return ResponseEntity.badRequest()
                    .body("Payment already completed");
        }

        // ✅ Set payment date
        payment.setPaymentDate(LocalDate.now());
        paymentRepository.save(payment);

        // ✅ Update MilkProduction paymentStatus
        List<MilkProduction> productions =
                milkProductionRepository.findByUserIdAndDateBetween(
                        payment.getUser().getId(),
                        payment.getFromDate(),
                        payment.getToDate()
                );

        productions.forEach(p -> p.setPaymentStatus(true));
        milkProductionRepository.saveAll(productions);

        // ✅ Send Email
        sendPaymentEmail(
                payment.getUser().getEmail(),
                payment.getUser().getUsername(),
                payment.getAmount()
        );

        return ResponseEntity.ok("Payment completed successfully");
    }

    private void sendPaymentEmail(String toEmail, String username, Double amount) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("💰 Milk Payment Credited Successfully!");

            String htmlContent = String.format("""
                <div style="font-family: Arial, sans-serif; background:#f4f9ff; padding:20px;">
                  <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

                    <div style="background:linear-gradient(90deg,#4CAF50,#2E7D32); color:white; padding:20px; text-align:center;">
                      <h2>🎉 Payment Successful!</h2>
                    </div>

                    <div style="padding:30px; text-align:center;">
                      <h3>Hello %s 👋</h3>

                      <p style="font-size:16px; color:#555;">
                        Your milk payment has been processed successfully.
                      </p>

                      <div style="margin:20px 0; padding:20px; background:#e8f5e9; border-radius:8px;">
                        <h1 style="color:#2E7D32;">₹ %.2f</h1>
                        <p style="color:#333;">Credited to your bank account XXXX</p>
                      </div>

                      <p style="color:#777; font-size:14px;">
                        Thank you for supplying quality milk 🥛
                      </p>
                    </div>

                    <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#888;">
                      © 2026 Smart Milk Booth System
                    </div>

                  </div>
                </div>
                """, username, amount);

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}




