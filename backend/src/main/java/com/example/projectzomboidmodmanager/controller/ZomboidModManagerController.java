package com.example.projectzomboidmodmanager.controller;


import com.example.projectzomboidmodmanager.model.ModDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.projectzomboidmodmanager.service.WorkshopService;

import java.util.ArrayList;
import java.util.List;

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
            List<ModDetails> modsDetails = workshopService.getModDetails(workshopIds);

            // Return a successful response with mod details
            return ResponseEntity.ok(modsDetails);
        } catch (Exception e) {
            // If an error occurs, return an error response with status 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
    @GetMapping("/getModDetails")
    public ResponseEntity<ModDetails> getModDetails(@RequestParam String workshopID) {
        try {
            List<String>workshopIDs = new ArrayList<>();
            workshopIDs.add(workshopID);
            ModDetails modsDetails = workshopService.getModDetails(workshopIDs).get(0);
            // Return a successful response with mod details
            return ResponseEntity.ok(modsDetails);
        } catch (Exception e) {
            // If an error occurs, return an error response with status 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
