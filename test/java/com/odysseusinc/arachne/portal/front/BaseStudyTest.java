package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import com.odysseusinc.arachne.portal.front.utils.Utils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public abstract class BaseStudyTest extends BaseUserTest {

    protected static void createAdminStudy(StudyData studyData) {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        createStudy(studyData);
        logout();
    }

   protected static void createStudy(StudyData studyData) {

        final By sideBarTab = ByBuilder.sideBarTab("Study Notebook");
        Utils.waitForPageLoad(driver, sideBarTab);
        driver.findElement(sideBarTab).click();
        Utils.waitFor(driver, ByBuilder.byClassAndText("ac-toolbar__header"," studies")); //todo
        //Utils.waitFor(driver, ByBuilder.toolbar(" studies"));
        final By addStudyButton = ByBuilder.buttonAddIco();
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
