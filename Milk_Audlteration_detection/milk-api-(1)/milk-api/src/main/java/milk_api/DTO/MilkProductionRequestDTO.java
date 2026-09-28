package milk_api.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MilkProductionRequestDTO {

    private Long userId;
    private Long milkBoothManagerId;

    private LocalDate date;
    private String time;

    private Double temperature;
    private Integer redFrequency;
    private Integer greenFrequency;
    private Integer blueFrequency;
    private Double turbidityValue;
    private Double weightGrams;
    private Double pHValue;
}
