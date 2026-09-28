package milk_api.DTO;

import lombok.Data;

@Data
public class SimplePaymentRequestDTO {
    private Long userId;
    private Long milkBoothManagerId;
}
