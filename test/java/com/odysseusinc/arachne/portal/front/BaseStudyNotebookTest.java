package com.odysseusinc.arachne.portal.front;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.BeforeClass;

public abstract class BaseStudyNotebookTest extends BaseStudyTest {

    protected static final List<StudyData> PREDEFINED_STUDIES_TEST_DATA = Arrays.asList(
            new StudyData("Study #1", "Other", "Active"),
            new StudyData("Study #2", "Other", "Active"),
            new StudyData("Study #3", "Other", "Active"),
            new StudyData("Study #4", "Other", "Active"),
            new StudyData("Study #5", "Other", "Active")
    );
    protected static final List<StudyData> STUDIES_TEST_DATA = Arrays.asList(
            new StudyData("Test Study 1", "Clinical Trial Design", "Initiate"),
            new StudyData("Test Study 2", "Clinical Trial Design", "Initiate"),
            new StudyData("Test Study 3", "Safety and Efficacy", "Initiate"),
            new StudyData("Test Study 4", "Safety and Efficacy", "Initiate"),
            new StudyData("Test Study 5", "Safety and Efficacy", "Initiate")
    );

    protected static final List<StudyData> ALL_STUDIES_TEST_DATA = new ArrayList<>();

    static  {
        ALL_STUDIES_TEST_DATA.addAll(PREDEFINED_STUDIES_TEST_DATA);
        ALL_STUDIES_TEST_DATA.addAll(STUDIES_TEST_DATA);
    }

    @BeforeClass
    public static void beforeBaseStudyNotebookTests() {

        createStudySet();
    }

    private static void createStudySet() {

        STUDIES_TEST_DATA.forEach(BaseStudyTest::createAdminStudy);
    }
}
