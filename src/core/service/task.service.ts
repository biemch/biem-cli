import { sleep } from '../../shared/lib/util/sleep.util.js';

export class TaskService {
	public async run<T>(task: () => Promise<T>, delay: number = 150): Promise<T> {
		await this.convienceDelay(delay);
		return task();
	}

	private convienceDelay(wait: number): Promise<unknown> {
		return sleep(wait);
	}
}
