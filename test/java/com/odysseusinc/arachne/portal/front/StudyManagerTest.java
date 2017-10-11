package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.ProfileManagerTest.updateName;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.google.common.base.Predicate;
import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class StudyManagerTest extends BaseDataCatalogTest {

    private static final String MODAL_TITLE_CREATE_STUDY = "Create study";
    private static final String MODAL_TITLE_CREATE_ANALYSIS = "Create analysis";
    private static final String MODAL_TITLE_UPDATE_STUDY_TITLE = "Update study title";

    private static final String PLACEHOLDER_STUDY_NAME = "Name of study";
    private static final String PLACEHOLDER_STUDY_TYPE = "Type";
    private static final String PLACEHOLDER_STUDY_TITLE = "Title of study";
    private static final String PLACEHOLDER_ANALYSIS_TITLE = "Title";

    private static final String BEFORE_UPDATING_STUDY_NAME = "TEST Stu";
    private static final String STUDY_NAME = "TEST Study";

    private static final String NAME_DS = "Test Data Source 2";

    @BeforeClass
    public static void beforeTest() throws IOException {

        updateName(ADMIN_LOGIN, ADMIN_PASSWORD, "4");
        updateName("mr_lead_investigator@example.com", "password", "1");
        updateName("mr_data_set_owner@example.com", "password", "2");
        updateName("mr_collaborator@example.com", "password", "3");
    }

    @AfterClass
    public static void afterTest() throws IOException {

        deleteMails();
        shutdown();
    }

    @After
    public void afterEach() throws IOException {

        logout();
    }

    @Test
    public void test01CreateStudy() throws Exception {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        createStudy(BEFORE_UPDATING_STUDY_NAME);

        waitFor(driver, ByBuilder.toolbarHeader(BEFORE_UPDATING_STUDY_NAME));
    }

    private void createStudy(String studyName) {

        By addBtn = ByBuilder.buttonAddIco();
        String studyType = "Clinical Trial Design";

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        waitForPageLoad(driver, addBtn);

        WebElement addStudyButton = driver.findElement(addBtn);
        addStudyButton.click();

        final By modal = ByBuilder.modal(MODAL_TITLE_CREATE_STUDY);
        waitFor(driver, modal);

        WebElement modalWebElement = driver.findElement(modal);
        WebElement studyNameInput = modalWebElement.findElement(ByBuilder.input(PLACEHOLDER_STUDY_NAME));
        WebElement studyTypeSelect = modalWebElement.findElement(ByBuilder.select(PLACEHOLDER_STUDY_TYPE));
        WebElement studyTypeOption = modalWebElement.findElement(ByBuilder.selectOption(studyType));
        WebElement studyCreateBtn = modalWebElement.findElement(ByBuilder.button("Create"));

        studyNameInput.sendKeys(studyName);

        Actions actions = new Actions(driver);
        actions.moveToElement(studyTypeSelect).click().build().perform();
        actions.moveToElement(studyTypeOption).click().build().perform();

        studyCreateBtn.click();
    }

    @Test
    public void test02UpdateStudyTitle() throws Exception {

        loginAndOpenStudy(BEFORE_UPDATING_STUDY_NAME);

        By editBtn = ByBuilder.toolbarEditIco("edit");
        waitFor(driver, editBtn);

        WebElement editStudyButton = driver.findElement(editBtn);
        editStudyButton.click();

        By titleBy = ByBuilder.modal(MODAL_TITLE_UPDATE_STUDY_TITLE);
        waitFor(driver, titleBy);

        WebElement modal = driver.findElement(titleBy);
        WebElement studyTitleInput = modal.findElement(ByBuilder.input(PLACEHOLDER_STUDY_TITLE));
        WebElement studySaveBtn = modal.findElement(ByBuilder.button("Save"));

        String updatedPostfix = "dy";
        studyTitleInput.sendKeys(updatedPostfix);
        studySaveBtn.click();
        waitFor(driver, ByBuilder.toolbarHeader(STUDY_NAME));
    }

    @Test
    public void test03UpdateStudyDescription() throws Exception {

        loginAndOpenStudy();

        By editBtn = ByBuilder.byClassAndText("ac-material-icons", "edit");
        waitForPageLoad(driver, editBtn);

        WebElement editButton = driver.findElement(editBtn);
        editButton.click();

        WebElement description = driver.findElement(ByBuilder.textArea("Add Study Objective"));
        Assert.assertEquals("", description.getText());

        String newDescription = "Long and beautiful description";
        description.sendKeys(newDescription);

        WebElement studyDescriptionBtn = driver
                .findElement(By.className("ac-study-objective-edit"))
                .findElement(ByBuilder.byClassAndText("ac-form__submit", "Save"));

        studyDescriptionBtn.click();

        waitFor(driver, ByBuilder.byClassAndText("ac-study-objective-view", newDescription));
    }

    @Test
    public void test04UpdateStudyType() throws Exception {

        loginAndOpenStudy();

        String studyType = "Clinical Trial Design";

        WebElement studyTypeSelect = driver.findElement(ByBuilder.select(studyType));
        waitFor(driver, ByBuilder.select(studyType));

        String updatedStudyType = "Health Economics and Outcomes";
        WebElement studyTypeOption = driver.findElement(ByBuilder.selectOption(updatedStudyType));

        Actions actions = new Actions(driver);
        actions.moveToElement(studyTypeSelect).click().build().perform();
        actions.moveToElement(studyTypeOption).click().build().perform();

        waitFor(driver, ByBuilder.select(updatedStudyType));
    }

    @Test
    //@Ignore
    public void test05AddStudyDocument() throws Exception {

        loginAndOpenStudy();

        WebElement studyTypeSelect = driver.findElement(ByBuilder.byClassAndText("ac-study-document-list-add__label", "Add document"));
        studyTypeSelect.click();

        waitFor(driver, ByBuilder.byClassAndText("ac-tabs__item ac-tabs__item--selected", "Computer"));

        WebElement uploadElement = driver.findElement(By.cssSelector("input[type=file]"));
        //todo local file
        uploadElement.sendKeys("D:\\projects\\atlas\\main.js");

        driver.findElement(ByBuilder.buttonSubmit2("Add")).click();
        //driver.findElement(ByBuilder.buttonIco("Add")).click();

        waitFor(driver, ByBuilder.byClassAndText("ac-link ac-code-file-info__name", "main.js"));
    }

    @Test
    @Ignore
    public void test06RemoveStudyDocument() throws Exception {

        loginAndOpenStudy();
        waitFor(driver, By.className("ac-list-item__remove-ico ac-material-icons ac-material-icons--bold"));
        WebElement removeIco = driver.findElement(By.className("ac-list-item__remove-ico ac-material-icons ac-material-icons--bold"));
        removeIco.click();
        acceptAlert();
        waitFor(driver, ByBuilder.byClassAndText("ac-list-item__content", "No documents available"));
    }

    @Test
    @Ignore
    public void test07AddStudyParticipant() throws Exception {

        String chosenName = "admin2 admin2";
        inviteParticipant(chosenName, 2);

        WebElement addedRow = driver.findElements(By.className("ac-list-item")).get(0);

        String role = "Lead Investigator";
        Assert.assertTrue(addedRow.findElement(ByBuilder.byClassAndText("ac-select-control__label", role)).isDisplayed());
        Assert.assertEquals(addedRow.findElement(By.className("ac-study-participants-item__name")).getText(), "admin2 admin2 admin2");
        Assert.assertEquals(addedRow.findElement(By.className("ac-study-participants-item__status ac-study-participants-item__status--pending")).getText(), "pending");
    }

    protected void inviteParticipant(String chosenName, int chosenUserId) throws Exception {

        loginAndOpenStudy();
        openParticipantsTab();

        WebDriverWait webDriverWait = new WebDriverWait(driver, 3);
        webDriverWait.until((Predicate<WebDriver>) driver -> {

            List<WebElement> rows = driver.findElements(By.className("ac-study-participants-item__name"));
            int size = rows.size();

            Assert.assertEquals("admin4 admin4 admin4", rows.get(size - 1).getText());
            Assert.assertEquals(PORTAL_BASE_URL + "/expert-finder/profile/4", rows.get(size - 1).findElement(By.className("ac-link")).getAttribute("href"));
            return rows.get(size - 1).isDisplayed();
        });

        WebElement studyParticipantAddBtm = driver.findElement(ByBuilder.byClassAndText("ac-list-item__content", "Add participant"));
        studyParticipantAddBtm.click();

        waitFor(driver, ByBuilder.modal("Add participant"));

        WebElement participantRoleSelect = driver.findElement(ByBuilder.select("Contributor"));
        String updatedRole = "Lead Investigator";
        WebElement roleTypeOption = driver.findElement(ByBuilder.selectOption(updatedRole));

        Actions actions = new Actions(driver);
        actions.moveToElement(participantRoleSelect).click().build().perform();
        actions.moveToElement(roleTypeOption).click().build().perform();


        WebElement participantSelect = driver.findElement(ByBuilder.byClassAndText("Select-placeholder", "Search by name"));
        actions = new Actions(driver);
        actions.moveToElement(participantSelect).click().sendKeys("admin" + chosenUserId).build().perform();

        List<WebElement> selectValues = driver.findElements(By.className("Select-option"));
        Assert.assertEquals(1, selectValues.size());

        actions = new Actions(driver);
        actions.moveToElement(selectValues.get(0)).click().build().perform();

        waitFor(driver, ByBuilder.byClassAndText("Select-value-label", chosenName));

        WebElement addBtn = driver.findElements(ByBuilder.button("Add")).get(1);
        addBtn.click();

        waitFor(driver, ByBuilder.byClassAndText("ac-modal__content-title", "Add participant"));

        final By adminEmail = ByBuilder.byClassAndText("ac-study-confirm-participant", "Your invite has been sent to");

        waitFor(driver, ByBuilder.byClassAndText("ac-study-confirm-participant", "Your invite has been sent to"));

        WebElement dialogContent = driver.findElement(adminEmail);
        WebElement added = dialogContent.findElements(By.className("ac-link")).get(0);

        Assert.assertEquals(chosenName, added.getText());
        Assert.assertEquals(PORTAL_BASE_URL + "/expert-finder/profile/" + chosenUserId, added.getAttribute("href"));

        driver.findElement(By.className("ac-modal--active")).findElement(By.className("ac-modal__close-ico")).click();

        webDriverWait = new WebDriverWait(driver, 3);
        webDriverWait.until((Predicate<WebDriver>) driver -> {
            return driver
                    .findElements(By.xpath(".//*[contains(@class, 'ac-select-control__label') and text()='" + updatedRole + "']")).get(1)
                    .isDisplayed();
        });

    }

    private void checkParticipantRow(WebElement row, String role, String name, String status) {

        Assert.assertEquals(row.findElement(By.className("ac-study-participants-item__role")).getText(), role);
        Assert.assertTrue(row.findElement(ByBuilder.byClassAndText("ac-study-participants-item__status ac-study-participants-item__status--" + status, status)).isDisplayed());
        Assert.assertEquals(row.findElement(By.className("ac-study-participants-item__name")).getText(), name);
    }

    @Test
    @Ignore
    public void test19DeleteStudy() throws Exception {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);

        final String studyName = "Study For Deleting";
        createStudy(studyName);

        waitFor(driver, By.className("ac-study-actions__remove-ico"));

        WebElement delete = driver.findElement(By.className("ac-study-actions__remove-ico"));
        delete.click();
        acceptAlert();

        final By studiesPage = ByBuilder.byClassAndText("ac-toolbar__header", " studies");
        waitFor(driver, studiesPage);

        Assert.assertEquals(0, driver.findElements(ByBuilder.tableRow(studyName)).size());
    }

    private void loginAndOpenStudy() {

        loginAndOpenStudy(STUDY_NAME);
    }

    private void loginAndOpenStudy(String name) {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        By studyRow = ByBuilder.tableRow(name);
        waitFor(driver, studyRow);

        WebElement studyInTable = driver.findElement(studyRow);
        studyInTable.click();
    }

    private void acceptAlert() {

        Alert alert = driver.switchTo().alert();
        alert.accept();
    }

    private void openParticipantsTab() {

        waitFor(driver, ByBuilder.tab("Participants"));
        WebElement participantTab = driver.findElement(ByBuilder.tab("Participants"));
        participantTab.click();
    }

    private void openDatasourcesTab() {

        WebElement datasourcesTab = driver.findElement(ByBuilder.tab("Data sources"));
        datasourcesTab.click();
    }
}
