package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.fillInput;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.google.common.base.Predicate;
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
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
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
    protected static final String COUNTRY_PLACEHOLDER = "Country";
    protected static final String STATE_PLACEHOLDER = "State";
    protected static final String ZIP_CODE_PLACEHOLDER = "Zip code";
    protected static final String OFFICE_PHONE_PLACEHOLDER = "Office phone";
    protected static final String MOBILE_PHONE_PLACEHOLDER = "Mobile phone";
    protected static final String SKILLS_PLACEHOLDER = "Add Skill";
    protected static final String CONTACT_EMAIL_PLACEHOLDER = "Contact email";
    protected static final String PUBLICATION_TITLE_PLACEHOLDER = "Title*";
    protected static final String PUBLICATION_PUBLISHER_PLACEHOLDER = "Publication/Publisher*";
    protected static final String PUBLICATION_LINK_PLACEHOLDER = "Publication Link*";
    protected static final String PUBLICATION_DESCRIPTION_PLACEHOLDER = "Description";
    protected static final String LINK_NAME_PLACEHOLDER = "Name of Link*";
    protected static final String LINK_PLACEHOLDER = "Link*";
    protected static final String LINK_DESCRIPTION_PLACEHOLDER = "Description*";
    protected static final String ABOUT_ME_VALUE = "bending";
    protected static final String COMPANY_NAME_VALUE = "Odysseus inc";
    protected static final String CITY_VALUE = "Cambridge";
    protected static final String ADDRESS_LINE_1_VALUE = "245 First Street";
    protected static final String ADDRESS_LINE_2_VALUE = "Riverview II, 18th Floor";
    protected static final String COUNTRY_VALUE = "United States of America (the)";
    protected static final String STATE_VALUE = "Massachusetts";
    protected static final String ZIP_VALUE = "02142";
    protected static final String OFFICE_PHONE_VALUE = "+1 (888) 550-9968";
    protected static final String MOBILE_PHONE_VALUE = "+1 (339) 204-4044";
    protected static final String CONTACT_EMAIL_VALUE = "contact@odysseusinc.com";
    protected static final String SKILLS_VALUE = "Bending";
    protected static final String PUBLICATION_TITLE_VALUE = "arachnenetwork.com";
    protected static final String PUBLICATION_PUBLISHER_VALUE = "Big publisher";
    protected static final String PUBLICATION_LINK_VALUE = "https://arachnenetwork.com";
    protected static final String PUBLICATION_DESCRIPTION_VALUE = "Publication about Arachne Network";
    protected static final String LINK_NAME_VALUE = "Link to Arachne Network";
    protected static final String LINK_VALUE = "https://arachnenetwork.com";
    protected static final String LINK_DESCRIPTION_VALUE = "Link provides access to Arachne public page";

    @Test
    public void test01RegisterNewUser() throws InterruptedException, IOException {

        fillRegisterForm();
        final By welcome = waitWelcome();
        Assert.assertTrue(driver.findElement(welcome).isDisplayed());
    }

    @Test
    public void test02LoginNotEnabledUser() {

        try {
            loginPortal(REGISTER_FORM_DATA.get(EMAIL_PLACEHOLDER), REGISTER_FORM_DATA.get(PASSWORD_PLACEHOLDER));
        } catch (TimeoutException ignored) {

        }
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
        Thread.sleep(3000);
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
    public void test06EditUserProfile() throws Exception{

        loginPortal(REGISTER_FORM_DATA.get(EMAIL_PLACEHOLDER), REGISTER_FORM_DATA.get(PASSWORD_PLACEHOLDER));
        final By avatar = By.className("ac-avatar");
        driver.findElement(avatar).click();
        final By userProfile = ByBuilder.text("User Profile");
        waitFor(driver, userProfile);
        Thread.sleep(2000);
        driver.findElement(userProfile).click();

        final String toolbarName = String.format("%s %s %s",
                REGISTER_FORM_DATA.get(FIRSTNAME_PLACEHOLDER),
                REGISTER_FORM_DATA.get(MIDDLENAME_PLACEHOLDER),
                REGISTER_FORM_DATA.get(LASTNAME_PLACEHOLDER)
        );
        Utils.waitForPageLoad(driver, ByBuilder.toolbar(toolbarName));
        Thread.sleep(3000);
        waitFor(driver, By.className("ac-profile-view__card"));
        final List<WebElement> viewCards = driver.findElements(By.className("ac-profile-view__card"));

        final Consumer<WebElement> generalInformationFunction = webElement -> {
            clickEdit(webElement);
            select("Epidemiology", "Medical", null);
            fillInput(driver, AFFILIATION_PLACEHOLDER, COMPANY_NAME_VALUE);
        };
        final Consumer<WebElement> contactInformationFunction = webElement -> {
            clickEdit(webElement);
            fillInput(driver, ADDRESS_LINE_1_PLACEHOLDER, ADDRESS_LINE_1_VALUE);
            fillInput(driver, ADDRESS_LINE_2_PLACEHOLDER, ADDRESS_LINE_2_VALUE);
            fillInput(driver, CITY_PLACEHOLDER, CITY_VALUE);
            fillInput(driver, ZIP_CODE_PLACEHOLDER, ZIP_VALUE);
            driver.findElement(ByBuilder.inputWithAutoComplete(COUNTRY_PLACEHOLDER)).sendKeys(COUNTRY_VALUE, Keys.ENTER);
            driver.findElement(ByBuilder.inputWithAutoComplete(STATE_PLACEHOLDER)).sendKeys(STATE_VALUE, Keys.ENTER);
            fillInput(driver, OFFICE_PHONE_PLACEHOLDER, OFFICE_PHONE_VALUE);
            fillInput(driver, MOBILE_PHONE_PLACEHOLDER, MOBILE_PHONE_VALUE);
            fillInput(driver, CONTACT_EMAIL_PLACEHOLDER, CONTACT_EMAIL_VALUE);
        };
        final Consumer<WebElement> personalSummaryFunction = webElement -> {
            clickEdit(webElement);
            webElement.findElement(ByBuilder.textArea(ABOUT_ME_PLACEHOLDER)).sendKeys(ABOUT_ME_VALUE);
        };
        final Consumer<WebElement> skillsFunction = webElement -> {
            driver.findElement(ByBuilder.button("Add skill")).click();
            webElement.findElement(ByBuilder.inputWithAutoComplete(SKILLS_PLACEHOLDER)).sendKeys(SKILLS_VALUE, Keys.ENTER);
            waitForPageLoad(driver, ByBuilder.button("Add"));
            WebDriverWait waitForEnabled = new WebDriverWait(driver, 2);
            waitForEnabled.until((Predicate<WebDriver>) d -> webElement.findElement(ByBuilder.button("Add")).isEnabled());
        };
        final Consumer<WebElement> publicationsFunction = webElement -> {
            driver.findElement(ByBuilder.button("Add publication")).click();
            fillInput(driver, PUBLICATION_TITLE_PLACEHOLDER, PUBLICATION_TITLE_VALUE);
            fillInput(driver, PUBLICATION_PUBLISHER_PLACEHOLDER, PUBLICATION_PUBLISHER_VALUE);
            fillInput(driver, PUBLICATION_LINK_PLACEHOLDER, PUBLICATION_LINK_VALUE);
            webElement.findElement(ByBuilder.textArea(PUBLICATION_DESCRIPTION_PLACEHOLDER))
                    .sendKeys(PUBLICATION_DESCRIPTION_VALUE);
        };
        final Consumer<WebElement> linksFunction = webElement -> {
            driver.findElement(ByBuilder.button("Add Link")).click();
            fillInput(driver, LINK_NAME_PLACEHOLDER, LINK_NAME_VALUE);
            fillInput(driver, LINK_PLACEHOLDER, LINK_VALUE);
            fillInput(driver, LINK_DESCRIPTION_PLACEHOLDER, LINK_DESCRIPTION_VALUE);

        };
        final Map<String, Consumer<WebElement>> functions = ImmutableMap.<String, Consumer<WebElement>>builder()
                .put(GENERAL_INFORMATION_CARD, generalInformationFunction)
                .put(CONTACT_INFORMATION_CARD, contactInformationFunction)
                .put(PERSONAL_SUMMARY_CARD, personalSummaryFunction)
//                .put(SKILLS_CARD, skillsFunction)
                .put(PUBLICATIONS_CARD, publicationsFunction)
                .put(LINKS_CARD, linksFunction)
                .build();

        functions.forEach((key, value) -> {
            viewCards.forEach(card -> {
                try {
                    if (card.findElement(ByBuilder.text(key)).isDisplayed()) {
                        value.accept(card);
                        card.findElement(ByBuilder.button("Add")).click();
                    }
                } catch (NoSuchElementException ignored) {
                }
            });
        });
        Thread.sleep(3000);
        logout();
    }

    @Test
    public void test07ShowUserProfileThroughExpertFinder() throws Exception {

        Thread.sleep(3000);
        loginPortal(REGISTER_FORM_DATA.get(EMAIL_PLACEHOLDER), REGISTER_FORM_DATA.get(PASSWORD_PLACEHOLDER));
        final By expertFinderToolbar = ByBuilder.sideBarTab("Expert Finder");
        waitFor(driver,expertFinderToolbar);
        driver.findElement(expertFinderToolbar).click();
        Utils.waitForPageLoad(driver, ByBuilder.toolbar("Expert finder"));
        final String userName = String.format("%s %s %s",
                REGISTER_FORM_DATA.get(FIRSTNAME_PLACEHOLDER),
                REGISTER_FORM_DATA.get(MIDDLENAME_PLACEHOLDER),
                REGISTER_FORM_DATA.get(LASTNAME_PLACEHOLDER)
        );
        Thread.sleep(3000);
        driver.findElement(ByBuilder.text(userName)).click();
        Utils.waitForPageLoad(driver, ByBuilder.toolbar(userName));

        final List<WebElement> viewCards = driver.findElements(By.className("ac-profile-view__card"));
        final Consumer<WebElement> generalInformationFunction = webElement -> {
            Assert.assertTrue(webElement.findElement(ByBuilder.text("Medical")).isDisplayed());
            Assert.assertTrue(webElement.findElement(ByBuilder.text(COMPANY_NAME_VALUE)).isDisplayed());
        };
        final Consumer<WebElement> contactInformationFunction = webElement -> {
            Assert.assertTrue(webElement.findElement(ByBuilder.text(ADDRESS_LINE_1_VALUE + ", " + ADDRESS_LINE_2_VALUE)).isDisplayed());
            Assert.assertTrue(webElement.findElement(ByBuilder.text(CITY_VALUE + ", " + ZIP_VALUE)).isDisplayed());
            Assert.assertTrue(webElement.findElement(ByBuilder.text(COUNTRY_VALUE)).isDisplayed());
            Assert.assertTrue(webElement.findElement(ByBuilder.text(STATE_VALUE)).isDisplayed());
            Assert.assertTrue(webElement.findElement(ByBuilder.text(OFFICE_PHONE_VALUE + ", " + MOBILE_PHONE_VALUE + ", " + CONTACT_EMAIL_VALUE)).isDisplayed());
        };
        final Consumer<WebElement> personalSummary = webElement -> {

            Assert.assertTrue(webElement.findElement(ByBuilder.text(ABOUT_ME_VALUE)).isDisplayed());
        };
        final Map<String, Consumer<WebElement>> functions = ImmutableMap.<String, Consumer<WebElement>>builder()
                .put(GENERAL_INFORMATION_CARD, generalInformationFunction)
                .put(CONTACT_INFORMATION_CARD, contactInformationFunction)
                .put(PERSONAL_SUMMARY_CARD, personalSummary)
//                .put(SKILLS_CARD, webElement -> Assert.assertTrue(webElement.findElement(ByBuilder.text(SKILLS_VALUE)).isDisplayed()))
                .put(PUBLICATIONS_CARD, webElement -> {
                    Assert.assertTrue(webElement.findElement(ByBuilder.link(PUBLICATION_TITLE_VALUE)).isDisplayed());
                    Assert.assertTrue(webElement.findElement(ByBuilder.text(PUBLICATION_PUBLISHER_VALUE)).isDisplayed());
                    Assert.assertTrue(webElement.findElement(ByBuilder.text(PUBLICATION_DESCRIPTION_VALUE)).isDisplayed());
                })
                .put(LINKS_CARD, webElement -> {
                    Assert.assertTrue(webElement.findElement(ByBuilder.link(LINK_NAME_VALUE)).isDisplayed());
                    Assert.assertTrue(webElement.findElement(ByBuilder.text(LINK_DESCRIPTION_VALUE)).isDisplayed());
                })
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

    private void clickEdit(WebElement webElement) {

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        By editButton = ByBuilder.text("edit");
        webElement.findElement(editButton).click();
    }
}
