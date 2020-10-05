import { kevinCrudeProduction } from "./Kevin/crude_production/crude_production";
import { kevinCrudeExports } from "./Kevin/crude_exports/crude_exports";
import { coletteCrudeByRail } from "./Colette/crude_by_rail/crude_by_rail";
import { cassandraAllPipes } from "./Cassandra/all_pipes/pipeline_metrics";
import { saraGasTraffic } from "./Sara/gas_traffic/gas_traffic";
import { ryanNglExports } from "./Ryan/ngl_exports/ngl_exports";

kevinCrudeProduction();
kevinCrudeExports();
coletteCrudeByRail();
cassandraAllPipes();
saraGasTraffic();
ryanNglExports();
