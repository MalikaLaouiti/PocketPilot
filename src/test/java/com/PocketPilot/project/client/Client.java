package com.PocketPilot.project.client;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "client")
@Data // Getters & Setters in background
public class Client {

    @Id
    @Column(name = "idclient")
    @GeneratedValue
    private UUID idclient;

    @Column(unique = true, length = 8)
    private String cin;

    private String nom;

    private String prenom;

    @Column(name = "datenaissance")
    private LocalDate dateNaissance;

    private String telephone;

    private String email;

    private String adresse;

    private String profession;

    

}