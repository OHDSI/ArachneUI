package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;
import static java.util.concurrent.TimeUnit.MINUTES;
import static java.util.concurrent.TimeUnit.SECONDS;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import java.io.IOException;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.NotFoundException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.FixedHostPortGenericContainer;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.wait.HttpWaitStrategy;
import org.testcontainers.containers.wait.Wait;
import org.testcontainers.containers.wait.WaitStrategy;

/*
   "Local-profile" runs postgres-portal(exposed port: 5489), postgres-datanode(exposed port: 5490),
   solr(exposed port: 8995), mailhog(exposed port: 8025) containers for local testing.
   For portal and datanode use selenium-test profiles.
   "Full-profile" runs portal, datanode and mailhog containers (all with random exposed port) in network.
   Don't forget provide external parameter value: arachne-tag (required), jasypt.encryptor.password (required),
   jasypt.encryptor.algorythm (required), local-profile, pg-tag, solr-tag, mailhog-tag.
 */
public class BaseTest {

    protected static final Log logger = LogFactory.getLog(BaseTest.class);

    protected static final boolean USE_SSL = false;
    protected static final int SOLR_PORT = 8985;
    protected static final int PG_PORTAL_PORT = 5489;
    protected static final int PG_DATANODE_PORT = 5490;
    protected static final int MAIL_API_PORT = 8025;
    protected static final int MAIL_SMTP_PORT = 1025;
    protected static boolean LOCAL_RUNNING = false;
    protected static String ARACHNE_TAG;
    protected static String PG_TAG = "9.6.5";
    protected static String MAILHOG_TAG = "latest";
    protected static String SOLR_TAG = "1.0.0";

    protected static final String PROTOCOL = USE_SSL ? "https" : "http";

    protected static final String ADMIN_LOGIN = "admin@odysseusinc.com";
    protected static final String ADMIN_PASSWORD = "password";

    protected static String MAIL_SERVER_API_MESSAGES;

    protected static String PORTAL_BASE_URL = "http://localhost:8080";
    protected static String DATA_NODE_BASE_URL = "https://localhost:8880";

    protected static final String EMAIL_INPUT_PLACEHOLDER = "Email address";
    protected static final String PASSWORD_INPUT_PLACEHOLDER = "Password";

    protected static WebDriver driver;
    protected static CloseableHttpClient httpClient;
    protected static GenericContainer mailhogContainer;
    protected static GenericContainer portalContainer;
    protected static GenericContainer datanodeContainer;

    protected static GenericContainer portalPostgresContainer;
    protected static GenericContainer datanodePostgresContainer;
    protected static GenericContainer solrContainer;

    @BeforeClass
    public static void setup() {

        ARACHNE_TAG = System.getProperty("arachne-tag");

        LOCAL_RUNNING = Boolean.getBoolean(System.getProperty("local-profile"));
        PG_TAG = parameterValue(PG_TAG, "pg-tag");
        MAILHOG_TAG = parameterValue(MAILHOG_TAG, "mailhog-tag");
        SOLR_TAG = parameterValue(SOLR_TAG, "solr-tag");

        httpClient = getHttpClient();

        final Network.NetworkImpl network = LOCAL_RUNNING ? null : Network.builder().build();

        String uuid = UUID.randomUUID().toString();
        String portalContainerName = "selenium-portal-" + uuid;
        String portalPGContainerName = "portal-pg-" + uuid;
        String datanodePGContainerName = "datanode-pg-" + uuid;
        mailhogContainer = createMailServerContainer(network);

        // if chrome.exe is in not default dir
        /* Map<String, Object> chromeOptions = new HashMap<>();
        chromeOptions.put("binary", "PATH_TO_CHROME_EXE\\chrome.exe");
        DesiredCapabilities capabilities = DesiredCapabilities.chrome();
        capabilities.setCapability(ChromeOptions.CAPABILITY, chromeOptions);
        driver = new ChromeDriver(capabilities);*/
        driver = new ChromeDriver();

        if (LOCAL_RUNNING) {
            portalPostgresContainer = createLocalProfilePostgresContainer(portalPGContainerName, PG_PORTAL_PORT, "arachne_portal");
            datanodePostgresContainer = createLocalProfilePostgresContainer(datanodePGContainerName, PG_DATANODE_PORT, "datanode");
            solrContainer = createLocalProfileSolrContainer();

            waitManualStarting(PORTAL_BASE_URL, "PORTAL");
            waitManualStarting(DATA_NODE_BASE_URL, "DATANODE");
        } else {
            final WaitStrategy arachneWaitStrategy = new HttpWaitStrategy()
                    .forPath("/api/v1/build-number")
                    .withStartupTimeout(Duration.ofMinutes(3));

            createPortalContainer(portalContainerName, mailhogContainer.getContainerInfo(), arachneWaitStrategy,
                    network);
            createDatanodeContainer(portalContainerName, arachneWaitStrategy, network);
        }
    }

