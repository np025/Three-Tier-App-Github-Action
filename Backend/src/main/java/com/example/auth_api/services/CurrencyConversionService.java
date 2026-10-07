package com.example.auth_api.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
public class CurrencyConversionService {

    // Inject the URL from the application settings
    @Value("${exchange.rate.api.url}")
    private String exchangeRateApiUrl;

    private final RestTemplate restTemplate;

    public CurrencyConversionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Convert an amount from one currency to another.
     *
     * @param fromCurrency the source currency code (e.g., "USD")
     * @param toCurrency   the target currency code (e.g., "EUR")
     * @param amount       the amount to convert
     * @return the converted amount
     */
    public double convertCurrency(String fromCurrency, String toCurrency, double amount) {
        // Fetch the exchange rates for the base currency
        Map<String, Object> response = fetchExchangeRates(fromCurrency);
        Map<String, Double> rates = (Map<String, Double>) response.get("conversion_rates");

        if (!rates.containsKey(toCurrency)) {
            throw new IllegalArgumentException("Target currency not supported");
        }

        // Calculate and return the converted amount
        return amount * rates.get(toCurrency);
    }

    /**
     * Fetch exchange rates for a given base currency.
     *
     * @param baseCurrency the base currency code
     * @return the exchange rate data
     */
    private Map<String, Object> fetchExchangeRates(String baseCurrency) {
        String url = UriComponentsBuilder.fromUriString(exchangeRateApiUrl)
                .buildAndExpand(baseCurrency)
                .toUriString();

        return restTemplate.getForObject(url, Map.class);
    }
}
