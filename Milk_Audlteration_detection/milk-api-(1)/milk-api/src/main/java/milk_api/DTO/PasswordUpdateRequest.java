package milk_api.DTO;


import lombok.Data;


@Data
public class PasswordUpdateRequest {
    private String email;
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}
