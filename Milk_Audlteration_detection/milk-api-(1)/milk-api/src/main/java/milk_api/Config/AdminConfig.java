package milk_api.Config;

import milk_api.Entity.Admin;
import milk_api.Repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminConfig {

    @Bean
    CommandLineRunner createDefaultAdmin(AdminRepository adminRepository) {
        return args -> {
            String defaultEmail = "admin@gmail.com";

            if (adminRepository.findByEmail(defaultEmail).isEmpty()) {
                Admin admin = new Admin();
                admin.setEmail(defaultEmail);
                admin.setPassword("123");
                adminRepository.save(admin);
                System.out.println("Default admin created.");
            }
        };
    }
}
