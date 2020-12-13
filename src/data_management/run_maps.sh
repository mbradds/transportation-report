
#!/bin/bash
simplify_base=0.05
simplify_prs=1
ext=json
mapshaper -i src/data_management/Data/lpr_000b16a_e/lpr_000b16a_e.shp -proj +proj=lcc +lat_1=50 +lat_2=70 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs -simplify $simplify_base% keep-shapes -o src/SystemMaps/map_output/base_map.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_prototype/Pipeline_Data_Prototype_20201207.shp -proj +proj=lcc +lat_1=50 +lat_2=70 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs -o src/data_management/Data/pipeline.$ext precision=$simplify_prs