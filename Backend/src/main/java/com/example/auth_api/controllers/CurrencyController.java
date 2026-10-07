package com.example.auth_api.controllers;

import com.example.auth_api.services.CurrencyConversionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/currency")
public class CurrencyController {

    @Autowired
    private CurrencyConversionService currencyConversionService;

    /**
     * Endpoint to convert between any two currencies.
     *
     * @param fromCurrency the source currency (e.g., "USD")
     * @param toCurrency   the target currency (e.g., "EUR")
     * @param amount       the amount to convert
     * @return the converted amount
     */
    @GetMapping("/convert")
    public double convertCurrency(
            @RequestParam String fromCurrency,
            @RequestParam String toCurrency,
            @RequestParam double amount) {
        return currencyConversionService.convertCurrency(fromCurrency, toCurrency, amount);
    }
}
