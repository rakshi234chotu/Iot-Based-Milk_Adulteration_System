package milk_api.Repository;


import milk_api.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByMilkBoothManagerIdAndPaymentDateIsNull(Long milkBoothManagerId);

    List<Payment> findByUserId(Long userId);

    Optional<Payment> findById(Long id);

    List<Payment> findByUserIdAndPaymentDateIsNull(Long userId);

    List<Payment> findByUserIdAndPaymentDateIsNotNull(Long userId);

    List<Payment> findByMilkBoothManagerIdAndPaymentDateIsNotNull(Long managerId);



}
