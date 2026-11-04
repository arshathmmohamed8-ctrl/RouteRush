package com.routerush.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @Column(nullable = false)
    private LocalDateTime departureTime;

    @Column(nullable = false)
    private LocalDateTime arrivalTime;

    @Column(nullable = false)
    private BigDecimal fare;

    @Column(nullable = false)
    private Integer availableSeats;

    @ElementCollection
    @CollectionTable(name = "trip_boarding_points", joinColumns = @JoinColumn(name = "trip_id"))
    @Column(name = "point")
    private List<String> boardingPoints = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "trip_dropping_points", joinColumns = @JoinColumn(name = "trip_id"))
    @Column(name = "point")
    private List<String> droppingPoints = new ArrayList<>();

    @Column(nullable = false)
    private String status = "scheduled";

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public BigDecimal getFare() {
        return fare;
    }

    public void setFare(BigDecimal fare) {
        this.fare = fare;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public List<String> getBoardingPoints() {
        return boardingPoints;
    }

    public void setBoardingPoints(List<String> boardingPoints) {
        this.boardingPoints = boardingPoints;
    }

    public List<String> getDroppingPoints() {
        return droppingPoints;
    }

    public void setDroppingPoints(List<String> droppingPoints) {
        this.droppingPoints = droppingPoints;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
