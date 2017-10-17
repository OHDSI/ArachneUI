package com.odysseusinc.arachne.portal.front.utils;

import org.openqa.selenium.By;

public class ByBuilder {

    private ByBuilder() {

    }

    public static By button(String label) {

        return By.xpath(".//*[contains(@class, 'ac-button') and text()='" + label + "']");
    }

    public static By buttonAddIco() {

        return By.xpath(".//*[text()='add_circle_outline']");
    }

    public static By buttonIco(String icoName) {

        return By.xpath(".//*[contains(@class,'ac-button')][i[text()='" + icoName + "']]");
    }

    public static By input(String placeholderExpression) {

        return By.xpath(".//input[@placeholder='" + placeholderExpression + "']");
    }

    public static By textArea(String placeholderExpression) {

        return By.xpath(".//textarea[@placeholder='" + placeholderExpression + "']");
    }

    public static By loadingPanel() {

        return By.xpath(".//*[@class='ac-loading-panel']");
    }

    public static By modal(String title) {

        return By.xpath(".//*[contains(@class,'ac-modal')]"
                + "/div[h3[@class='ac-modal__content-title' and text()='" + title + "']]/..");
    }

    public static By filterButton() {

        return By.xpath(".//*[contains(@class, 'ac-badged-icon__icon') and contains(text(), 'filter_list')]");
    }

    public static By filterPanel(String title) {

        return By.xpath(".//*[contains(@class,'ac-panel')]"
                + "/div[h3[@class='ac-panel__title' and text()='" + title + "']]/..");
    }

    public static By select(String placeholder) {

        return By.xpath(".//*[contains(@class, 'ac-select-control__label') and text()='" + placeholder + "']");
    }

    public static By selectOption(String text) {

        return By.xpath(".//*[contains(@class, 'ac-select-option__label') and text()='" + text + "']");
    }

    public static By toolbar(String title) {

        final String selector = String.format(".//*[(@class='ac-toolbar' " +
                        "or starts-with(@class, 'ac-toolbar ')" +
                        "or contains(@class, ' ac-toolbar ') " +
                        "or contains(@class, 'ac-study-toolbar-title__title') " +
                        "or contains(@class, 'ac-toolbar__header') " +
                        " or substring(@class, string-length(@class) - string-length(' ac-toolbar') +1) = ' ac-toolbar'" +
                        ") and .//*[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '%s')]]",
                title.toLowerCase());
        return By.xpath(selector);
    }

    public static By sideBarTab(String label) {

        return byClassAndText("ac-sidebar-tab", label);
    }

    public static By byClassAndText(String className, String text) {

        final String selector = String.format(".//*[contains(@class, '%s') and text()='%s']", className, text);
        return By.xpath(selector);
    }

    public static By toolbar() {

        return toolbar(null);
    }

    public static By link(String text) {

        return byClassAndText("ac-link", text);
    }

    public static By formError(String text) {

        return ByBuilder.byClassAndText("ac-fieldset__error", text);
    }

    public static By text(String text) {

        return By.xpath(".//*[text()='" + text + "']");
    }

    public static By tableWithHeader(String header) {

        return By.xpath(".//table[.//th[.//*[contains(text(), '" + header + "')]]]");
    }


    public static By toolbarEditIco(String title) {

        String selector = ".//*[contains(@class, 'ac-toolbar__edit-ico')" + (title != null ? "and text()='" + title + "'" : "") + "]";
        return By.xpath(selector);
    }


    public static By tableRow(String placeholder) {

        return By.xpath(".//*[contains(@class, 'ac-title-study__title') and text()='" + placeholder + "']");
    }

    public static By tab(String title) {

        String selector = ".//*[contains(@class, 'ac-tabs__item')" + (title != null ? "and text()='" + title + "'" : "") + "]";
        return By.xpath(selector);
    }

}
