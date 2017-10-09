package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.google.common.base.Predicate;
import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class StudyManagerTest extends BaseTest {

    private static final String MODAL_TITLE_CREATE_STUDY = "Create study";
    private static final String PLACEHOLDER_STUDY_TITLE = "Name of study";
    private static final String PLACEHOLDER_STUDY_TYPE = "Type";

    @Test
    public void testCreateStudy() throws Exception {

        By addBtn = ByBuilder.buttonAddIco();

        String studyName = "New study " + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        String studyType = "Clinical Trial Design";

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        waitForPageLoad(driver, addBtn);

        WebElement addStudyButton = driver.findElement(addBtn);
        addStudyButton.click();

        final By modal = ByBuilder.modal(MODAL_TITLE_CREATE_STUDY);
        waitFor(driver, modal);

        WebElement modalWebElement = driver.findElement(modal);
        WebElement studyNameInput = modalWebElement.findElement(ByBuilder.input(PLACEHOLDER_STUDY_TITLE));
        WebElement studyTypeSelect = modalWebElement.findElement(ByBuilder.select(PLACEHOLDER_STUDY_TYPE));
        WebElement studyTypeOption = modalWebElement.findElement(ByBuilder.selectOption(studyType));
        WebElement studyCreateBtn = modalWebElement.findElement(ByBuilder.button("Create"));

        studyNameInput.sendKeys(studyName);

        Actions actions = new Actions(driver);
        actions.moveToElement(studyTypeSelect).click().build().perform();
        actions.moveToElement(studyTypeOption).click().build().perform();

        studyCreateBtn.click();

        WebDriverWait waitForCreate = new WebDriverWait(driver, 3);
        waitForCreate.until((Predicate<WebDriver>) driver -> {
            return driver.findElement(ByBuilder.toolbar())
                    .findElement(By.xpath(".//*[contains(@class, 'ac-study-toolbar-title__title') and text()='" + studyName + "']"))
                    .isDisplayed();
        });
    }
}
