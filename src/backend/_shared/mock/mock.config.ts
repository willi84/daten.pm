import { FLAKY_SCENARIO } from './mock.d';

const FLAKY = 1;
const NO_FLAKY = 0;
export const SCENARIOS: { [key: string]: FLAKY_SCENARIO } = {
    flaky_0_1_0: [[NO_FLAKY], [FLAKY, NO_FLAKY]],
    flaky_0_0_1: [[NO_FLAKY], [NO_FLAKY], [FLAKY, NO_FLAKY]],
    flaky_1_0_0: [[FLAKY, NO_FLAKY]],
    flaky_4_0_0: [[FLAKY, FLAKY, FLAKY, FLAKY, NO_FLAKY]],
    flaky_2_0_0: [[FLAKY, FLAKY, NO_FLAKY]],
    flaky_2_0_1: [[FLAKY, FLAKY, NO_FLAKY], [], [FLAKY, NO_FLAKY]],
};
