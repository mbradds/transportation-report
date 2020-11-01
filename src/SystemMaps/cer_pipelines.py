import geopandas as gpd
import os
import pandas as pd
from os import listdir
from os.path import isfile, join
import pyproj #for checking the epsg code of projected CRS
import matplotlib.pyplot as plt
import sys
if ".." not in sys.path:
    sys.path.append("..") # Adds higher directory to python modules path.
from connection import cer_connection
#%%
crs_geo = 'EPSG:4269' #geographic CRS
crs_proj = 'EPSG:2960' #projected CRS #TODO: this is giving a warning
crs_map = 'EPSG:4269'
crs_hc = "EPSG:4326" #web mercator
crs_hc2 = "EPSG:102002"
crs_hc3 = "+proj=lcc +lat_1=50 +lat_2=70 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs"
#%%

oil_pipelines = ['AURORA PIPE LINE COMPANY LTD',
                 'ENBRIDGE PIPELINES (NW) INC', 
                 'ENBRIDGE PIPELINES INC', 
                 'ENBRIDGE SOUTHERN LIGHTS GP INC ON BEHALF OF ENBRIDGE SOUTHERN LIGHTS LP',
                 'EXPRESS PIPELINE LTD',
                 'KINDER MORGAN COCHIN ULC',
                 'MONTREAL PIPE LINE LIMITED',
                 'TEML WESTSPUR PIPELINES LIMITED',
                 'TRANS MOUNTAIN PIPELINE ULC',
                 'TRANS-NORTHERN PIPELINES INC', 
                 'TRANSCANADA KEYSTONE PIPELINE GP LTD']

gas_pipelines = ['ALLIANCE PIPELINE LTD',
                  'EMERA BRUNSWICK PIPELINE COMPANY LTD',
                  'FOOTHILLS PIPE LINES LTD',
                  'MARITIMES & NORTHEAST PIPELINE MANAGEMENT LTD',
                  'NOVA GAS TRANSMISSION LTD',
                  'TRANS QUEBEC AND MARITIMES PIPELINE INC',
                  'TRANSCANADA PIPELINES LIMITED',
                  'VECTOR PIPELINE LIMITED PARTNERSHIP',
                  'WESTCOAST ENERGY INC, CARRYING ON BUSINESS AS SPECTRA ENERGY TRANSMISSION']

  
oil_query = "select oil.Year,oil.[Corporate Entity],oil.[Pipeline Name],oil.[Key Point],oil.[Direction of Flow],oil.[Trade Type],oil.Product, \
avg(oil.[Throughput (1000 m3/d)]) as [Throughput (1000 m3/d)],avg(oil.[Available Capacity (1000 m3/d)]) as [Available Capacity (1000 m3/d)] \
from (SELECT throughput.[Month],throughput.[Year],throughput.[Corporate Entity],throughput.[Pipeline Name],throughput.[Key Point], \
[Direction of Flow],[Trade Type],[Product],[Throughput (1000 m3/d)], \
capacity.[Available Capacity (1000 m3/d)] FROM [EnergyData].[dbo].[Pipelines_Throughput_Oil] as throughput \
left join [EnergyData].[dbo].[Pipelines_Capacity_Oil] as capacity on throughput.Year = capacity.Year and throughput.Month = capacity.Month \
and throughput.[Corporate Entity] = capacity.[Corporate Entity] and throughput.[Pipeline Name] = capacity.[Pipeline Name] \
and throughput.[Key Point] = capacity.[Key Point] where throughput.[Corporate Entity] <> 'Trans Mountain Pipeline ULC' and throughput.Year = '2019' \
union all \
SELECT throughput.[Month],throughput.[Year],throughput.[Corporate Entity],throughput.[Pipeline Name],throughput.[Key Point], \
[Direction of Flow],[Trade Type],[Product],[Throughput (1000 m3/d)], \
capacity.[Available Capacity (1000 m3/d)] \
FROM [EnergyData].[dbo].[Pipelines_Throughput_Oil] as throughput \
left join [EnergyData].[dbo].[Pipelines_Capacity_Oil] as capacity on throughput.Year = capacity.Year and throughput.Month = capacity.Month \
and throughput.[Corporate Entity] = capacity.[Corporate Entity] and throughput.[Pipeline Name] = capacity.[Pipeline Name] \
where throughput.[Corporate Entity] = 'Trans Mountain Pipeline ULC' and throughput.Year = '2019' \
) as oil group by [Year],[Corporate Entity],[Pipeline Name],[Key Point],[Direction of Flow],[Trade Type],Product"

