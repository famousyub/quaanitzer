package quanta.mongo;

import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;
import quanta.config.ServiceBase;
import quanta.util.MongoRunnableEx;
import quanta.util.ThreadLocals;

/**
 * Helper class to run some processing workload as the admin user. Simplifies by encapsulating the
 * session management at this abstracted layer. Run primarily as a Java-8 Lambda, and working very
 * similar to what is also known as an AOP aspect, although not using an 'aspect' but mainly just a
 * Lambda (i.e. 'Functional Interface')
 */
@Component
@Slf4j 
public class AdminRun extends ServiceBase {
	// Runs 'runner' using 'ms' if not null, or falls back to using 'admin' if ms is null
	public <T> T run(MongoSession ms, MongoRunnableEx<T> runner) {
		return ms != null ? runner.run(ms) : run(runner);
	}

	// Runs 'runner' as admin.
	public <T> T run(MongoRunnableEx<T> runner) {
		// Get what session we're runningn from the thread.
		MongoSession savedMs = ThreadLocals.getMongoSession();

		// if this thread is already using 'admin' we can just run the function immediately
		if (savedMs != null && savedMs.isAdmin()) {
			return runner.run(savedMs);
		}

		// otherwise we need to run on the context of admin, and then restore the savedMs afterwards.
		MongoSession as = null;
		T ret = null;
		try {
			// set current session to admin session
			ThreadLocals.setMongoSession(as = auth.getAdminSession());
			ret = runner.run(as);
			update.saveSession(as, true);
		} catch (Exception ex) {
			log.error("error", ex);
			throw ex;
		} finally {
			ThreadLocals.setMongoSession(savedMs);
		}
		return ret;
	}
}
