package com.odysseusinc.arachne.portal.front.utils;

import com.google.common.base.Predicate;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Utils {

    private Utils() {

    }

    protected static Long PAGE_LOAD_TIMEOUT = 5L;

    public static void waitForPageLoad(WebDriver driver, By testEl) {

        waitForPageLoad(driver, testEl, PAGE_LOAD_TIMEOUT);
    }

    public static void waitForPageLoad(WebDriver driver, By testEl, Long timeout) {

        WebDriverWait wait = new WebDriverWait(driver, timeout);
        wait.until(ExpectedConditions.visibilityOfElementLocated(testEl));

        wait.until((Predicate<WebDriver>) predicate -> {
            return !predicate.findElements(testEl).isEmpty() && !predicate.findElement(ByBuilder.loadingPanel()).isDisplayed();
        });
    }

    public static void waitFor(final WebDriver driver, final By testEl) {

        waitFor(driver, testEl, 3L);
    }

    public static void waitFor(final WebDriver driver, final By testEl, final long timeoutInSeconds) {

        WebDriverWait waitForModal = new WebDriverWait(driver, timeoutInSeconds);
        waitForModal.until((Predicate<WebDriver>) d -> d.findElement(testEl).isDisplayed());
    }

    public static void selectOption(final WebDriver driver, final By select, final By selectOption, final By parent) {

        final WebElement selectorWebElement;
        final WebElement selectOptionWebElement;

        if (parent != null) {
            final WebElement parentElement = driver.findElement(parent);
            selectorWebElement = parentElement.findElement(select);
            selectOptionWebElement = parentElement.findElement(selectOption);

        } else {
            selectorWebElement = driver.findElement(select);
            selectOptionWebElement = driver.findElement(selectOption);
        }

        final Actions actions = new Actions(driver);
        actions.moveToElement(selectorWebElement).click().build().perform();
        actions.moveToElement(selectOptionWebElement).click().build().perform();
    }
}
