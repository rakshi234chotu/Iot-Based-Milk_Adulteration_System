package milk_api.DTO;

import lombok.Data;

@Data
public class LoginRequestDTO {

    private String userType;   // USER / ADMIN / MANAGER
    private String email;
    private String password;
}