    private static String parameterValue(String parameter, String propertyName) {

        String property = System.getProperty(propertyName);
        return property != null ? property : parameter;
    }

    private static void waitManualStarting(String url, String appName) {

        driver.get(url);
        logger.info("START " + appName + " PLEASE");

        FluentWait<WebDriver> wait = new FluentWait<>(driver)
                .withTimeout(2, MINUTES)
                .pollingEvery(10, SECONDS)
                .ignoring(NoSuchElementException.class);

        wait.until(ExpectedConditions.presenceOfElementLocated(By.className("ac-auth")));
    }

    private static void createPortalContainer(String portalContainerName,
                                              InspectContainerResponse mailhogContainerInfo,
                                              WaitStrategy arachneWaitStrategy,
                                              Network.NetworkImpl network) {

        Map<String, String> portalEnvs = new HashMap<>();
        portalEnvs.put("server.ssl.enabled", String.valueOf(USE_SSL));
        portalEnvs.put("portal.url", PROTOCOL + "://portal_host_placeholder:010101");
        portalEnvs.put("spring.mail.host", mailhogContainerInfo.getConfig().getHostName());
        portalEnvs.put("spring.mail.port", "1025");
        portalEnvs.put("spring.mail.properties.mail.smtp.auth", "false");
        portalEnvs.put("spring.mail.properties.mail.smtp.starttls.enable", "false");
        portalEnvs.put("spring.mail.properties.mail.smtp.starttls.required", "false");
        portalEnvs.put("portal.hostsWhiteList", "localhost," + portalContainerName);

        portalEnvs.put("jasypt.encryptor.password", System.getProperty("jasypt.encryptor.password"));

        portalContainer = new GenericContainer("hub.arachnenetwork.com/portal:" + ARACHNE_TAG)
                .withEnv(portalEnvs)
                .withNetwork(network)
                .withExposedPorts(8080)
                .waitingFor(arachneWaitStrategy);

        portalContainer.start();

        String oldName = portalContainer.getContainerName().substring(1);
        DockerClientFactory.instance().client().renameContainerCmd(oldName).withName(portalContainerName).exec();

        final String portalHost = portalContainer.getContainerIpAddress();
        final Integer portalPort = portalContainer.getMappedPort(8080);
        PORTAL_BASE_URL = String.format("%s://%s:%s", PROTOCOL, portalHost, portalPort);
    }

