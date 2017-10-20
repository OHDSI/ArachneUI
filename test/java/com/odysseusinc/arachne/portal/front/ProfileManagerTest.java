package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.BaseUserTest.logout;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;

import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import java.io.IOException;
import org.apache.commons.lang.StringUtils;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class ProfileManagerTest extends BaseTest {

    @AfterClass
    public static void afterProfileManagerTests() throws IOException {

        shutdown();
    }

    @Test
    public void test01UpdateAdminName() throws Exception {

        updateName(ADMIN_LOGIN, ADMIN_PASSWORD, "4");
    }

    protected static void updateName(String login, String password, String postfix) throws InterruptedException {

        loginPortal(login, password);

        Thread.sleep(3000L); // todo pozhidaeva
        By profileMenu = ByBuilder.byClassAndText("ac-profile-menu-item__user-name-part", "admin");
        waitFor(driver, profileMenu);

        WebElement profileMenuWebElement = driver.findElement(profileMenu);
        profileMenuWebElement.click();

        By userProfile = ByBuilder.text("User Profile");
        waitFor(driver, userProfile);//
        WebElement userProfileWebElement = driver.findElement(userProfile);
        userProfileWebElement.click();

        waitFor(driver, ByBuilder.byClassAndText("ac-profile-view__user-name", "admin admin admin"));
        driver.findElement(ByBuilder.byClassAndText("ac-button ac-profile-view__edit-button", "mode_edit")).click();

        By nameEditingDialog = ByBuilder.modal("Edit Name");
        waitFor(driver, nameEditingDialog);

        WebElement modal = driver.findElement(nameEditingDialog);
        WebElement firstNameInput = modal.findElement(ByBuilder.input("First Name*"));
        WebElement middleNameInput = modal.findElement(ByBuilder.input("Middle Name"));
        WebElement lastNameInput = modal.findElement(ByBuilder.input("Last Name*"));
        WebElement saveBtn = modal.findElement(ByBuilder.button("Save"));

        firstNameInput.sendKeys(postfix);
        middleNameInput.sendKeys(postfix);
        lastNameInput.sendKeys(postfix);

        saveBtn.click();
        waitFor(driver, ByBuilder.byClassAndText("ac-profile-view__user-name",
                StringUtils.repeat("admin" + postfix, " ", 3)));
        logout();
    }

}