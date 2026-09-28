package milk_api.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Sensors {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double temperatureMin;
    private Double temperatureMax;

    private Double redFrequencyMin;
    private Double redFrequencyMax;

    private Double greenFrequencyMin;
    private Double greenFrequencyMax;

    private Double blueFrequencyMin;
    private Double blueFrequencyMax;

    private Double turbidityValueMin;
    private Double turbidityValueMax;

    private Double weightGramsMin;
    private Double weightGramsMax;

    private Double pHValueMin;
    private Double pHValueMax;

}