    private static void createDatanodeContainer(String portalContainerName,
                                                WaitStrategy arachneWaitStrategy,
                                                Network.NetworkImpl network) {

        Map<String, String> datanodeEnvs = new HashMap<>();
        datanodeEnvs.put("server.ssl.enabled", String.valueOf(USE_SSL));
        datanodeEnvs.put("datanode.arachneCentral.host", "http://" + portalContainerName);
        datanodeEnvs.put("datanode.arachneCentral.port", "8080");
        datanodeEnvs.put("datanode.baseURL", "https://#{systemProperties['HOSTNAME']}");
        datanodeEnvs.put("ACHILES_STARTUP", "1");

        datanodeEnvs.put("jasypt.encryptor.password", System.getProperty("jasypt.encryptor.password"));
        datanodeEnvs.put("jasypt.encryptor.algorythm", System.getProperty("jasypt.encryptor.algorythm"));

        datanodeContainer = new GenericContainer("hub.arachnenetwork.com/datanode:" + ARACHNE_TAG)
                .withEnv(datanodeEnvs)
                .withNetwork(network)
                .withExposedPorts(8880)
                .waitingFor(arachneWaitStrategy);
        datanodeContainer.start();

        final String datanodeHost = datanodeContainer.getContainerIpAddress();
        final Integer datanodePort = datanodeContainer.getMappedPort(8880);
        DATA_NODE_BASE_URL = String.format("%s://%s:%s", PROTOCOL, datanodeHost, datanodePort);
    }

    private static FixedHostPortGenericContainer createLocalProfilePostgresContainer(String containerName,
                                                                                     Integer mappedPort,
                                                                                     String dbName) {

        Map<String, String> envs = new HashMap<>();

        envs.put("POSTGRES_USER", "ohdsi");
        envs.put("POSTGRES_PASSWORD", System.getProperty("postgres.password"));
        envs.put("POSTGRES_DB", dbName);

        FixedHostPortGenericContainer container = new FixedHostPortGenericContainer("postgres:" + PG_TAG);
        container.withEnv(envs);
        container.withFixedExposedPort(mappedPort, 5432);
        container.start();

        String oldPGName = container.getContainerName().substring(1);
        DockerClientFactory.instance().client().renameContainerCmd(oldPGName).withName(containerName).exec();
        return container;
    }


    private static FixedHostPortGenericContainer createMailServerContainer(Network.NetworkImpl network) {

        FixedHostPortGenericContainer mailhogContainer = new FixedHostPortGenericContainer("mailhog/mailhog:" + MAILHOG_TAG);

        if (network == null) {
            mailhogContainer.withFixedExposedPort(MAIL_API_PORT, 8025);
            mailhogContainer.withFixedExposedPort(MAIL_SMTP_PORT, 1025);
        } else {
            mailhogContainer.withNetwork(network);
            mailhogContainer.withExposedPorts(8025);
        }
        mailhogContainer.waitingFor(Wait.forHttp("/api/v1/messages"));
        mailhogContainer.start();

        final String mailhogHost = mailhogContainer.getContainerIpAddress();
        final Integer mailhogApiPort = mailhogContainer.getMappedPort(8025);
        final Integer mailhogSmtpPort = mailhogContainer.getMappedPort(1025);

        MAIL_SERVER_API_MESSAGES = String.format("http://%s:%s/api/v1/messages", mailhogHost, mailhogApiPort);
        return mailhogContainer;
    }


    private static GenericContainer createLocalProfileSolrContainer() {

        FixedHostPortGenericContainer solrContainer = new FixedHostPortGenericContainer("hub.arachnenetwork.com/solr:" + SOLR_TAG);
        solrContainer.withFixedExposedPort(SOLR_PORT, 8983);
        solrContainer.start();
        return solrContainer;
    }

    @AfterClass
    public static void shutdown() throws IOException {

        if (driver != null) {
            driver.close();
            driver = null;
        }
        mailhogContainer.stop();
        if (LOCAL_RUNNING) {
            portalPostgresContainer.stop();
            datanodePostgresContainer.stop();
            solrContainer.stop();
        } else {
            datanodeContainer.stop();
            portalContainer.stop();
        }
        httpClient.close();
    }

    @Before
    public void before() throws IOException {

//        shutdown();
//        setup();
    }

    @After
    public void after() throws IOException {

//        shutdown();
    }

    protected static String portalUrl() {

        return portalUrl("");
    }

    protected static String dataNodeUrl() {

        return dataNodeUrl("");
    }

