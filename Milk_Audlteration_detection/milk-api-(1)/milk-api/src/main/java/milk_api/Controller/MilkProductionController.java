package milk_api.Controller;

import milk_api.DTO.MilkProductionRequestDTO;
import milk_api.Entity.MilkBoothManager;
import milk_api.Entity.MilkProduction;
import milk_api.Entity.Sensors;
import milk_api.Entity.User;
import milk_api.Repository.MilkBoothManagerRepository;
import milk_api.Repository.MilkProductionRepository;
import milk_api.Repository.SensorsRepository;
import milk_api.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class MilkProductionController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MilkBoothManagerRepository milkBoothManagerRepository;

    @Autowired
    private SensorsRepository sensorsRepository;

    @Autowired
    private MilkProductionRepository milkProductionRepository;


    @PostMapping("/api/milk-production")
    public ResponseEntity<?> createMilkProduction(
            @RequestBody MilkProductionRequestDTO request) {

        // 1️⃣ Validate User
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        // 2️⃣ Validate Manager
        Optional<MilkBoothManager> managerOpt =
                milkBoothManagerRepository.findById(request.getMilkBoothManagerId());

        if (managerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Milk Booth Manager not found");
        }

        // 3️⃣ Get Sensor Configuration
        List<Sensors> sensorsList = sensorsRepository.findAll();

        if (sensorsList.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Sensor configuration not found");
        }

        Sensors sensors = sensorsList.get(0);

        int failedSensors = 0;
        int totalSensors = 6;

        // 4️⃣ Sensor Validation

        if (request.getTemperature() < sensors.getTemperatureMin()
                || request.getTemperature() > sensors.getTemperatureMax()) {
            failedSensors++;
        }

        if (request.getRedFrequency() < sensors.getRedFrequencyMin()
                || request.getRedFrequency() > sensors.getRedFrequencyMax()) {
            failedSensors++;
        }

        if (request.getGreenFrequency() < sensors.getGreenFrequencyMin()
                || request.getGreenFrequency() > sensors.getGreenFrequencyMax()) {
            failedSensors++;
        }

        if (request.getBlueFrequency() < sensors.getBlueFrequencyMin()
                || request.getBlueFrequency() > sensors.getBlueFrequencyMax()) {
            failedSensors++;
        }

        if (request.getTurbidityValue() < sensors.getTurbidityValueMin()
                || request.getTurbidityValue() > sensors.getTurbidityValueMax()) {
            failedSensors++;
        }

        if (request.getPHValue() < sensors.getPHValueMin()
                || request.getPHValue() > sensors.getPHValueMax()) {
            failedSensors++;
        }

        // 5️⃣ Create Entity
        MilkProduction milkProduction = new MilkProduction();

        milkProduction.setUser(userOpt.get());
        milkProduction.setMilkBoothManager(managerOpt.get());
        milkProduction.setDate(request.getDate());
        milkProduction.setTime(request.getTime());

        milkProduction.setTemperature(request.getTemperature());
        milkProduction.setRedFrequency(request.getRedFrequency());
        milkProduction.setGreenFrequency(request.getGreenFrequency());
        milkProduction.setBlueFrequency(request.getBlueFrequency());
        milkProduction.setTurbidityValue(request.getTurbidityValue());
        milkProduction.setWeightGrams(request.getWeightGrams());
        milkProduction.setPHValue(request.getPHValue());

        // 6️⃣ Price Calculation
        double basePricePerLiter = 30.0;
        double deductionPerSensor = basePricePerLiter / totalSensors;

        double liters = request.getWeightGrams() / 1000.0;

        double finalPricePerLiter = basePricePerLiter - (failedSensors * deductionPerSensor);

        // Avoid negative price
        finalPricePerLiter = Math.max(finalPricePerLiter, 0);

        double totalPrice = liters * finalPricePerLiter;

        // Optional: round to 2 decimal places
        totalPrice = Math.round(totalPrice * 100.0) / 100.0;

        milkProduction.setPrice(totalPrice);

        // 7️⃣ Grade Logic
        if (failedSensors >= 4) {
            milkProduction.setMilkStatus("B Grade");
        } else {
            milkProduction.setMilkStatus("A Grade");
        }

        // 8️⃣ Default Flags
        milkProduction.setPaymentStatus(false);
        milkProduction.setPaymentRequest(false);

        // 9️⃣ Save
        MilkProduction saved = milkProductionRepository.save(milkProduction);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }


