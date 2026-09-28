package milk_api.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class MilkProduction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id") // foreign key column
    private User user;

    @ManyToOne
    @JoinColumn(name = "milkBoothManager_id") // foreign key column
    private MilkBoothManager milkBoothManager;

    private LocalDate date;

    private String time;   //morning or evening

    private Double temperature;
    private Integer redFrequency;
    private Integer greenFrequency;
    private Integer blueFrequency;
    private Double turbidityValue;
    private Double weightGrams;
    private Double pHValue;



    private  Double price;

    private boolean paymentStatus; // defult false
    private boolean paymentRequest;

    private String milkStatus; // pure or not pure


}
