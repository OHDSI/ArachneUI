package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.BaseStudyTest.createAnalysisFromStudy;
import static com.odysseusinc.arachne.portal.front.BaseStudyTest.createStudy;
import static com.odysseusinc.arachne.portal.front.ProfileManagerTest.updateName;
import static com.odysseusinc.arachne.portal.front.StudyManagerTest.loginAndOpenStudy;
import static com.odysseusinc.arachne.portal.front.StudyManagerTest.openDatasourcesTab;
import static com.odysseusinc.arachne.portal.front.StudyManagerTest.openParticipantsTab;
import static com.odysseusinc.arachne.portal.front.StudyManagerTest.returnToStudyPage;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;

import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import java.io.IOException;
import java.util.List;
import org.junit.After;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class StudyWithDataSourceManagerTest extends BaseDataCatalogTest {

    private static final String STUDY_NAME = "TEST Study";
    private static final String NAME_DS = "TestNode: Test Data Source 2";
    private static final String ANALYSIS_NAME = "Test analysis";

    private static final BaseStudyTest.StudyData STUDY_DATA =
            new BaseStudyTest.StudyData(STUDY_NAME, "Clinical Trial Design", "Initiate");

    @BeforeClass
    public static void beforeStudyWithDataSourceManagerTests() throws Exception {

        updateName(ADMIN_LOGIN, ADMIN_PASSWORD, "4");

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        createStudy(STUDY_DATA);
        createAnalysisFromStudy(ANALYSIS_NAME);

        returnToStudyPage();

        logout();
    }

    @After
    public void afterStudyWithDataSourceManagerTest() throws IOException {

        logout();
    }

    @Test
    public void test01AddDatasource() throws Exception {

        loginAndOpenStudy(STUDY_NAME);
        addDataSourceToStudy(NAME_DS, "2");

        List<WebElement> rows = driver.findElements(By.className("ac-list-item__content"));


        Assert.assertTrue(rows.stream()
                .anyMatch(row ->
                        row.findElement(ByBuilder.link(NAME_DS)).isDisplayed()));
        Assert.assertTrue(rows.stream()
                .anyMatch(row ->
                        row.findElement(ByBuilder.byClassAndText("ac-study-datasource-item__status ac-study-datasource-item__status--approved", "approved")).isDisplayed()));

        openParticipantsTab();
        List<WebElement> addedRows = driver.findElements(By.className("ac-list-item"));


        WebElement result = addedRows.stream()
                .filter(row -> row.findElement(By.className("ac-study-participants-item__role")).getText()
                        .equals("Data Set Owner"))
                .findAny().get();

        Assert.assertTrue(result.findElement(ByBuilder.byClassAndText("ac-study-participants-item__status",
                "approved")).isDisplayed());
        Assert.assertTrue(result.findElement(By.className("ac-study-participants-item__name")).getText()
                .equals("admin4 admin4 admin4"));
    }

    protected static void addDataSourceToStudy(String dataSourceName, String searchKeys) throws Exception {

        openDatasourcesTab();

        waitFor(driver, ByBuilder.byClassAndText("ac-list-item__content", "No attached data sources"));

        WebElement datasourceAddBtm = driver.findElement(ByBuilder.byClassAndText("ac-list-item__content", "Add Data Source"));
        datasourceAddBtm.click();
        waitFor(driver, ByBuilder.byClassAndText("ac-tabs__item--selected", "Data catalog"));

        WebElement dsSelect = driver.findElement(ByBuilder.inputWithAutoComplete("Filter by name"));
        Actions actions = new Actions(driver);
        actions.moveToElement(dsSelect).click().sendKeys(searchKeys).build().perform();

        waitFor(driver, ByBuilder.byClassAndText("ac-label-data-source__name", dataSourceName));

        actions.moveToElement(driver.findElement(
                ByBuilder.byClassAndText("ac-label-data-source__name", dataSourceName))).click().build().perform();

        WebElement addDSBtm = driver.findElement(ByBuilder.button("Add data source"));
        addDSBtm.click();

        waitFor(driver, ByBuilder.link(dataSourceName));
    }

    @Test
    public void test02RemoveDataSource() throws Exception {

        loginAndOpenStudy();
        openDatasourcesTab();

        waitFor(driver, ByBuilder.link(NAME_DS));

        WebElement deleteIco = driver.findElement(By.className("ac-study-datasource-item__action"));
        deleteIco.click();

        acceptAlert();

        waitFor(driver, By.className("ac-study-datasource-item__status--suspended"));
        List<WebElement> datasourceRows = driver.findElements(By.className("ac-list-item__content"));

        Assert.assertTrue(datasourceRows.get(0).findElement(ByBuilder.link(NAME_DS)).isDisplayed());
        Assert.assertEquals("SUSPENDED", datasourceRows.get(0)
                .findElement(By.className("ac-study-datasource-item__status--suspended")).getText());

        openParticipantsTab();

        List<WebElement> rows = driver.findElements(By.className("ac-list-item"));
        WebElement result = rows.stream()
                .filter(row -> row.findElement(By.className("ac-study-participants-item__role")).getText()
                        .equals("Data Set Owner"))
                .findAny().get();

        Assert.assertTrue(result.findElement(ByBuilder.byClassAndText("ac-study-participants-item__status", "disabled")).isDisplayed());
        Assert.assertTrue(result.findElement(By.className("ac-study-participants-item__name")).getText()
                .equals("admin4 admin4 admin4"));

    }
}