gas_query = "SELECT [Year],[Corporate Entity],[Pipeline Name],[Key Point],[Direction of Flow],[Trade Type], \
'Natural Gas' as [Product], \
round(avg([Throughput (1000 m3/d)]),1) as [Throughput (1000 m3/d)], \
round(avg([Capacity (1000 m3/d)]),1) as [Available Capacity (1000 m3/d)] \
FROM [EnergyData].[dbo].[Pipelines_Gas] where [Year] = '2019' \
group by [Year],[Corporate Entity],[Pipeline Name],[Key Point],[Direction of Flow], [Trade Type] \
order by [Corporate Entity],[Pipeline Name],[Key Point]"

#size = "availableCapacity"    
size = "throughput"

def params(query, min_buffer=5,max_buffer=15):
 
    conn,engine = cer_connection()
    df = pd.read_sql_query(query,con=conn)
    df = df.sort_values(by=['Corporate Entity','Pipeline Name','Throughput (1000 m3/d)'],ascending=False)
    df = df.groupby(['Corporate Entity','Pipeline Name','Year','Key Point','Direction of Flow']).agg(
                                                                     product=('Product',list),
                                                                     tradeType=('Trade Type',list),
                                                                     #keyPoints=('Key Point',list),
                                                                     throughput=('Throughput (1000 m3/d)','sum'),
                                                                     availableCapacity=('Available Capacity (1000 m3/d)','max')).reset_index()

    max_point = []
    for company in list(set(df['Corporate Entity'])):
        dfc = df[df['Corporate Entity']==company].copy()
        dfc['Direction of Flow'] = list(dfc['Direction of Flow'])
        dfc['product'] = list(dfc['product'])
        dfc['tradeType'] = list(dfc['tradeType'])
        dfc['Total Throughput'] = sum(dfc['throughput'])
        #dfc['availableCapacity'] = max(dfc['availableCapacity'])
        dfc = dfc[dfc['throughput']==max(dfc['throughput'])].copy()
        max_point.append(dfc)
    df = pd.concat(max_point, axis=0, sort=False, ignore_index=True)
                                                                
    df['Capacity Utilization'] = (df['throughput']/df['availableCapacity']).round(2)
    df['Total'] = sum(df['throughput'])
    df['Percent'] = (df[size]/df['Total']).round(3)
    lists = ['product','tradeType']
    for l in lists:
        df[l] = [list(set(x)) for x in df[l]]
        df[l] = [' - '.join(list(x)) for x in df[l]]
    
    diff = max_buffer - min_buffer
    df['buffer'] = [(pct*diff)+min_buffer for pct in df['Percent']]
    del df['Total']
    del df['Percent']
    if query == oil_query:
        df['Corporate Entity'] = df['Corporate Entity'].replace({
            'Enbridge Pipelines Inc.':'ENBRIDGE PIPELINES INC',
            'Enbridge Pipelines (NW) Inc.':'ENBRIDGE PIPELINES (NW) INC',
            'PKM Cochin ULC':'KINDER MORGAN COCHIN ULC',
            'TransCanada Keystone Pipeline GP Ltd.':'TRANSCANADA KEYSTONE PIPELINE GP LTD',
            'Trans Mountain Pipeline ULC':'TRANS MOUNTAIN PIPELINE ULC',
            'Trans-Northern Pipelines Inc.':'TRANS-NORTHERN PIPELINES INC',
            'TEML Westpur Pipelines Limited (TEML)':'TEML WESTSPUR PIPELINES LIMITED'})
    
        for col in ['throughput','availableCapacity']:
            df[col] = (df[col]*6.2898).round(1)
    
    if query == gas_query:
        df['Corporate Entity'] = df['Corporate Entity'].replace({
            'Foothills Pipe Lines Ltd. (Foothills)':'FOOTHILLS PIPE LINES LTD',
            'Trans Québec & Maritimes Pipeline Inc':'TRANS QUEBEC AND MARITIMES PIPELINE INC',
            'Westcoast Energy Inc.':'WESTCOAST ENERGY INC, CARRYING ON BUSINESS AS SPECTRA ENERGY TRANSMISSION',
            'Maritimes & Northeast Pipeline':'MARITIMES & NORTHEAST PIPELINE MANAGEMENT LTD',
            'NOVA Gas Transmission Ltd. (NGTL)':'NOVA GAS TRANSMISSION LTD',
            'Alliance Pipeline Limited Partnership':'ALLIANCE PIPELINE LTD',
            'TransCanada PipeLines Limited':'TRANSCANADA PIPELINES LIMITED'})
    conn.close()
    return df
     

def export_files(df,folder="pipeline_output/oil",name="pipe.geojson"):
    df = df[~df.geometry.is_empty]
    df = df[df.geometry.notna()]
    write_path = os.path.join(os.getcwd(),folder,name)
    df.to_file(write_path, driver='GeoJSON')
    #print('exported: '+name+' to geojson','with CRS: '+str(df.crs))