//    @PostMapping("/api/milk-production")
//    public ResponseEntity<?> createMilkProduction(
//            @RequestBody MilkProductionRequestDTO request) {
//
//        // 1️⃣ Validate User
//        Optional<User> userOpt = userRepository.findById(request.getUserId());
//        if (userOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body("User not found");
//        }
//
//        // 2️⃣ Validate Manager
//        Optional<MilkBoothManager> managerOpt =
//                milkBoothManagerRepository.findById(request.getMilkBoothManagerId());
//
//        if (managerOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body("Milk Booth Manager not found");
//        }
//
//        // 3️⃣ Get Sensor Configuration
//        List<Sensors> sensorsList = sensorsRepository.findAll();
//
//        if (sensorsList.isEmpty()) {
//            return ResponseEntity.badRequest()
//                    .body("Sensor configuration not found");
//        }
//
//        Sensors sensors = sensorsList.get(0); // assume only one config
//
//        boolean isPure = true;
//
//        // 4️⃣ Compare Ranges
//
//        if (request.getTemperature() < sensors.getTemperatureMin()
//                || request.getTemperature() > sensors.getTemperatureMax()) {
//            isPure = false;
//        }
//
//        if (request.getRedFrequency() < sensors.getRedFrequencyMin()
//                || request.getRedFrequency() > sensors.getRedFrequencyMax()) {
//            isPure = false;
//        }
//
//        if (request.getGreenFrequency() < sensors.getGreenFrequencyMin()
//                || request.getGreenFrequency() > sensors.getGreenFrequencyMax()) {
//            isPure = false;
//        }
//
//        if (request.getBlueFrequency() < sensors.getBlueFrequencyMin()
//                || request.getBlueFrequency() > sensors.getBlueFrequencyMax()) {
//            isPure = false;
//        }
//
//        if (request.getTurbidityValue() < sensors.getTurbidityValueMin()
//                || request.getTurbidityValue() > sensors.getTurbidityValueMax()) {
//            isPure = false;
//        }
//
//        if (request.getPHValue() < sensors.getPHValueMin()
//                || request.getPHValue() > sensors.getPHValueMax()) {
//            isPure = false;
//        }
//
//        // 5️⃣ Create MilkProduction Object
//
//        MilkProduction milkProduction = new MilkProduction();
//
//        milkProduction.setUser(userOpt.get());
//        milkProduction.setMilkBoothManager(managerOpt.get());
//        milkProduction.setDate(request.getDate());
//        milkProduction.setTime(request.getTime());
//
//        milkProduction.setTemperature(request.getTemperature());
//        milkProduction.setRedFrequency(request.getRedFrequency());
//        milkProduction.setGreenFrequency(request.getGreenFrequency());
//        milkProduction.setBlueFrequency(request.getBlueFrequency());
//        milkProduction.setTurbidityValue(request.getTurbidityValue());
//        milkProduction.setWeightGrams(request.getWeightGrams());
//        milkProduction.setPHValue(request.getPHValue());
//
//
//        // 6️⃣ Set Milk Status & Price
//
//        // Convert grams to liters
//        double liters = request.getWeightGrams() / 1000.0;
//
//        if (!isPure) {
//            milkProduction.setMilkStatus("NOT PURE");
//
//            milkProduction.setPrice(
//                    liters * sensors.getWeightGramsMin()
//            );
//
//        } else {
//            milkProduction.setMilkStatus("PURE");
//
//            milkProduction.setPrice(
//                    liters * sensors.getWeightGramsMax()
//            );
//        }
//
//
//        milkProduction.setPaymentStatus(false); // default
//        milkProduction.setPaymentRequest(false);
//
//        MilkProduction saved = milkProductionRepository.save(milkProduction);
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
//    }


    @GetMapping("/api/milk-production/all")
    public ResponseEntity<?> getAllMilkProductions() {

        List<MilkProduction> list = milkProductionRepository.findAll();

        if (list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No milk production records found");
        }

        return ResponseEntity.ok(list);
    }


    @GetMapping("/api/milk-production/user/{email}")
    public ResponseEntity<?> getByUserEmail(@PathVariable String email) {

        List<MilkProduction> list =
                milkProductionRepository.findByUserEmail(email);

        if (list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No milk production records found for this user");
        }

        return ResponseEntity.ok(list);
    }


    @GetMapping("/api/milk-production/manager/{email}")
    public ResponseEntity<?> getByManagerEmail(@PathVariable String email) {

        List<MilkProduction> list =
                milkProductionRepository.findByMilkBoothManagerEmail(email);

        if (list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No milk production records found for this manager");
        }

        return ResponseEntity.ok(list);
    }


    @GetMapping("/api/milk-production/user/{email}/payment-request-false")
    public ResponseEntity<?> getByUserEmailPaymentFalse(@PathVariable String email) {

        List<MilkProduction> list =
                milkProductionRepository.findByUserEmailAndPaymentRequest(email, false);

        if (list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No milk production records found with paymentRequest = false");
        }

        return ResponseEntity.ok(list);
    }


    @GetMapping("/api/milk-production/user/{email}/payment-request-true")
    public ResponseEntity<?> getByUserEmailPaymentTrue(@PathVariable String email) {

        List<MilkProduction> list =
                milkProductionRepository.findByUserEmailAndPaymentRequest(email, true);

        if (list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No milk production records found with paymentRequest = true");
        }

        return ResponseEntity.ok(list);
    }





}
