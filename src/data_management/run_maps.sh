
#!/bin/bash
simplify_pct=0.1
simplify_prs=1
ext=json
mapshaper -i src/data_management/Data/lpr_000b16a_e/lpr_000b16a_e.shp -proj +proj=lcc +lat_1=50 +lat_2=70 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs -simplify $simplify_pct% keep-shapes -o src/SystemMaps/map_output/base_map.$ext precision=$simplify_prs