package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.AnalysisManagerTest.addCodeFile;
import static com.odysseusinc.arachne.portal.front.BaseStudyTest.createAnalysisFromStudy;
import static com.odysseusinc.arachne.portal.front.BaseStudyTest.createStudy;
import static com.odysseusinc.arachne.portal.front.ProfileManagerTest.updateName;
import static com.odysseusinc.arachne.portal.front.StudyManagerTest.STUDY_NAME;
import static com.odysseusinc.arachne.portal.front.StudyManagerTest.addDataSourceToStudy;
import static com.odysseusinc.arachne.portal.front.StudyManagerTest.loginAndOpenStudy;
import static com.odysseusinc.arachne.portal.front.StudyManagerTest.returnToStudyPage;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;

import com.google.common.base.Predicate;
import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class SubmissionTest extends BaseDataCatalogTest {

    private static final BaseStudyTest.StudyData STUDY_DATA =
            new BaseStudyTest.StudyData(STUDY_NAME, "Clinical Trial Design", "Initiate");

    private static final String ANALYSIS_NAME = "TEST analysis";

    private static final String NAME_DS = "TestNode: Test Data Source";

    private static File fileCode;
    private static File resultFile;

    @BeforeClass
    public static void beforeAnalysisManagerTests() throws Exception {

        updateName(ADMIN_LOGIN, ADMIN_PASSWORD, "4");
        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        createStudy(STUDY_DATA);
        createAnalysisFromStudy(ANALYSIS_NAME);

        returnToStudyPage();

        addDataSourceToStudy(NAME_DS, "test");

        logout();

        fileCode = new File("analysis.r");
        resultFile = new File("result.txt");

        fileCode.createNewFile();
        resultFile.createNewFile();
        FileUtils.writeStringToFile(fileCode, "//code", StandardCharsets.UTF_8.name(), true);
    }

    @Before
    public void beforeAnalysisManagerTest() throws IOException {

        loginAndOpenStudy();
    }

    private void openAnalysis() {

        WebElement addAnalysisBtn = driver
                .findElement(By.className("ac-study-analyses-list"))
                .findElement(ByBuilder.link(ANALYSIS_NAME));
        addAnalysisBtn.click();

        waitFor(driver, ByBuilder.toolbar(ANALYSIS_NAME));
    }

    @AfterClass
    public static void afterAnalysisManagersTests() throws IOException {

        fileCode.delete();
        resultFile.delete();
    }

    @After
    public void afterAnalysisManagerTest() throws IOException {

        logout();
    }

    @Test
    public void test01CreateSubmission() throws Exception {

        openAnalysis();
        waitFor(driver, ByBuilder.byClassAndText("ac-list-item__content", "No code files available"));
        addCodeFile(fileCode, "analysis.r");

        createSubmission();
    }

    private void createSubmission() {

        By fileList = By.className("ac-analysis-code-list");
        waitFor(driver, fileList);
        WebElement submit = driver.findElement(fileList).findElement(ByBuilder.button("Submit"));
        submit.click();

        By modal = ByBuilder.modal("Submit code to data nodes");
        waitFor(driver, modal);

        driver.findElement(modal)
                .findElement(ByBuilder.byClassAndText("ac-datasources-list__checkbox-label", NAME_DS))
                .click();

        driver.findElement(modal)
                .findElement(ByBuilder.button("Submit"))
                .click();

        checkStatus("PENDING EXECUTION");
        checkSubmissionRowButtons("auto", "auto", "none", "none");
    }

    private void checkSubmissionRowButtons(String executionAcceptance, String executionRejection,
                                           String publishAcceptance, String publishRejection) {

        int doneButtonIndex = 0;
        int clearButtonIndex = 0;

        if (executionAcceptance != null) {
            checkSubmissionRowButton(executionAcceptance, "done", doneButtonIndex++);
        }
        if (executionRejection != null) {
            checkSubmissionRowButton(executionRejection, "clear", clearButtonIndex++);
        }
        if (executionRejection != null) {
            checkSubmissionRowButton(publishAcceptance, "done", doneButtonIndex);
        }
        if (publishRejection != null) {
            checkSubmissionRowButton(publishRejection, "clear", clearButtonIndex);
        }
    }

    private void checkSubmissionRowButton(String pointerEventsValue, String buttonText, int index) {

        Assert.assertEquals(pointerEventsValue,
                driver.findElement(By.className("ac-submission-line"))
                        .findElements(ByBuilder.button(buttonText)).get(index).getCssValue("pointer-events"));
    }

    @Test
    public void test02RejectExecution() throws Exception {

        openAnalysis();

        driver.findElement(By.className("ac-submission-line")).findElement(ByBuilder.button("clear")).click();

        By modal = ByBuilder.modal("Reject submission");
        waitFor(driver, modal);

        driver.findElement(modal)
                .findElement(ByBuilder.textArea("Comment"))
                .sendKeys("Reason of rejecting");

        driver.findElement(modal)
                .findElement(ByBuilder.button("Save"))
                .click();

        checkStatus("REJECTED");
        checkSubmissionRowButtons(null, "none", "none", "none");

        Assert.assertEquals("Comment: Reason of rejecting",
                driver.findElement(By.className("ac-submission-line"))
                        .findElement(By.className("ac-submissions-cell-status"))
                        .findElement(By.className("ac-tooltip"))
                        .getAttribute("aria-label"));
    }

    private void checkStatus(String status) {

        WebDriverWait webDriverWait = new WebDriverWait(driver, 3);
        webDriverWait.until((Predicate<WebDriver>) driver -> {
            return driver.findElement(By.className("ac-submission-line"))
                    .findElement(ByBuilder.byClassAndText("ac-label-submissions-status__title", status))
                    .isDisplayed();
        });
    }

    @Test
    public void test03Execute() throws Exception {

        openAnalysis();
        createSubmission();

        driver.findElement(By.className("ac-submission-line")).findElement(ByBuilder.button("done")).click();

        checkStatus("IN PROGRESS");
        checkSubmissionRowButtons("none", null, "auto", "auto");
    }

    @Test
    @Ignore
    public void test04AddResultFile() throws Exception {

        openAnalysis();
        addResultFile();
    }

    @Test
    public void test05Publish() throws Exception {

        openAnalysis();

        WebElement publishButton = driver.findElement(By.className("ac-submission-line"))
                .findElements(ByBuilder.button("done")).get(1);
        WebDriverWait wait = new WebDriverWait(driver, 3);
        wait.until(ExpectedConditions.elementToBeClickable(publishButton));
        publishButton.click();

        checkStatus("FINISHED");
        checkSubmissionRowButtons("none", null, "none", null);
    }

    @Test
    public void test06RejectPublishing() throws Exception {

        openAnalysis();
        createSubmission();

        driver.findElement(By.className("ac-submission-line")).findElement(ByBuilder.button("done")).click();
        checkStatus("IN PROGRESS");
        checkSubmissionRowButtons("none", null, "auto", "auto");

        driver.findElement(By.className("ac-submission-line")).findElement(ByBuilder.button("clear")).click();

        By modal = ByBuilder.modal("Reject submission");
        waitFor(driver, modal);

        driver.findElement(modal)
                .findElement(ByBuilder.button("Save"))
                .click();

        checkStatus("REJECTED");
        checkSubmissionRowButtons("none", null, null, "none");
    }

    private void addResultFile() {

        Assert.assertTrue(driver.findElement(By.className("ac-submission-line")).findElement(By.className("ac-submissions-cell-files")).isDisplayed());
        driver.findElement(By.className("ac-submission-line")).findElement(ByBuilder.link("add_circle_outline")).click();

        waitFor(driver, ByBuilder.modal("Add result files"));

        WebElement uploadElement = driver.findElement(ByBuilder.modal("Add result files"))
                .findElement(By.cssSelector("input[type=file]"));

        uploadElement.sendKeys(resultFile.getAbsolutePath());
        driver.findElement(ByBuilder.modal("Add result files")).findElement(ByBuilder.button("Upload")).click();
        //check "1 document"
    }

}
