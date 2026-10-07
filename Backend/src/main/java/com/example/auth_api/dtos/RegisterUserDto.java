package com.example.auth_api.dtos;

public class RegisterUserDto {
    private String fullName;
    private String email;
    private String password;

    // Getters
    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // Setters (Optional, if needed)
    public RegisterUserDto setFullName(String fullName) {
        this.fullName = fullName;
        return this;
    }

    public RegisterUserDto setEmail(String email) {
        this.email = email;
        return this;
    }

    public RegisterUserDto setPassword(String password) {
        this.password = password;
        return this;
    }
}
