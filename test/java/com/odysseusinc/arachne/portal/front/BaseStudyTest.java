package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.StudyManagerTest.PLACEHOLDER_ANALYSIS_TITLE;
import static com.odysseusinc.arachne.portal.front.StudyManagerTest.PLACEHOLDER_STUDY_TYPE;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;

import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import com.odysseusinc.arachne.portal.front.utils.Utils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

public abstract class BaseStudyTest extends BaseUserTest {

    protected static final String MODAL_TITLE_CREATE_ANALYSIS = "Create analysis";

    protected static void createAdminStudy(StudyData studyData) {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        createStudy(studyData);
        logout();
    }

    protected static void createStudy(StudyData studyData) {

        final By sideBarTab = ByBuilder.sideBarTab("Study Notebook");
        Utils.waitForPageLoad(driver, sideBarTab);
        driver.findElement(sideBarTab).click();

        Utils.waitFor(driver, ByBuilder.toolbar("studies"));
        final By addStudyButton = ByBuilder.buttonAddIco();
        // todo pozhidaeva
        try {
            Thread.sleep(3000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        Utils.waitFor(driver, addStudyButton);
        driver.findElement(addStudyButton).click();

        final By createStudyModal = ByBuilder.modal("Create study");
        Utils.waitFor(driver, createStudyModal);

        final WebElement createStudyModalElement = driver.findElement(createStudyModal);
        createStudyModalElement.findElement(ByBuilder.input("Name of study"))
                .sendKeys(studyData.title);

        final By select = ByBuilder.select("Type");
        final By selectOption = ByBuilder.selectOption(studyData.type);
        Utils.selectOption(driver, select, selectOption, createStudyModal);

        final By createButton = ByBuilder.button("Create");
        createStudyModalElement.findElement(createButton).click();

        Utils.waitForPageLoad(driver, ByBuilder.toolbar(studyData.title));
    }

    protected static void createAnalysisFromStudy(String name) {

        WebElement addAnalysisBtn = driver
                .findElement(By.className("ac-study-analyses-list"))
                .findElement(ByBuilder.byClassAndText("ac-list-item__content", "Add analysis"));
        addAnalysisBtn.click();
        String analysisType = "Patient Level Prediction";

        WebElement modal = driver.findElement(ByBuilder.modal(MODAL_TITLE_CREATE_ANALYSIS));
        WebElement titleInput = modal.findElement(ByBuilder.input(PLACEHOLDER_ANALYSIS_TITLE));
        WebElement analysisTypeSelect = modal.findElement(ByBuilder.select(PLACEHOLDER_STUDY_TYPE));
        WebElement analysisTypeOption = modal.findElement(ByBuilder.selectOption(analysisType));

        WebElement createBtn = modal.findElement(ByBuilder.button("Create"));

        titleInput.sendKeys(name);

        Actions actions = new Actions(driver);
        actions.moveToElement(analysisTypeSelect).click().build().perform();
        actions.moveToElement(analysisTypeOption).click().build().perform();

        createBtn.click();
        // redirect to analysis page
        waitFor(driver, ByBuilder.toolbar(name));
    }

    protected static class StudyData {
        protected String title;
        protected String type;
        protected String status;

        public StudyData(String title, String type, String status) {

            this.title = title;
            this.type = type;
            this.status = status;
        }
    }
}
