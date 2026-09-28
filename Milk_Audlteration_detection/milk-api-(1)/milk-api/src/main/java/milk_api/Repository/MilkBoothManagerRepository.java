package milk_api.Repository;

import milk_api.Entity.MilkBoothManager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MilkBoothManagerRepository extends JpaRepository<MilkBoothManager, Long> {

    Optional<MilkBoothManager> findByEmail(String email);

    boolean existsByEmail(String email);
}
