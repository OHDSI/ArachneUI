package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import java.io.IOException;
import org.junit.Assert;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class UserManagementTest extends BaseUserTest {

    @Test
    public void test01RegisterNewUser() throws InterruptedException, IOException {

        fillRegisterForm();
        final By welcome = waitWelcome();
        Assert.assertTrue(driver.findElement(welcome).isDisplayed());
    }

    @Test
    public void test02LoginNotEnabledUser() {

        loginPortal(REGISTER_FORM_DATA.get(EMAIL_PLACEHOLDER), REGISTER_FORM_DATA.get(PASSWORD_PLACEHOLDER));
        final By error = ByBuilder.byClassAndText(
                "ac-form-login__error",
                "Please verify your account using link in the email that was sent to you."
        );
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
    }

}
