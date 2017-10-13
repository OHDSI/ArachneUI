package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.github.dockerjava.api.command.InspectContainerResponse;
import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Map;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.wait.HttpWaitStrategy;
import org.testcontainers.containers.wait.Wait;
import org.testcontainers.containers.wait.WaitStrategy;
import org.testcontainers.shaded.com.google.common.collect.ImmutableMap;

public class BaseTest {

    protected static final boolean USE_SSL = false;
    protected static final String PROTOCOL = USE_SSL ? "https" : "http";

    protected static final String ADMIN_LOGIN = "admin@odysseusinc.com";
    protected static final String ADMIN_PASSWORD = "password";

    protected static String MAIL_SERVER_API_MESSAGES;

    protected static String PORTAL_BASE_URL;
    protected static String DATA_NODE_BASE_URL;

    protected static final String EMAIL_INPUT_PLACEHOLDER = "Email address";
    protected static final String PASSWORD_INPUT_PLACEHOLDER = "Password";

    protected static WebDriver driver;
    protected static CloseableHttpClient httpClient;
    protected static GenericContainer mailhogContainer;
    protected static GenericContainer portalContainer;
    protected static GenericContainer datanodeContainer;

    @BeforeClass
    public static void setup() {

        httpClient = getHttpClient();

        final Network.NetworkImpl network = Network.builder().build();

        final WaitStrategy arachneWaitStrategy = new HttpWaitStrategy()
                .forPath("/api/v1/build-number")
                .withStartupTimeout(Duration.ofMinutes(2));

        mailhogContainer = new GenericContainer("mailhog/mailhog:latest")
                .withNetwork(network)
                .withExposedPorts(8025)
                .waitingFor(Wait.forHttp("/api/v1/messages"));
        mailhogContainer.start();

        final String mailhogHost = mailhogContainer.getContainerIpAddress();
        final Integer mailhogApiPort = mailhogContainer.getMappedPort(8025);
        final Integer mailhogSmtpPort = mailhogContainer.getMappedPort(1025);
        MAIL_SERVER_API_MESSAGES = String.format("http://%s:%s/api/v1/messages", mailhogHost, mailhogApiPort);

        final InspectContainerResponse mailhogContainerInfo = mailhogContainer.getContainerInfo();

        Map<String, String> portalEnvs = ImmutableMap.<String, String>builder()
                .put("jasypt.encryptor.password", "arachne")
                .put("server.ssl.enabled", String.valueOf(USE_SSL))
                .put("portal.url", PROTOCOL + "://portal_host_placeholder:010101")
                .put("spring.mail.host", mailhogContainerInfo.getConfig().getHostName())
                .put("spring.mail.port", "1025")
                .put("spring.mail.properties.mail.smtp.auth", "false")
                .put("spring.mail.properties.mail.smtp.starttls.enable", "false")
                .put("spring.mail.properties.mail.smtp.starttls.required", "false")
                .build();

        portalContainer = new GenericContainer("hub.arachnenetwork.com/portal:latest")
                .withEnv(portalEnvs)
                .withNetwork(network)
                .withExposedPorts(8080)
                .waitingFor(arachneWaitStrategy);
        portalContainer.start();

        final String portalHost = portalContainer.getContainerIpAddress();
        final Integer portalPort = portalContainer.getMappedPort(8080);
        PORTAL_BASE_URL = String.format("%s://%s:%s", PROTOCOL, portalHost,  portalPort);

        final InspectContainerResponse portalContainerInfo = portalContainer.getContainerInfo();

        Map<String, String> datanodeEnvs = ImmutableMap.<String, String>builder()
                .put("jasypt.encryptor.password", "arachne")
                .put("server.ssl.enabled", String.valueOf(USE_SSL))
                .put("datanode.arachneCentral.host", "http://" + portalContainerInfo.getConfig().getHostName())
                .put("datanode.arachneCentral.port", "8080")
                .put("datanode.baseURL", "https://#{systemProperties['HOSTNAME']}")
                .put("ACHILES_STARTUP", "1")
                .build();

        datanodeContainer = new GenericContainer("hub.arachnenetwork.com/datanode:latest")
                .withEnv(datanodeEnvs)
                .withNetwork(network)
                .withExposedPorts(8880)
                .waitingFor(arachneWaitStrategy);
        datanodeContainer.start();

        final String datanodeHost = datanodeContainer.getContainerIpAddress();
        final Integer datanodePort = datanodeContainer.getMappedPort(8880);
        DATA_NODE_BASE_URL = String.format("%s://%s:%s", PROTOCOL, datanodeHost,  datanodePort);

        driver = new ChromeDriver();
    }

    @AfterClass
    public static void shutdown() throws IOException {

        if (driver != null) {
            driver.close();
            driver = null;
        }
        datanodeContainer.stop();
        portalContainer.stop();
        mailhogContainer.stop();
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

        waitForPageLoad(driver, ByBuilder.input(EMAIL_INPUT_PLACEHOLDER));

        WebElement loginInput = driver.findElement(ByBuilder.input(EMAIL_INPUT_PLACEHOLDER));
        WebElement passwordInput = driver.findElement(ByBuilder.input(PASSWORD_INPUT_PLACEHOLDER));

        loginInput.sendKeys(username);
        passwordInput.sendKeys(password, Keys.ENTER);
    }

    protected static void loginDataNode(String username, String password) {

        driver.get(dataNodeUrl());

        waitForPageLoad(driver, ByBuilder.input(EMAIL_INPUT_PLACEHOLDER));

        WebElement loginInput = driver.findElement(ByBuilder.input(EMAIL_INPUT_PLACEHOLDER));
        WebElement passwordInput = driver.findElement(ByBuilder.input(PASSWORD_INPUT_PLACEHOLDER));

        loginInput.sendKeys(username);
        passwordInput.sendKeys(password, Keys.ENTER);

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
}
