package com.routerush.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class BookingRequestDto {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotNull(message = "Trip ID is required")
    private Long tripId;

    @NotBlank(message = "Boarding point is required")
    private String boardingPoint;

    @NotBlank(message = "Dropping point is required")
    private String droppingPoint;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @NotEmpty(message = "At least one passenger is required")
    private List<@Valid PassengerRequestDto> passengers;

    @NotEmpty(message = "Seat numbers are required")
    private List<@NotBlank String> seatNumbers;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public String getBoardingPoint() {
        return boardingPoint;
    }

    public void setBoardingPoint(String boardingPoint) {
        this.boardingPoint = boardingPoint;
    }

    public String getDroppingPoint() {
        return droppingPoint;
    }

    public void setDroppingPoint(String droppingPoint) {
        this.droppingPoint = droppingPoint;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public List<PassengerRequestDto> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerRequestDto> passengers) {
        this.passengers = passengers;
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }
}
