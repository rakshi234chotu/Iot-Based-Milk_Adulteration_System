package milk_api.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PaymentRequestDTO {

    private Long userId;
    private Long milkBoothManagerId;
    private LocalDate fromDate;
    private LocalDate toDate;
}

