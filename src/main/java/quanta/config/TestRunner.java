package quanta.config;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import lombok.extern.slf4j.Slf4j;
import quanta.mongo.AppStartupEvent;
import quanta.test.TestIntf;

@Component
@Slf4j 
public class TestRunner {
	@Autowired
	private ApplicationContext context;

	@Autowired
	private AppProp appProp;

	@EventListener
    public void onApplicationEvent(AppStartupEvent event) {
        test();
    }

	/*
	 * I've removed JUnit (for now) so that we can alway test *only* in a full environment and inside a
	 * docker container. on a *real* setup/instance.
	 */
	public void test() {
		List<String> tests = appProp.getRunTests();

		if (!CollectionUtils.isEmpty(tests)) {
			log.debug("====================================================================");
			tests.forEach(testClass -> {
				try {
					log.debug("RUNNING TEST CLASS: " + testClass);
					TestIntf testInst = (TestIntf) context.getBean(testClass);
					testInst.test();
				} catch (Exception e) {
					log.error("test failed.", e);
				} finally {

				}
			});
			log.debug("Finished running tests.");
			log.debug("====================================================================");
		}
	}
}
