package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;

import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import com.odysseusinc.arachne.portal.front.utils.Utils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public abstract class BaseStudyTest extends BaseUserTest {

    protected static void createStudy(StudyData studyData) {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        final By sideBarTab = ByBuilder.sideBarTab("Study Notebook");
        Utils.waitForPageLoad(driver, sideBarTab);
        driver.findElement(sideBarTab).click();
        Utils.waitForPageLoad(driver, ByBuilder.toolbar("studies"));
        final By addStudyButton = ByBuilder.buttonAddIco();
        waitFor(driver, addStudyButton);
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
        logout();
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
