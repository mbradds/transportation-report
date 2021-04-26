
#!/bin/bash
simplify_base=0.05
simplify_prs=1
ext=json
#PADD Map
mapshaper -i src/data_management/Data/paddMap.geojson -simplify 0.7 keep-shapes -o src/data_management/Data/paddMapMin.json precision=$simplify_prs
#Base map for oil and gas pipelines
mapshaper -i src/data_management/Data/lpr_000b16a_e/lpr_000b16a_e.shp -proj +proj=lcc +lat_1=50 +lat_2=70 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs -simplify $simplify_base% keep-shapes -o src/SystemMaps/map_output/base_map.$ext precision=$simplify_prs
#Entire pipeline prototype file. This is run beofre cer_pipelines.py breaks up each system
mapshaper -i src/data_management/Data/pipeline_prototype/Pipeline_Data_Prototype_20201207.shp -proj +proj=lcc +lat_1=50 +lat_2=70 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs -o src/data_management/Data/pipeline.$ext precision=$simplify_prs
#Oil Prototype shapes
mapshaper -i src/data_management/Data/pipeline_output/oil/AuroraPipeline.json -simplify 0.7 keep-shapes -o src/SystemMaps/prototype_output/oil/AuroraPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/CochinPipeline.json -simplify 0.7 keep-shapes -o src/SystemMaps/prototype_output/oil/CochinPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/EnbridgeBakkenSystem.json -simplify 0.7 keep-shapes -o src/SystemMaps/prototype_output/oil/EnbridgeBakkenSystem.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/EnbridgeCanadianMainline.json -simplify 0.7 keep-shapes -o src/SystemMaps/prototype_output/oil/EnbridgeCanadianMainline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/ExpressPipeline.json -simplify 0.7 keep-shapes -o src/SystemMaps/prototype_output/oil/ExpressPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/KeystonePipeline.json -simplify 0.6 keep-shapes -o src/SystemMaps/prototype_output/oil/KeystonePipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/MilkRiverPipeline.json -simplify 0.6 keep-shapes -o src/SystemMaps/prototype_output/oil/MilkRiverPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/MontrealPipeline.json -simplify 0.6 keep-shapes -o src/SystemMaps/prototype_output/oil/MontrealPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/NormanWellsPipeline.json -simplify 0.6 keep-shapes -o src/SystemMaps/prototype_output/oil/NormanWellsPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/SouthernLightsPipeline.json -simplify 0.6 keep-shapes -o src/SystemMaps/prototype_output/oil/SouthernLightsPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/TransMountainPipeline.json -simplify 0.5 keep-shapes -o src/SystemMaps/prototype_output/oil/TransMountainPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/Trans-NorthernPipeline.json -simplify 0.6 keep-shapes -o src/SystemMaps/prototype_output/oil/Trans-NorthernPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/WascanaPipeline.json -simplify 0.6 keep-shapes -o src/SystemMaps/prototype_output/oil/WascanaPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/oil/WestspurPipeline.json -simplify 0.6 keep-shapes -o src/SystemMaps/prototype_output/oil/WestspurPipeline.$ext precision=$simplify_prs
#Gas prototype shapes
mapshaper -i src/data_management/Data/pipeline_output/gas/AlliancePipeline.json -simplify 0.1 keep-shapes -o src/SystemMaps/prototype_output/gas/AlliancePipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/gas/EnbridgeBCPipeline.json -simplify 0.1 keep-shapes -o src/SystemMaps/prototype_output/gas/EnbridgeBCPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/gas/FoothillsSystem.json -simplify 0.2 keep-shapes -o src/SystemMaps/prototype_output/gas/FoothillsSystem.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/gas/GenesisPipeline.json -simplify 0.2 keep-shapes -o src/SystemMaps/prototype_output/gas/GenesisPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/gas/ManyIslandsPipeline.json -simplify 0.2 keep-shapes -o src/SystemMaps/prototype_output/gas/ManyIslandsPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/gas/MNPPipeline.json -simplify 0.2 keep-shapes -o src/SystemMaps/prototype_output/gas/MNPPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/gas/NGTLSystem.json -simplify 0.1 keep-shapes -o src/SystemMaps/prototype_output/gas/NGTLSystem.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/gas/TCCanadianMainline.json -simplify 0.2 keep-shapes -o src/SystemMaps/prototype_output/gas/TCCanadianMainline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/gas/TQMPipeline.json -simplify 0.2 keep-shapes -o src/SystemMaps/prototype_output/gas/TQMPipeline.$ext precision=$simplify_prs
mapshaper -i src/data_management/Data/pipeline_output/gas/VectorPipeline.json -simplify 0.2 keep-shapes -o src/SystemMaps/prototype_output/gas/VectorPipeline.$ext precision=$simplify_prs