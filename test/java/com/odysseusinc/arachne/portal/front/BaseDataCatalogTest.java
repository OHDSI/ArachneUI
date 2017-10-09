package com.odysseusinc.arachne.portal.front;

import com.google.common.collect.ImmutableList;
import java.util.List;
import org.junit.BeforeClass;

public abstract class BaseDataCatalogTest extends BaseDataSourceTest {

    protected static final List<DataSourceData> DATA_SOURCE_DATA_SET;
    private static final DataSourceData DATA_SOURCE_DATA_2 = new DataSourceData(
            "Test Data Source 2",
            "PostgreSQL",
            "jdbc:postgresql://odysseusovh02.odysseusinc.com:5432/cdm_v500_synpuf_v101_110k",
            "public",
            "ohdsi",
            "ohdsi",
            "Odysseus inc",
            "CDM",
            "v5.1"
    );
    private static final DataSourceData DATA_SOURCE_DATA_3 = new DataSourceData(
            "Test Data Source 3",
            "PostgreSQL",
            "jdbc:postgresql://odysseusovh02.odysseusinc.com:5432/cdm_v500_synpuf_v101_110k",
            "public",
            "ohdsi",
            "ohdsi",
            "Odysseus inc",
            "CDM",
            "v5.1"
    );

    static {

        DATA_SOURCE_DATA_SET = ImmutableList.<DataSourceData>builder()
                .add(DATA_SOURCE_DATA)
                .add(DATA_SOURCE_DATA_2)
                .add(DATA_SOURCE_DATA_3)
                .build();
    }

    @BeforeClass
    public static void beforeBaseDataCatalogTests() {

        createDataSourceSet();
    }

    private static void createDataSourceSet() {

        DATA_SOURCE_DATA_SET.forEach(BaseDataSourceTest::createDataSource);
    }
}