    protected static String portalUrl(String relativePath) {

        return PORTAL_BASE_URL + relativePath;
    }

    protected static String dataNodeUrl(String relativePath) {

        return DATA_NODE_BASE_URL + relativePath;
    }

    protected static void loginPortal(String username, String password) {

        driver.get(portalUrl());
        loginWithOpenedForm(username, password);
    }

    protected static void loginWithOpenedForm(String username, String password) {

        waitFor(driver, ByBuilder.input(EMAIL_INPUT_PLACEHOLDER));

        WebElement loginInput = driver.findElement(ByBuilder.input(EMAIL_INPUT_PLACEHOLDER));
        WebElement passwordInput = driver.findElement(ByBuilder.input(PASSWORD_INPUT_PLACEHOLDER));

        loginInput.sendKeys(username);
        passwordInput.sendKeys(password, Keys.ENTER);

        waitFor(driver, ByBuilder.toolbar("studies"));
    }

    protected static void loginDataNode(String username, String password) throws Exception {

        driver.get(dataNodeUrl());
        Thread.sleep(2000);

        waitForPageLoad(driver, ByBuilder.input(EMAIL_INPUT_PLACEHOLDER));

        WebElement loginInput = driver.findElement(ByBuilder.input(EMAIL_INPUT_PLACEHOLDER));
        WebElement passwordInput = driver.findElement(ByBuilder.input(PASSWORD_INPUT_PLACEHOLDER));

        loginInput.sendKeys(username);
        passwordInput.sendKeys(password, Keys.ENTER);

        Thread.sleep(3000);
        waitForPageLoad(driver, ByBuilder.toolbar("CDM Data sources"));
    }

    private final static CloseableHttpClient getHttpClient() {

        TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {

                    @Override
                    public java.security.cert.X509Certificate[] getAcceptedIssuers() {

                        return null;
                    }

                    @Override
                    public void checkClientTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {

                    }

                    @Override
                    public void checkServerTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {

                    }
                }
        };
        CloseableHttpClient closeableHttpClient = null;
        try {
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sc);
            HttpClientBuilder httpClientBuilder = HttpClients.custom();
            closeableHttpClient = httpClientBuilder.setSSLSocketFactory(csf).build();
        } catch (KeyManagementException | NoSuchAlgorithmException ex) {
        }
        return closeableHttpClient;
    }

    protected static List<String> getLinksFromMail() throws IOException {

        final ObjectMapper mapper = new ObjectMapper();
        TypeReference<ArrayList<LinkedHashMap<String, Object>>> typeRef
                = new TypeReference<ArrayList<LinkedHashMap<String, Object>>>() {
        };

        final URL url = new URL(MAIL_SERVER_API_MESSAGES);
        ArrayList<LinkedHashMap<String, Object>> mails = mapper.readValue(url, typeRef);
        final LinkedHashMap<String, Object> mail = mails.stream()
                .findFirst()
                .orElseThrow(NotFoundException::new);

        final String body = (String) ((LinkedHashMap<String, Object>) mail.get("Content")).get("Body");

        List<String> links = new ArrayList<>();
        String regexString = Pattern.quote("<a href=\"") + "(.*?)" + Pattern.quote("\"");
        Pattern pattern = Pattern.compile(regexString);
        Matcher matcher = pattern.matcher(body);

        while (matcher.find()) {
            String textInBetween = matcher.group(1);
            textInBetween = textInBetween.replace(PROTOCOL + "://portal_host_placeholder:010101", PORTAL_BASE_URL);
            links.add(textInBetween);
        }
        return links;
    }

    protected static String getLinkFromMail() throws IOException {

        return getLinksFromMail().get(0);
    }

    protected void acceptAlert() {

        WebDriverWait waitForAlert = new WebDriverWait(driver, 3L);
        waitForAlert.until(ExpectedConditions.alertIsPresent());

        Alert alert = driver.switchTo().alert();
        alert.accept();
    }
}
