import { unstable_useGridState as useGridState } from "reakit/Grid";

import constate from "constate";

export const [GridProvider, useGridContext] = constate(useGridState);
