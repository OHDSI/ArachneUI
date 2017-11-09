package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.BaseStudyTest.DEFAULT_ANALYSIS_TYPE;
import static com.odysseusinc.arachne.portal.front.BaseStudyTest.createAnalysisFromStudy;
import static com.odysseusinc.arachne.portal.front.BaseStudyTest.createStudy;
import static com.odysseusinc.arachne.portal.front.ProfileManagerTest.updateName;
import static com.odysseusinc.arachne.portal.front.StudyManagerTest.STUDY_NAME;
import static com.odysseusinc.arachne.portal.front.StudyManagerTest.loginAndOpenStudy;
import static com.odysseusinc.arachne.portal.front.StudyWithDataSourceManagerTest.addDataSourceToStudy;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

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
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class AnalysisManagerTest extends BaseDataCatalogTest {

    private static final BaseStudyTest.StudyData STUDY_DATA =
            new BaseStudyTest.StudyData(STUDY_NAME, "Clinical Trial Design", "Initiate");


    public static final String PLACEHOLDER_ANALYSIS_TITLE = "Title of analysis";

    private static final String BEFORE_UPDATING_ANALYSIS_NAME = "TEST ana";
    private static final String ANALYSIS_NAME = "TEST analysis";

    private static final String MODAL_TITLE_UPDATE_ANALYSIS_TITLE = "Update analysis title";
    protected static final String NAME_DS = "TestNode: Test Data Source 3";

    private static File fileCode;

    @BeforeClass
    public static void beforeAnalysisManagerTests() throws Exception {

        updateName(ADMIN_LOGIN, ADMIN_PASSWORD, "4");
        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        createStudy(STUDY_DATA);
        addDataSourceToStudy(NAME_DS, "3");

        logout();

        fileCode = new File("analysis.r");
        fileCode.createNewFile();
        FileUtils.writeStringToFile(fileCode, "//code", StandardCharsets.UTF_8.name(), true);
    }

    @Before
    public void beforeAnalysisManagerTest() throws IOException {

        loginAndOpenStudy();
    }

    private void openAnalysis() {

        waitFor(driver, ByBuilder.link(ANALYSIS_NAME));

        WebElement addAnalysisBtn = driver
                .findElement(By.className("ac-study-analyses-list"))
                .findElement(ByBuilder.link(ANALYSIS_NAME));
        addAnalysisBtn.click();

        waitFor(driver, ByBuilder.toolbar(ANALYSIS_NAME));
    }

    @AfterClass
    public static void afterAnalysisManagersTests() throws IOException {

        fileCode.delete();
    }

    @After
    public void afterAnalysisManagerTest() throws IOException {

        logout();
    }

    @Test
    public void test01UpdateAnalysisTitle() throws Exception {

        createAnalysisFromStudy(BEFORE_UPDATING_ANALYSIS_NAME);

        By editBtn = ByBuilder.toolbarEditIco("edit");
        waitFor(driver, editBtn);
        driver.findElement(editBtn).click();

        By titleBy = ByBuilder.modal(MODAL_TITLE_UPDATE_ANALYSIS_TITLE);
        waitFor(driver, titleBy);

        WebElement modal = driver.findElement(titleBy);
        WebElement analysisTitleInput = modal.findElement(ByBuilder.input(PLACEHOLDER_ANALYSIS_TITLE));
        WebElement analysisSaveBtn = modal.findElement(ByBuilder.button("Save"));

        String updatedPostfix = "lysis";
        analysisTitleInput.sendKeys(updatedPostfix);
        analysisSaveBtn.click();
        waitFor(driver, ByBuilder.toolbar(ANALYSIS_NAME));
    }

    @Test
    public void test02UpdateAnalysisType() throws Exception {

        openAnalysis();

        WebElement studyTypeSelect = driver.findElement(ByBuilder.select(DEFAULT_ANALYSIS_TYPE));
        waitFor(driver, ByBuilder.select(DEFAULT_ANALYSIS_TYPE));

        String updatedAnalysisType = "Custom";
        WebElement studyTypeOption = driver.findElement(ByBuilder.selectOption(updatedAnalysisType));

        Actions actions = new Actions(driver);
        actions.moveToElement(studyTypeSelect).click().build().perform();
        actions.moveToElement(studyTypeOption).click().build().perform();

        waitFor(driver, ByBuilder.select(updatedAnalysisType));
    }

    @Test
    public void test03UpdateAnalysisDescription() throws Exception {

        openAnalysis();

        By editBtn = ByBuilder.byClassAndText("ac-material-icons", "edit");
        waitForPageLoad(driver, editBtn);

        WebElement editButton = driver.findElement(editBtn);
        editButton.click();

        WebElement description = driver.findElement(ByBuilder.textArea("Add description"));
        Assert.assertEquals("", description.getText());

        String newDescription = "Long and beautiful analysis description";
        description.sendKeys(newDescription);

        WebElement descriptionBtn = driver
                .findElement(By.className("ac-analysis-description-edit"))
                .findElement(ByBuilder.byClassAndText("ac-form__submit", "Save"));

        descriptionBtn.click();

        waitFor(driver, ByBuilder.byClassAndText("ac-analysis-description-view", newDescription));
    }

    @Test
    public void test04AddCodeFile() throws Exception {

        openAnalysis();
        waitFor(driver, ByBuilder.byClassAndText("ac-list-item__content", "No code files available"));
        addCodeFile(fileCode, "analysis.r");
    }

    protected static void addCodeFile(File file, String label) {

        WebElement addDocumentButton = driver.findElement(
                ByBuilder.byClassAndText("ac-analysis-add-code__label", "Add code file"));
        addDocumentButton.click();

        waitFor(driver, By.className("ac-analysis-form-create-code__content"));

        WebElement uploadElement = driver.findElement(By.cssSelector("input[type=file]"));
        uploadElement.sendKeys(file.getAbsolutePath());
        driver.findElement(ByBuilder.button("Add")).click();
        waitFor(driver, ByBuilder.byClassAndText("ac-link ac-code-file-info__name", label));
    }

    @Test
    public void test05LockCodeFile() throws Exception {

        openAnalysis();

        driver.findElement(ByBuilder.tab("Lock")).click();

        Thread.sleep(3000);//todo

        WebElement addDocumentButton = driver.findElement(By.className("ac-analysis-code-list"))
                .findElement(By.className("ac-analysis-add-code--disabled"));
        Assert.assertFalse(addDocumentButton.isEnabled());

        By fileList = By.className("ac-analysis-code-list");
        WebElement removeIco = driver.findElement(fileList).findElement(By.className("ac-analysis-code-item__action-ico--remove"));
        Assert.assertFalse(removeIco.isDisplayed());
    }

    @Test
    public void test06UnlockCodeFile() throws Exception {

        openAnalysis();

        driver.findElement(ByBuilder.tab("Unlock")).click();
        Thread.sleep(3000);//todo

        WebElement addDocumentButton = driver.findElement(By.className("ac-analysis-code-list"))
                .findElement(By.className("ac-analysis-add-code"));
        Assert.assertTrue(addDocumentButton.isEnabled());

        By fileList = By.className("ac-analysis-code-list");
        WebElement removeIco = driver.findElement(fileList).findElement(By.className("ac-analysis-code-item__action-ico--remove"));
        Assert.assertTrue(removeIco.isDisplayed());
    }

    @Test

    public void test07RemoveCodeFile() throws Exception {

        openAnalysis();

        By fileList = By.className("ac-analysis-code-list");
        waitFor(driver, fileList);
        WebElement removeIco = driver.findElement(fileList).findElement(By.className("ac-analysis-code-item__action-ico--remove"));
        removeIco.click();
        acceptAlert();
        waitFor(driver, ByBuilder.byClassAndText("ac-list-item__content", "No code files available"));
    }

}
