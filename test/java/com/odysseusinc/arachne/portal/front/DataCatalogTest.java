package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import com.odysseusinc.arachne.portal.front.utils.Utils;
import java.util.List;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public final class DataCatalogTest extends BaseDataCatalogTest {
    private final static String SIDEBAR_TAB_LABEL = "Data catalog";

    @Before
    public void beforeDataCatalogTest() {

        showDataCatalogPage();
    }

    @After
    public void afterDataCatalogTest() {

        logout();
    }

    @Test
    public void test01ShowDataSourceList() {

        final By datasourceTable = ByBuilder.tableWithHeader("Name");
        waitFor(driver, datasourceTable);
        final List<WebElement> elements = driver.findElement(datasourceTable).findElements(By.xpath(".//tbody/tr"));
        Assert.assertEquals(DATA_SOURCE_DATA_SET.size(), elements.size());
    }

    @Test
    @Ignore
    public void test02ShowFilteredDataSourceList() {

    }

    @Test
    public void test03ShowDataSourceDetails() {

        final DataSourceData dataSourceData = DATA_SOURCE_DATA_SET.get(0);
        driver.findElement(ByBuilder.text(DATANODE_NAME + ": " + dataSourceData.name)).click();
        final By toolbar = ByBuilder.toolbar(dataSourceData.name);
        Utils.waitForPageLoad(driver, toolbar);
    }

    private static void showDataCatalogPage() {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        final By expertFinderTab = ByBuilder.sideBarTab(SIDEBAR_TAB_LABEL);
        waitForPageLoad(driver, expertFinderTab);
        driver.findElement(expertFinderTab).click();
        waitForPageLoad(driver, ByBuilder.toolbar(SIDEBAR_TAB_LABEL));
    }
}
