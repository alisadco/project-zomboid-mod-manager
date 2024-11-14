package com.example.projectzomboidmodmanager.service;

import com.example.projectzomboidmodmanager.model.ModDetails;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class WorkshopService {

    @Value("${workshop.collection.url}")
    private String collectionUrlTemplate;  // Environment variable for the collection URL template
    @Value("${workshop.mod.url}")
    private String modUrlTemplate;  // Environment variable for the mod URL template

    private final RestTemplate restTemplate;

    public WorkshopService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    // Extracts individual Workshop item IDs from a collection page.
    public List<String> getWorkshopIds(String collectionId) {
        List<String> workshopIds = new ArrayList<>();
        String collectionUrl = String.format(collectionUrlTemplate, collectionId);

        try {
            String htmlContent = restTemplate.getForObject(collectionUrl, String.class);
            if (htmlContent != null) {
                Pattern pattern = Pattern.compile("id=\"sharedfile_(\\d+)\"");
                Matcher matcher = pattern.matcher(htmlContent);

                while (matcher.find()) {
                    workshopIds.add(matcher.group(1));
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch collection URL: " + collectionUrl);
        }
        return workshopIds;
    }


    // Method to get mod details for a list of workshopIds
    public List<ModDetails> getModDetails(List<String> workshopIds) {
        List<ModDetails> modDetailsList = new ArrayList<>();  // List to store all mod details

        for (String workshopId : workshopIds) {
            String url = modUrlTemplate + workshopId;

            try {
                // Fetch the HTML content for the mod's Steam Workshop page
                String htmlContent = restTemplate.getForObject(url, String.class);
                if (htmlContent != null) {
                    // Extract mod name from HTML content
                    String modName = collectModNames(htmlContent);
                    // Extract maps from HTML content
                    Set<String> modMaps = new HashSet<>();
                    collectMaps(htmlContent, modMaps);

                    if (modName != null) {
                        // Success: create ModDetails object with modName and maps
                        ModDetails modDetails = new ModDetails(modName, workshopId, List.copyOf(modMaps),getWorkshopThumbnail(workshopId));
                        modDetailsList.add(modDetails);
                    } else {
                        // Failure: return null for modName and maps
                        ModDetails modDetails = new ModDetails(null, workshopId, null,null);
                        modDetailsList.add(modDetails);
                    }
                } else {
                    // Failure: return null for modName and maps
                    ModDetails modDetails = new ModDetails(null, workshopId, null, null);
                    modDetailsList.add(modDetails);
                }
            } catch (Exception e) {
                // If an error occurs, return null for modName and maps
                ModDetails modDetails = new ModDetails(null, workshopId, null, null);
                modDetailsList.add(modDetails);
                System.err.println("Failed to fetch or process URL: " + url);
            }
        }

        // Return the list of ModDetails (including failures as null)
        return modDetailsList;
    }

    // Helper method to collect mod names from the HTML content
    private String collectModNames(String html) {
        Pattern modNamePattern = Pattern.compile("(?i)(Mod ?ID|MID): *(\\w+)");
        Matcher matcher = modNamePattern.matcher(html);
        if (matcher.find()) {
            return matcher.group(2).trim();  // Return the mod name if found
        }
        return null;  // Return null if no mod name found
    }

    // Helper method to collect map names from the HTML content
    private void collectMaps(String html, Set<String> maps) {
        Pattern mapPattern = Pattern.compile("(?i)(Map ?Folder|Folder|Map): ([\\w. ]+)");
        Matcher matcher = mapPattern.matcher(html);
        while (matcher.find()) {
            maps.add(matcher.group(2).trim());
        }
    }
    public String getWorkshopThumbnail(String workshopId) {
        String thumbnailUrl = "/placeholder.svg";  // Default placeholder

        try {
            String url = modUrlTemplate + workshopId;
            String htmlContent = restTemplate.getForObject(url, String.class);

            if (htmlContent != null) {
                Document document = Jsoup.parse(htmlContent);
                Element imgElement = document.getElementById("previewImageMain");

                if (imgElement != null) {
                    thumbnailUrl = imgElement.attr("src");
                }
            }
        } catch (Exception e) {
            System.err.println("Error while fetching the thumbnail for Workshop ID " + workshopId + ": " + e.getMessage());
        }

        return thumbnailUrl;
    }
}