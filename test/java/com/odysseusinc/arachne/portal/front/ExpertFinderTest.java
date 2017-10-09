package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.BasicHttpEntity;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.NotFoundException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

public class ExpertFinderTest extends BaseUserTest {

    private final static ImmutableMap<String, Integer> FILTER_MAP;

    static {

        FILTER_MAP = ImmutableMap.<String, Integer>builder()
                .put("Medical", 3)
                .build();
    }

    private final static String SIDEBAR_TAB_LABEL = "Expert Finder";
    private static int EXPERT_FINDER_INITIAL_LIST_SIZE;
    private final static String FILTER_DROPDOWN_TITLE = "Filter";
    private final static String EXPERT_FINDER_FILTER_PLACEHOLDER = "Professional type";
    private final static int EXPERT_VIEW_CONTACT_INFO_FIELD_SIZE = 4;

    @BeforeClass
    public static void beforeTest() throws IOException {

        reindexSolr();
        showExpertFinderPage();
        final By expertCard = By.className("ac-expert-card");
        waitForPageLoad(driver, expertCard);
        final List<WebElement> elements = driver.findElements(expertCard);
        EXPERT_FINDER_INITIAL_LIST_SIZE = elements.size();
        logout();
        fillRegisterForm();
        waitWelcome();
        activateUser();
    }

    @Test
    public void test01ExpertListTest() throws InterruptedException {

        showExpertFinderPage();
        assertExpertListSize(EXPERT_FINDER_INITIAL_LIST_SIZE + 1);
    }

    @Test
    @Ignore
    public void test02FilteredExpertListTest() throws InterruptedException {

        showExpertFinderPage();
        final By filterButton = ByBuilder.byClassAndText("ac-badged-icon__icon", "filter_list");
        waitForPageLoad(driver, filterButton);
        driver.findElement(filterButton).click();
        final By filterDropDown = ByBuilder.filterPanel(FILTER_DROPDOWN_TITLE);
        waitFor(driver, filterDropDown);
        final WebElement element = driver.findElement(filterDropDown);
        FILTER_MAP.forEach((filter, listSize) -> {
            final WebElement selector = element.findElement(ByBuilder.select(EXPERT_FINDER_FILTER_PLACEHOLDER));
            WebElement studyTypeOption = element.findElement(ByBuilder.selectOption(filter));
            Actions actions = new Actions(driver);
            actions.moveToElement(selector).click().build().perform();
            actions.moveToElement(studyTypeOption).click().build().perform();
            assertExpertListSize(listSize);
        });
    }

    @Test
    public void test03ViewProfileDetailsTest() throws InterruptedException {

        showExpertFinderPage();
        final String expertFullName = String.format("%s %s %s",
                REGISTER_FORM_DATA.get(FIRSTNAME_PLACEHOLDER),
                REGISTER_FORM_DATA.get(MIDDLENAME_PLACEHOLDER),
                REGISTER_FORM_DATA.get(LASTNAME_PLACEHOLDER)
        );

        final By expertCard = ByBuilder.link(expertFullName);
        waitForPageLoad(driver, expertCard);
        driver.findElement(expertCard).click();

        final By profileViewCard = By.className("ac-profile-view__card");
        waitForPageLoad(driver, profileViewCard);

        final By contactInfoHeader = ByBuilder.text("Contact Information");
        final WebElement contactInfoPanel = driver.findElements(profileViewCard).stream()
                .filter(element -> {
                    try {
                        return element.findElement(contactInfoHeader).isDisplayed();
                    } catch (NoSuchElementException ignored) {
                        return false;
                    }
                })
                .findAny()
                .orElseThrow(() -> new NotFoundException());
        final List<String> contacts = Arrays.asList(
                INITIAL_ADRESS_STRING, INITIAL_CITY_STRING, INITIAL_COUNTRY_STRING, INITIAL_CONTACTS_STRING);
        contacts.forEach(contact ->
                Assert.assertTrue(contactInfoPanel.findElement(ByBuilder.text(contact)).isDisplayed()));
    }

    private static void reindexSolr() throws IOException {

        final String token = apiLogin(httpClient);

        final HttpPost request = new HttpPost(portalUrl() + "/api/v1/admin/users/reindex-solr");
        request.setHeader("Arachne-Auth-Token", token);
        final int statusCode = httpClient.execute(request)
                .getStatusLine()
                .getStatusCode();
        Assert.assertEquals(200, statusCode);
    }

    private static String apiLogin(HttpClient httpClient) throws IOException {

        final HttpPost login = new HttpPost(portalUrl() + "/api/v1/auth/login");
        login.setHeader("Content-Type", "application/json");
        login.setHeader("Accept", "application/json");

        final BasicHttpEntity entity = new BasicHttpEntity();

        class Auth {
            public String username;
            public String password;
        }
        final Auth auth = new Auth();
        auth.username = ADMIN_LOGIN;
        auth.password = ADMIN_PASSWORD;

        final ObjectMapper mapper = new ObjectMapper();
        final StringWriter writer = new StringWriter();
        mapper.writeValue(writer, auth);
        entity.setContent(new ByteArrayInputStream(writer.toString().getBytes()));
        login.setEntity(entity);

        final HttpResponse execute = httpClient.execute(login);

        TypeReference<LinkedHashMap<String, Object>> typeRef
                = new TypeReference<LinkedHashMap<String, Object>>() {
        };

        LinkedHashMap<String, Object> responseJson = mapper.readValue(execute.getEntity().getContent(), typeRef);

        return (String) ((Map<String, Object>) responseJson.get("result")).get("token");
    }

    private static void assertExpertListSize(int expectedSize) {

        final By expertCard = By.className("ac-expert-card");
        waitForPageLoad(driver, expertCard);
        final List<WebElement> elements = driver.findElements(expertCard);
        Assert.assertEquals(expectedSize, elements.size());
    }

    private static void showExpertFinderPage() {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        final By expertFinderTab = ByBuilder.sideBarTab(SIDEBAR_TAB_LABEL);
        waitForPageLoad(driver, expertFinderTab);
        driver.findElement(expertFinderTab).click();
        waitForPageLoad(driver, ByBuilder.toolbar("Expert Finder"));
    }

}
