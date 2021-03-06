library(sf)
scenario = read.csv("~/Downloads/scenario0e.csv")
names(scenario)
head(scenario)
# https://opendata.arcgis.com/datasets/ae90afc385c04d869bc8cf8890bd1bcd_3.geojson
lads = geojsonsf::geojson_sf("~/Downloads/lads.geojson")
match(scenario$GEOGRAPHY_CODE, lads$lad17cd)
geometry = st_geometry(lads[match(scenario$GEOGRAPHY_CODE, lads$lad17cd),])
scenarios_sf = st_sf(scenario, geometry)
# plot(scenarios_sf[,"GEOGRAPHY_CODE"])
names(scenarios_sf)
spenser = "~/Downloads/spenser_2020.geojson"
write(geojsonsf::sf_geojson(scenarios_sf[scenarios_sf$YEAR == 2020, ]), file = spenser)
table(scenarios_sf$YEAR)
spenser = "~/Downloads/spenser.geojson"
# st_write(scenarios_sf, dsn = spenser, driver = "geojson")
write(geojsonsf::sf_geojson(scenarios_sf), file = spenser)
