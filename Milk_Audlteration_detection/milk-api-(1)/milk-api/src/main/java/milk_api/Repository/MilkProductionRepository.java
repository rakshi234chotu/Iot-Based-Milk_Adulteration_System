package milk_api.Repository;

import milk_api.Entity.MilkProduction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MilkProductionRepository extends JpaRepository<MilkProduction, Long> {


    List<MilkProduction> findByUserEmail(String email);

    List<MilkProduction> findByMilkBoothManagerEmail(String email);

    List<MilkProduction> findByUserEmailAndPaymentRequest(String email, boolean paymentRequest);

    List<MilkProduction> findByUserIdAndDateBetweenAndPaymentRequestFalse(
            Long userId,
            LocalDate fromDate,
            LocalDate toDate
    );

    List<MilkProduction> findByUserIdAndPaymentRequestFalse(Long userId);


    List<MilkProduction> findByUserIdAndDateBetween(
            Long userId,
            LocalDate fromDate,
            LocalDate toDate
    );

}
