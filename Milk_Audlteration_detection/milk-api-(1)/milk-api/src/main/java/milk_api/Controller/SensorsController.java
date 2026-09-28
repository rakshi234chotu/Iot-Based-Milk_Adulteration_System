package milk_api.Controller;


import milk_api.Entity.Sensors;
import milk_api.Repository.SensorsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sensors")
@CrossOrigin("*")
public class SensorsController {

    @Autowired
    private SensorsRepository sensorsRepository;

    // 1️⃣ CREATE Sensor Range
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Sensors sensor) {

        // Null check
        if (sensor.getTemperatureMin() == null || sensor.getTemperatureMax() == null ||
                sensor.getRedFrequencyMin() == null || sensor.getRedFrequencyMax() == null ||
                sensor.getGreenFrequencyMin() == null || sensor.getGreenFrequencyMax() == null ||
                sensor.getBlueFrequencyMin() == null || sensor.getBlueFrequencyMax() == null ||
                sensor.getTurbidityValueMin() == null || sensor.getTurbidityValueMax() == null ||
                sensor.getWeightGramsMin() == null || sensor.getWeightGramsMax() == null ||
                sensor.getPHValueMin() == null || sensor.getPHValueMax() == null) {

            return ResponseEntity.badRequest().body("All sensor Min and Max values are required");
        }

        // Individual Min > Max validation
        if (sensor.getTemperatureMin() > sensor.getTemperatureMax()) {
            return ResponseEntity.badRequest().body("Temperature Min cannot be greater than Max");
        }

        if (sensor.getRedFrequencyMin() > sensor.getRedFrequencyMax()) {
            return ResponseEntity.badRequest().body("Red Frequency Min cannot be greater than Max");
        }

        if (sensor.getGreenFrequencyMin() > sensor.getGreenFrequencyMax()) {
            return ResponseEntity.badRequest().body("Green Frequency Min cannot be greater than Max");
        }

        if (sensor.getBlueFrequencyMin() > sensor.getBlueFrequencyMax()) {
            return ResponseEntity.badRequest().body("Blue Frequency Min cannot be greater than Max");
        }

        if (sensor.getTurbidityValueMin() > sensor.getTurbidityValueMax()) {
            return ResponseEntity.badRequest().body("Turbidity Min cannot be greater than Max");
        }

        if (sensor.getWeightGramsMin() > sensor.getWeightGramsMax()) {
            return ResponseEntity.badRequest().body("Weight Min cannot be greater than Max");
        }

        if (sensor.getPHValueMin() > sensor.getPHValueMax()) {
            return ResponseEntity.badRequest().body("pH Min cannot be greater than Max");
        }

        Sensors saved = sensorsRepository.save(sensor);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }


    // 2️⃣ READ All Sensor Configurations
    @GetMapping
    public ResponseEntity<?> getAll() {

        List<Sensors> sensorsList = sensorsRepository.findAll();

        if (sensorsList.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .body("No sensor configurations found");
        }

        return ResponseEntity.ok(sensorsList);
    }

    // 3️⃣ UPDATE Sensor Configuration
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody Sensors sensor) {

        Optional<Sensors> optional = sensorsRepository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Sensor configuration not found");
        }

        // Same Min > Max validations
        if (sensor.getTemperatureMin() > sensor.getTemperatureMax()) {
            return ResponseEntity.badRequest().body("Temperature Min cannot be greater than Max");
        }

        if (sensor.getRedFrequencyMin() > sensor.getRedFrequencyMax()) {
            return ResponseEntity.badRequest().body("Red Frequency Min cannot be greater than Max");
        }

        if (sensor.getGreenFrequencyMin() > sensor.getGreenFrequencyMax()) {
            return ResponseEntity.badRequest().body("Green Frequency Min cannot be greater than Max");
        }

        if (sensor.getBlueFrequencyMin() > sensor.getBlueFrequencyMax()) {
            return ResponseEntity.badRequest().body("Blue Frequency Min cannot be greater than Max");
        }

        if (sensor.getTurbidityValueMin() > sensor.getTurbidityValueMax()) {
            return ResponseEntity.badRequest().body("Turbidity Min cannot be greater than Max");
        }

        if (sensor.getWeightGramsMin() > sensor.getWeightGramsMax()) {
            return ResponseEntity.badRequest().body("Weight Min cannot be greater than Max");
        }

        if (sensor.getPHValueMin() > sensor.getPHValueMax()) {
            return ResponseEntity.badRequest().body("pH Min cannot be greater than Max");
        }

        Sensors existing = optional.get();

        existing.setTemperatureMin(sensor.getTemperatureMin());
        existing.setTemperatureMax(sensor.getTemperatureMax());

        existing.setRedFrequencyMin(sensor.getRedFrequencyMin());
        existing.setRedFrequencyMax(sensor.getRedFrequencyMax());

        existing.setGreenFrequencyMin(sensor.getGreenFrequencyMin());
        existing.setGreenFrequencyMax(sensor.getGreenFrequencyMax());

        existing.setBlueFrequencyMin(sensor.getBlueFrequencyMin());
        existing.setBlueFrequencyMax(sensor.getBlueFrequencyMax());

        existing.setTurbidityValueMin(sensor.getTurbidityValueMin());
        existing.setTurbidityValueMax(sensor.getTurbidityValueMax());

        existing.setWeightGramsMin(sensor.getWeightGramsMin());
        existing.setWeightGramsMax(sensor.getWeightGramsMax());

        existing.setPHValueMin(sensor.getPHValueMin());
        existing.setPHValueMax(sensor.getPHValueMax());

        return ResponseEntity.ok(sensorsRepository.save(existing));
    }



}
