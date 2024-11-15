package com.example.projectzomboidmodmanager.controller;

import com.example.projectzomboidmodmanager.model.ModDetails;
import com.example.projectzomboidmodmanager.service.WorkshopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@CrossOrigin(origins = {"https://pz.alisadco.com", "https://www.pz.alisadco.com", "https://another-allowed-origin.com", "http://localhost:3000"})
@RestController
@RequestMapping("/api/mods")
public class ZomboidModManagerController {

    private final WorkshopService workshopService;

    @Autowired
    public ZomboidModManagerController(WorkshopService workshopService) {
        this.workshopService = workshopService;
    }

    // Endpoint to get workshop IDs from a collectionId
    @GetMapping("/getWorkshopIds")
    public ResponseEntity<List<ModDetails>> getWorkshopIds(@RequestParam String collectionId) {
        try {
            // Get the list of workshop IDs from the collectionId
            List<String> workshopIds = workshopService.getWorkshopIds(collectionId);
            // Get the details of each mod based on the workshop IDs
            CompletableFuture<List<ModDetails>> modsDetailsFuture = workshopService.getModDetails(workshopIds);

            // Wait until the CompletableFuture is completed and get the result
            List<ModDetails> modsDetails = modsDetailsFuture.join();  // Blocks until result is ready

            // Return a successful response with mod details
            return ResponseEntity.ok(modsDetails);
        } catch (Exception e) {
            // If an error occurs, return an error response with status 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    // Endpoint to get mod details by workshop ID
    @GetMapping("/getModDetails")
    public ResponseEntity<ModDetails> getModDetails(@RequestParam String workshopID) {
        try {
            List<String> workshopIDs = new ArrayList<>();
            workshopIDs.add(workshopID);

            // Get mod details based on the workshop ID
            CompletableFuture<List<ModDetails>> modDetailsFuture = workshopService.getModDetails(workshopIDs);

            // Wait until the CompletableFuture is completed and get the result
            List<ModDetails> modsDetails = modDetailsFuture.join();  // Blocks until result is ready

            // Check if mod details are empty and return a 404 if not found
            if (modsDetails.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Return a successful response with the mod details
            return ResponseEntity.ok(modsDetails.get(0));
        } catch (Exception e) {
            // If an error occurs, return an error response with status 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
