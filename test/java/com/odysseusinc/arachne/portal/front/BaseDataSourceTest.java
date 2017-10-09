package com.odysseusinc.arachne.portal.front;

import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import com.odysseusinc.arachne.portal.front.utils.Utils;
import java.util.List;
import org.junit.BeforeClass;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;

public abstract class BaseDataSourceTest extends BaseUserTest {

    protected static final String DATANODE_NAME_PLACEHOLDER = "Name of data node";
    protected static final String DATANODE_DESCRIPTION_PLACEHOLDER = "Description";

    protected static final String DATANODE_NAME = "TestNode";
    protected static final String DATANODE_DESCRIPTION = "TestNode Description";

    protected static final String DATASOURCE_NAME_PLACEHOLDER = "Name of data source";
    protected static final String DATASOURCE_DBMS_TYPE_PLACEHOLDER = "DBMS Type";
    protected static final String DATASOURCE_CONN_STRING_PLACEHOLDER = "Connection string";
    protected static final String DATASOURCE_CDM_SCHEMA_NAME_PLACEHOLDER = "CDM schema name";
    protected static final String DATASOURCE_USERNAME_PLACEHOLDER = "Username";
    protected static final String DATASOURCE_PASSWORD_PLACEHOLDER = "Password";
    protected static final String DATASOURCE_ORGANIZATION_PLACEHOLDER = "Organization";
    protected static final String DATASOURCE_VERSION_PLACEHOLDER = "Version";

    protected static final DataSourceData DATA_SOURCE_DATA = new DataSourceData(
            "Test Data Source",
            "PostgreSQL",
            "jdbc:postgresql://odysseusovh02.odysseusinc.com:5432/cdm_v500_synpuf_v101_110k",
            "public",
            "ohdsi",
            "ohdsi",
            "Odysseus inc",
            "CDM",
            "v5.1");

    @BeforeClass
    public static void beforeDataSourceTest() {

        //Create user or other stuff
    }

    protected static void createDataSource(DataSourceData dataSource) {

        loginDataNode(ADMIN_LOGIN, ADMIN_PASSWORD);
        driver.findElement(ByBuilder.buttonAddIco()).click();

        registerDataNodeIfModalIsAppeared();

        final By modal = ByBuilder.modal("Create data source");
        Utils.waitFor(driver, modal);
        final WebElement modalElement = driver.findElement(modal);

        final By name = ByBuilder.input(DATASOURCE_NAME_PLACEHOLDER);
        modalElement.findElement(name).sendKeys(dataSource.name);

        final By dbmsType = ByBuilder.select(DATASOURCE_DBMS_TYPE_PLACEHOLDER);
        final By selectOption = ByBuilder.selectOption(dataSource.dbmsType);

        Utils.selectOption(driver, dbmsType, selectOption, modal);

        final By connString = ByBuilder.input(DATASOURCE_CONN_STRING_PLACEHOLDER);
        modalElement.findElement(connString).sendKeys(dataSource.connectionString);

        final By schemaName = ByBuilder.input(DATASOURCE_CDM_SCHEMA_NAME_PLACEHOLDER);
        modalElement.findElement(schemaName).sendKeys(dataSource.schemaName);

        final By username = ByBuilder.input(DATASOURCE_USERNAME_PLACEHOLDER);
        modalElement.findElement(username).sendKeys(dataSource.username);

        final By confirmPassword = ByBuilder.input(DATASOURCE_PASSWORD_PLACEHOLDER);
        modalElement.findElement(confirmPassword).sendKeys(dataSource.password);

        final By button = ByBuilder.button("Create");
        modalElement.findElement(button).click();

        final By toolbar = ByBuilder.toolbar("CDM Data sources");
        Utils.waitForPageLoad(driver, toolbar);

        final By registerButton = ByBuilder.button("Register");
        Utils.waitFor(driver, registerButton);
        driver.findElement(registerButton).click();

        final By datasourceToolbar = ByBuilder.toolbar(dataSource.name);
        Utils.waitFor(driver, datasourceToolbar);

        final By organization = ByBuilder.input(DATASOURCE_ORGANIZATION_PLACEHOLDER);
        driver.findElement(organization).sendKeys(dataSource.organization);

        final By version = ByBuilder.select(DATASOURCE_VERSION_PLACEHOLDER);
        final By versionOption = ByBuilder.selectOption(dataSource.version);
        Utils.selectOption(driver, version, versionOption, null);

        driver.findElement(registerButton).click();
        Utils.waitFor(driver, toolbar);

        final By datasourceTable = By.className("ac-data-source-list-table");
        final List<WebElement> elements = driver.findElement(datasourceTable).findElements(By.xpath(".//tbody/tr"));

        logout();
    }

    private static void registerDataNodeIfModalIsAppeared() {

        try {
            final By createDataNodeModal = ByBuilder.modal("Create Data Node");
            Utils.waitFor(driver, createDataNodeModal);
            final WebElement createDataNodeModalElement = driver.findElement(createDataNodeModal);
            final By dataNodeName = ByBuilder.input(DATANODE_NAME_PLACEHOLDER);
            createDataNodeModalElement.findElement(dataNodeName).sendKeys(DATANODE_NAME);
            final By dataNodeDesc = ByBuilder.textArea(DATANODE_DESCRIPTION_PLACEHOLDER);
            createDataNodeModalElement.findElement(dataNodeDesc).sendKeys(DATANODE_DESCRIPTION);
            createDataNodeModalElement.findElement(ByBuilder.button("Create")).click();
        } catch (TimeoutException ignored) {
        }
        Utils.waitFor(driver, ByBuilder.modal("Create data source"), 7);
    }

    protected static class DataSourceData {
        protected String name;
        protected String dbmsType;
        protected String connectionString;
        protected String schemaName;
        protected String username;
        protected String password;
        protected String organization;
        protected String modelType;
        protected String version;

        public DataSourceData(String name,
                              String dbmsType,
                              String connectionString,
                              String schemaName,
                              String username,
                              String password,
                              String organization,
                              String modelType,
                              String version) {

            this.name = name;
            this.dbmsType = dbmsType;
            this.connectionString = connectionString;
            this.schemaName = schemaName;
            this.username = username;
            this.password = password;
            this.organization = organization;
            this.modelType = modelType;
            this.version = version;
        }
    }
}
