package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import com.odysseusinc.arachne.portal.front.utils.Utils;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class StudyNotebookTest extends BaseStudyNotebookTest {
    private final static String SIDEBAR_TAB_LABEL = "Study Notebook";
    private final static String TOOLBAR_LABEL = "Studies";

    @Before
    public void beforeStudyListTest() {

        showStudyListPage();
    }

    @After
    public void afterStudyListTest() {

        logout();
    }

    @Test
    public void test01ShowStudyList() {

        compareWithoutOrdering(ALL_STUDIES_TEST_DATA);
    }

    @Test
    @Ignore
    public void test02ShowFilteredStudyList() {


        filter("Type", "Clinical Trial Design");
        compareWithoutOrdering(ALL_STUDIES_TEST_DATA.stream().filter(s -> s.type.equals("Clinical Trial Design")).collect(Collectors.toList()));

        filter("Type", "Safety and Efficacy");
        compareWithoutOrdering(ALL_STUDIES_TEST_DATA.stream().filter(s -> s.type.equals("Safety and Efficacy")).collect(Collectors.toList()));

        filter("Type", "Other");
        compareWithoutOrdering(ALL_STUDIES_TEST_DATA.stream().filter(s -> s.type.equals("Other")).collect(Collectors.toList()));


    }

    private void filter(String selectField, String selectTarget) {

        driver.findElement(ByBuilder.filterButton()).click();
        final By filterPanel = By.className("ac-filters-list__content");
        waitFor(driver, filterPanel);
        final By statusSelect = ByBuilder.select(selectField);
        final By statusSelectOption = ByBuilder.selectOption(selectTarget);
        Utils.selectOption(driver, statusSelect, statusSelectOption, filterPanel);
        driver.findElement(ByBuilder.toolbar(TOOLBAR_LABEL)).click();
    }

    @Test
    @Ignore
    public void test03ShowSortedStudyList() {

        final List<StudyData> sorted = ALL_STUDIES_TEST_DATA.stream()
                .sorted(Comparator.comparing(o -> o.title))
                .collect(Collectors.toList());
        final List<WebElement> rows = getStudyRows();
        for (int i = 0; i < rows.size(); i++) {
            Assert.assertTrue(rows.get(i).findElement(ByBuilder.text(sorted.get(i).title)).isDisplayed());
        }
    }

    private void compareWithoutOrdering(List<StudyData> data) {

        data.forEach(study -> waitFor(driver, ByBuilder.text(study.title)));

        getStudyRows().forEach(row -> {
            final boolean exists = data.stream()
                    .anyMatch(s -> {
                        try {
                            return row.findElement(ByBuilder.text(s.title)).isDisplayed()
                                    && row.findElement(ByBuilder.text(s.type)).isDisplayed();
                        } catch (NoSuchElementException ignored) {
                            return false;
                        }
                    });
            Assert.assertTrue(exists);
        });
    }

    protected static List<WebElement> getStudyRows() {

        final By studiesTable = ByBuilder.tableWithHeader("Study");
        waitFor(driver, studiesTable);
        return driver.findElement(studiesTable).findElements(By.xpath(".//tbody/tr"));
    }

    protected static WebElement getStudyRow(String studyName) {

        waitFor(driver, ByBuilder.byClassAndText("ac-title-study__title",studyName));
        return getOptionalStudyRow(studyName).get();
    }

    protected static Optional<WebElement> getOptionalStudyRow(String studyName) {

        return getStudyRows().stream().filter(r ->
                studyName.equals(r.findElement(By.className("ac-title-study__title")).getText()))
                .findFirst();
    }

    private static void showStudyListPage() {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        final By expertFinderTab = ByBuilder.sideBarTab(SIDEBAR_TAB_LABEL);
        waitForPageLoad(driver, expertFinderTab);
        driver.findElement(expertFinderTab).click();
        waitForPageLoad(driver, ByBuilder.toolbar(TOOLBAR_LABEL));
    }

}
