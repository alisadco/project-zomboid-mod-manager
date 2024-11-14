package com.example.projectzomboidmodmanager.model;


import java.util.List;

public class ModDetails {
    private String modName;
    private String workshopId;
    private List<String> maps;
    private String thumbnailUrl;

    // Constructors
    public ModDetails() {}

    public ModDetails(String modName, String workshopId, List<String> maps, String thumbnailUrl) {
        this.modName = modName;
        this.workshopId = workshopId;
        this.maps = maps;
        this.thumbnailUrl = thumbnailUrl;
    }

    // Getters and Setters
    public String getModName() {
        return modName;
    }

    public void setModName(String modName) {
        this.modName = modName;
    }
    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String modName) {
        this.thumbnailUrl = modName;
    }

    public String getWorkshopId() {
        return workshopId;
    }

    public void setWorkshopId(String workshopId) {
        this.workshopId = workshopId;
    }

    public List<String> getMaps() {
        return maps;
    }

    public void setMaps(List<String> maps) {
        this.maps = maps;
    }

    @Override
    public String toString() {
        return "ModDetails{" +
                "modName='" + modName + '\'' +
                ", workshopId='" + workshopId + '\'' +
                ", maps=" + maps +
                '}';
    }
}