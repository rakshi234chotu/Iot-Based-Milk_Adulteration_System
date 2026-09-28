package milk_api.Repository;

import milk_api.Entity.Sensors;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SensorsRepository extends JpaRepository<Sensors, Long> {

}
