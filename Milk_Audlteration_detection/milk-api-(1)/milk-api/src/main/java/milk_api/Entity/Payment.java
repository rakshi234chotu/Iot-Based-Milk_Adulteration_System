package milk_api.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id") // foreign key column
    private User user;

    @ManyToOne
    @JoinColumn(name = "milkBoothManager_id") // foreign key column
    private MilkBoothManager milkBoothManager;

    private Double amount;

    private LocalDate fromDate;
    private LocalDate toDate;

    private  LocalDate paymentRequestDate;
    private  LocalDate paymentDate;


}
