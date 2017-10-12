package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import com.odysseusinc.arachne.portal.front.utils.Utils;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import org.junit.Assert;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.testcontainers.shaded.com.google.common.collect.ImmutableMap;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class UserManagementTest extends BaseUserTest {

    protected static final String PERSONAL_SUMMARY_CARD = "Personal summary";
    protected static final String CONTACT_INFORMATION_CARD = "Contact Information";
    protected static final String GENERAL_INFORMATION_CARD = "General Information";
    protected static final String SKILLS_CARD = "Skills";
    protected static final String PUBLICATIONS_CARD = "Publications";
    protected static final String LINKS_CARD = "Links";
    protected static final String ABOUT_ME_PLACEHOLDER = "About me";
    protected static final String AFFILIATION_PLACEHOLDER = "Affiliation";
    protected static final String ADDRESS_LINE_1_PLACEHOLDER = "Address line 1";
    protected static final String ADDRESS_LINE_2_PLACEHOLDER = "Address line 2";
    protected static final String CITY_PLACEHOLDER = "City";
    protected static final String ZIP_CODE_PLACEHOLDER = "Zip code";
    protected static final String OFFICE_PHONE_PLACEHOLDER = "Office phone";
    protected static final String MOBILE_PHONE_PLACEHOLDER = "Mobile phone";
    protected static final String CONTACT_EMAIL_PLACEHOLDER = "Contact email";
    protected static final String ABOUT_ME_VALUE = "bending";
    protected static final String COMPANY_NAME_VALUE = "Odysseus inc";
    protected static final String CITY_VALUE = "Cambridge";
    protected static final String ADDRESS_LINE_1_VALUE = "245 First Street";
    protected static final String ADDRESS_LINE_2_VALUE = "Riverview II, 18th Floor";
    protected static final String ZIP_VALUE = "02142";
    protected static final String OFFICE_PHONE_VALUE = "+1 (888) 550-9968";
    protected static final String MOBILE_PHONE_VALUE = "+1 (339) 204-4044";
    protected static final String CONTACT_EMAIL_VALUE = "contact@odysseusinc.com";
    protected static final String SKILLS_VALUE = "No skills yet";
    protected static final String PUBLICATIONS_VALUE = "No publications yet";
    protected static final String LINKS_VALUE = "No links yet";

    @Test
    public void test01RegisterNewUser() throws InterruptedException, IOException {

        fillRegisterForm();
        final By welcome = waitWelcome();
        Assert.assertTrue(driver.findElement(welcome).isDisplayed());
    }

    @Test
    public void test02LoginNotEnabledUser() {

        loginPortal(REGISTER_FORM_DATA.get(EMAIL_PLACEHOLDER), REGISTER_FORM_DATA.get(PASSWORD_PLACEHOLDER));
        final By error = ByBuilder.text("Please verify your account using link in the email that was sent to you.");
        waitForPageLoad(driver, error);
        Assert.assertTrue(driver.findElement(error).isDisplayed());
    }


    @Test
    public void test03EnableAndLoginUser() throws IOException {

        activateUser();
        loginPortal(REGISTER_FORM_DATA.get(EMAIL_PLACEHOLDER), REGISTER_FORM_DATA.get(PASSWORD_PLACEHOLDER));
        final By avatar = By.className("ac-avatar");
        waitForPageLoad(driver, avatar);
        Assert.assertTrue(driver.findElement(avatar).isDisplayed());
        logout();
    }

    @Test
    public void test04RegisterNewUserWithExistingEmailTest() throws InterruptedException {

        fillRegisterForm();
        final By error = ByBuilder.formError("This email is already used");
        waitForPageLoad(driver, error);
        Assert.assertTrue(driver.findElement(error).isDisplayed());
    }

    @Test
    public void test05MakeNewUserAsAdmin() throws InterruptedException {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        final By adminSettingsTab = ByBuilder.sideBarTab("Admin settings");
        waitForPageLoad(driver, adminSettingsTab);
        driver.findElement(adminSettingsTab).click();

        final By addAdminBtn = ByBuilder.buttonAddIco();
        waitForPageLoad(driver, addAdminBtn);
        driver.findElement(addAdminBtn).click();

        final By modal = ByBuilder.modal("Add Admin user");
        waitFor(driver, modal);

        final WebElement modalWebElement = driver.findElement(modal);
        final WebElement input = modalWebElement.findElement(By.tagName("input"));
        input.sendKeys(REGISTER_FORM_DATA.get(FIRSTNAME_PLACEHOLDER),
                " ",
                REGISTER_FORM_DATA.get(LASTNAME_PLACEHOLDER),
                Keys.RETURN);
        modalWebElement.findElement(ByBuilder.button("Add")).click();
        final By adminEmail = ByBuilder.byClassAndText("ac-admin-panel-admin-list-table__email", REGISTER_FORM_DATA.get(EMAIL_PLACEHOLDER));
        waitForPageLoad(driver, adminEmail);
        Assert.assertTrue(driver.findElement(adminEmail).isDisplayed());
        logout();
    }

    @Test
    public void test06EditUserProfile() {

        loginPortal(REGISTER_FORM_DATA.get(EMAIL_PLACEHOLDER), REGISTER_FORM_DATA.get(PASSWORD_PLACEHOLDER));
        By avatar = By.className("ac-avatar");
        driver.findElement(avatar).click();
        By user_profile = ByBuilder.text("User Profile");
        waitFor(driver, user_profile);
        driver.findElement(user_profile).click();

        String toolbarName = String.format("%s %s %s",
                REGISTER_FORM_DATA.get(FIRSTNAME_PLACEHOLDER),
                REGISTER_FORM_DATA.get(MIDDLENAME_PLACEHOLDER),
                REGISTER_FORM_DATA.get(LASTNAME_PLACEHOLDER)
        );
        Utils.waitForPageLoad(driver, ByBuilder.toolbar(toolbarName));
        List<WebElement> viewCards = driver.findElements(By.className("ac-profile-view__card"));

        Consumer<WebElement> generalInformationFunction = webElement -> {
            select("Epidemiology", "Medical", null);
            fillInput(AFFILIATION_PLACEHOLDER, COMPANY_NAME_VALUE);
        };
        Consumer<WebElement> contactInformationFunction = webElement -> {
            fillInput(ADDRESS_LINE_1_PLACEHOLDER, ADDRESS_LINE_1_VALUE);
            fillInput(ADDRESS_LINE_2_PLACEHOLDER, ADDRESS_LINE_2_VALUE);
            fillInput(CITY_PLACEHOLDER, CITY_VALUE);
            fillInput(ZIP_CODE_PLACEHOLDER, ZIP_VALUE);
//            select("Country", "United States of America (the)", null);
//            select("State", "Massachusetts", null);
            fillInput(OFFICE_PHONE_PLACEHOLDER, OFFICE_PHONE_VALUE);
            fillInput(MOBILE_PHONE_PLACEHOLDER, MOBILE_PHONE_VALUE);
            fillInput(CONTACT_EMAIL_PLACEHOLDER, CONTACT_EMAIL_VALUE);
        };

        Map<String, Consumer<WebElement>> functions = ImmutableMap.<String, Consumer<WebElement>>builder()
                .put(GENERAL_INFORMATION_CARD, generalInformationFunction)
                .put(CONTACT_INFORMATION_CARD, contactInformationFunction)
                .put(PERSONAL_SUMMARY_CARD, webElement -> webElement.findElement(ByBuilder.textArea(ABOUT_ME_PLACEHOLDER)).sendKeys(ABOUT_ME_VALUE))
                .build();

        functions.forEach((key, value) -> {
            viewCards.forEach(card -> {
                try {
                    if (card.findElement(ByBuilder.text(key)).isDisplayed()) {
                        clickEdit(card);
                        value.accept(card);
                        card.findElement(ByBuilder.button("Add")).click();
                    }
                } catch (NoSuchElementException ignored) {
                }
            });
        });
        logout();
    }

    @Test
    public void test07ShowUserProfileThroughExpertFinder() {

        loginPortal(REGISTER_FORM_DATA.get(EMAIL_PLACEHOLDER), REGISTER_FORM_DATA.get(PASSWORD_PLACEHOLDER));
        final By expertFinderToolbar = ByBuilder.sideBarTab("Expert Finder");
        driver.findElement(expertFinderToolbar).click();
        Utils.waitForPageLoad(driver, ByBuilder.toolbar("Expert finder"));
        String userName = String.format("%s %s %s",
                REGISTER_FORM_DATA.get(FIRSTNAME_PLACEHOLDER),
                REGISTER_FORM_DATA.get(MIDDLENAME_PLACEHOLDER),
                REGISTER_FORM_DATA.get(LASTNAME_PLACEHOLDER)
        );
        driver.findElement(ByBuilder.text(userName)).click();
        Utils.waitForPageLoad(driver, ByBuilder.toolbar(userName));

        List<WebElement> viewCards = driver.findElements(By.className("ac-profile-view__card"));
        final Consumer<WebElement>  generalInformationFunction = webElement -> {
            Assert.assertTrue(webElement.findElement(ByBuilder.text("Medical")).isDisplayed());
            Assert.assertTrue(webElement.findElement(ByBuilder.text(COMPANY_NAME_VALUE)).isDisplayed());
        };
        final Consumer<WebElement> contactInformationFunction = webElement -> {
            Assert.assertTrue(webElement.findElement(ByBuilder.text(ADDRESS_LINE_1_VALUE + ", " + ADDRESS_LINE_2_VALUE)).isDisplayed());
            Assert.assertTrue(webElement.findElement(ByBuilder.text(CITY_VALUE + ", " + ZIP_VALUE)).isDisplayed());
//          Assert.assertTrue(webElement.findElement(ByBuilder.text("United States of America (the)")).isDisplayed());
//          Assert.assertTrue(webElement.findElement(ByBuilder.text("Massachusetts")).isDisplayed());
            Assert.assertTrue(webElement.findElement(ByBuilder.text(OFFICE_PHONE_VALUE + ", " + MOBILE_PHONE_VALUE + ", " + CONTACT_EMAIL_VALUE)).isDisplayed());
        };
        final Consumer<WebElement> personalSummary = webElement -> {

            Assert.assertTrue(webElement.findElement(ByBuilder.text(ABOUT_ME_VALUE)).isDisplayed());
        };
        Map<String, Consumer<WebElement>> functions = ImmutableMap.<String, Consumer<WebElement>>builder()
                .put(GENERAL_INFORMATION_CARD, generalInformationFunction)
                .put(CONTACT_INFORMATION_CARD, contactInformationFunction)
                .put(PERSONAL_SUMMARY_CARD, personalSummary)
                .put(SKILLS_CARD, webElement -> Assert.assertTrue(webElement.findElement(ByBuilder.text(SKILLS_VALUE)).isDisplayed()))
                .put(PUBLICATIONS_CARD, webElement -> Assert.assertTrue(webElement.findElement(ByBuilder.text(PUBLICATIONS_VALUE)).isDisplayed()))
                .put(LINKS_CARD, webElement -> Assert.assertTrue(webElement.findElement(ByBuilder.text(LINKS_VALUE)).isDisplayed()))
                .build();

        functions.forEach((key, value) -> {
            viewCards.forEach(card -> {
                try {
                    if (card.findElement(ByBuilder.text(key)).isDisplayed()) {
                        value.accept(card);
                    }
                } catch (NoSuchElementException ignored) {
                }
            });
        });
        logout();
    }

    private void select(String selectName, String selectOptionName, By parent) {

        final By select = ByBuilder.select(selectName);
        final By selectOption = ByBuilder.selectOption(selectOptionName);
        Utils.selectOption(driver, select, selectOption, parent);
    }

    private static void fillInput(String inputPlaceholder, String inputData) {

        driver.findElement(ByBuilder.input(inputPlaceholder)).sendKeys(inputData);
    }

    private void clickEdit(WebElement webElement) {

        By editButton = ByBuilder.text("edit");
        webElement.findElement(editButton).click();
    }
}