def process_cer_files(d_type='pipe'):
    pipe_path = r'C:\Users\mossgran\Documents\HighchartsMap\src\pipeline\raw_cer\pipeline.shp'
    pipe = gpd.read_file(pipe_path)
    pipe = pipe.set_geometry('geometry')
    pipe = pipe.to_crs(crs_hc3)
    pipe.crs = crs_hc3
    if d_type == 'pipe':
        pipe_remove = ['MAT_TYPE','MAT_GRADE','STRESS','H2S','FROM_SVY','TO_SVY','RBLC_TYPE','LIC','LINE','UPI','SUBB','SUBC','ORDER_NO',
                        'OD','WT','MOP','SUBA','JOINT','PROTECT','EXCOAT','LTO_YEAR','FROM_FACIL','TO_FACIL','PROVINCE','SOURCE','COMMENT',
                        'UPDATED','LENGTH_CAL','LABEL','SEGMENT','MATERIAL','PROV','PLNAME']
        for remove in pipe_remove:
            del pipe[remove]
    
    pipe['OPERATOR'] = [x.rsplit('(',1)[0].strip().replace('.','') for x in pipe['OPERATOR']]
    export_files(pipe,folder="pipeline/raw_geojson",name="pipeline.geojson")
    return pipe

def import_cer_files():
    pipe_path = r'C:\Users\mossgran\Documents\HighchartsMap\src\pipeline\mapshaper_output\pipeline.json'
    pipe = gpd.read_file(pipe_path)
    pipe = pipe.set_geometry('geometry')
    pipe = pipe[pipe.geometry.notnull()]
    pipe['OPERATOR'] = pipe["OPERATOR"].replace({'TRANS QU�BEC AND MARITIMES PIPELINE INC':'TRANS QUEBEC AND MARITIMES PIPELINE INC'})
    #pipe = pipe.to_crs(crs_hc3)
    pipe.crs = crs_hc3
    return pipe
    

def import_statsCan_files():
    path = r'C:\Users\mossgran\Documents\HighchartsMap\src\statsCan\lpr_000b16a_e\lpr_000b16a_e.shp'
    df = gpd.read_file(path)
    df = df.set_geometry('geometry')
    df['geometry'] = df['geometry'].to_crs(crs_hc3)
    df.crs = crs_hc3
    #print('Read stats can base map with CRS: '+str(df.crs))
    export_files(df,folder="map_output",name="statsCan.geojson")
    return df


def filter_shape(pipes,commodity='oil'):
    pipes = pipes[pipes['STATUS']=="Operating"]
    if commodity == 'oil':
        ranges = params(oil_query,5,25)
        pipelines = oil_pipelines
    if commodity == 'gas':
        ranges = params(gas_query,5,25)
        pipelines = gas_pipelines
        
    for pipe_name in pipelines:
        try:    
            r = ranges[ranges['Corporate Entity']==pipe_name].copy()
            r_buffer = list(r['buffer'])[0]
        except:
            r = pd.DataFrame()
            r_buffer = 5
        
        print(pipe_name)
        if pipe_name != None:
            pipe = pipes[pipes['OPERATOR']==pipe_name].copy()
            pipe = pipe.dissolve(by='OPERATOR')
            pipe = pipe.reset_index()
            buffer_meters = (r_buffer * 1000) * 1.60934
            pipe['geometry'] = pipe['geometry'].buffer(buffer_meters)
            try:
                if not r.empty:    
                    pipe = pipe.merge(r,how='left',left_on='OPERATOR',right_on='Corporate Entity')
                export_files(pipe,folder="pipeline_output/"+commodity,name=pipe_name+'.geojson')
            except:
                print('failed: '+pipe_name)
                #raise
                return pipe
            

        
def plot_map(map_layer,pipe_layer):
    print('pipe crs '+ str(pipe_layer.crs))
    print('map crs '+ str(map_layer.crs))
    fig, ax1 = plt.subplots(figsize=(24,24))
    map_layer.plot(ax=ax1)
    pipe_layer.plot(ax = ax1,color='yellow',edgecolor='black')
    plt.savefig('enbridge.png')
    
def pipe_file_names(mypath):
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    print(onlyfiles)
    

if __name__ == "__main__":
    
    #oil = params(oil_query)
    #gas = params(gas_query)
    #statsCan = import_statsCan_files()
    #process_cer_files()
    pipe = import_cer_files()
    #pipe_names = list(set(pipe['OPERATOR']))
    #print(sorted(pipe_names))
    oil_error = filter_shape(pipe,commodity='oil')
    gas_error = filter_shape(pipe,commodity='gas')
    #pipe_file_names(r'C:\Users\mossgran\Documents\HighchartsMap\pipeline_output')
    #plot_map(statsCan,pipe)

#%%







    

