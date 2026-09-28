package milk_api.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;
    private  String milkBooth;
    private  String mobile;
    private  String address;

    @ManyToOne
    @JoinColumn(name = "milkBoothManager_id") // foreign key column
    private MilkBoothManager milkBoothManager;
}
