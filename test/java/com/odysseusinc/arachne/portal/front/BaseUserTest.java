package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import com.odysseusinc.arachne.portal.front.utils.Utils;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.HttpClientBuilder;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.openqa.selenium.By;
import org.openqa.selenium.NotFoundException;

public abstract class BaseUserTest extends BaseTest {
    protected static final String FIRSTNAME_PLACEHOLDER = "First Name*";
    protected static final String MIDDLENAME_PLACEHOLDER = "Middle Name";
    protected static final String LASTNAME_PLACEHOLDER = "Last Name*";
    protected static final String EMAIL_PLACEHOLDER = "Email*";
    protected static final String PASSWORD_PLACEHOLDER = "Password*";
    protected static final ImmutableMap<String, String> REGISTER_FORM_DATA;

    static {
        REGISTER_FORM_DATA = ImmutableMap.<String, String>builder()
                .put(FIRSTNAME_PLACEHOLDER, "Bender")
                .put(MIDDLENAME_PLACEHOLDER, "Bending")
                .put(LASTNAME_PLACEHOLDER, "Rodriguez")
                .put(EMAIL_PLACEHOLDER, "bender.rodriguez@osysseusinc.com")
                .put(PASSWORD_PLACEHOLDER, "funguypassword")
                .put("Confirm password*", "funguypassword")
                .build();
    }

    protected static final String INITIAL_ADRESS_STRING = "Address line 1, Address line 2";
    protected static final String INITIAL_CITY_STRING = "City, State, Zip";
    protected static final String INITIAL_COUNTRY_STRING = "Country";
    protected static final String INITIAL_CONTACTS_STRING = "Office phone, Mobile, Contact email";

    @BeforeClass
    public static void beforeBaseUserTests() throws IOException {

        deleteMails();
    }

    @AfterClass
    public static void afterBaseUserTests() throws IOException {

        deleteMails();
    }

    protected static void deleteMails() throws IOException {

        final HttpDelete httpDeleteMessages = new HttpDelete(MAIL_SERVER_API_MESSAGES);
        HttpClientBuilder.create().build().execute(httpDeleteMessages);
    }

    protected static void fillRegisterForm() {

        driver.get(portalUrl());
        final By registerLink = ByBuilder.link("Register here");
        waitForPageLoad(driver, registerLink);
        driver.findElement(registerLink).click();
        final By registerButton = ByBuilder.button("Register");
        waitForPageLoad(driver, registerButton);

        REGISTER_FORM_DATA.forEach((placeholder, value) -> {
            driver.findElement(ByBuilder.input(placeholder)).sendKeys(value);
        });

        final By select = ByBuilder.select("Professional type");
        final By selectOption = ByBuilder.selectOption("Epidemiology");
        Utils.selectOption(driver, select, selectOption, null);

        driver.findElement(registerButton).click();
    }

    protected static By waitLoginPage() {

        final By loginButton = ByBuilder.button("Login");
        waitForPageLoad(driver, loginButton);
        return loginButton;
    }

    protected static By waitWelcome() {

        final By welcome = ByBuilder.byClassAndText("ac-auth__title", "Welcome");
        waitForPageLoad(driver, welcome);
        return welcome;
    }

    protected static void activateUser() throws IOException {

        final String link = getLinkFromMail();
        driver.get(link);
        final By loginPage = ByBuilder.byClassAndText(
                "ac-auth__descr",
                "Thank you for email confirmation. Now you can login."
        );
        waitForPageLoad(driver, loginPage);
    }

    protected static void logout() {

        waitFor(driver, ByBuilder.link("power_settings_new"));
        driver.findElement(ByBuilder.link("power_settings_new")).click();
        waitLoginPage();
    }
}
